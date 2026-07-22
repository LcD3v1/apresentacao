/**
 * Gera um favicon quadrado a partir de uma imagem PNG.
 *
 *   node scripts/make-favicon.mjs <entrada.png> [tamanho]
 *
 * Decodifica, reduz por média de blocos e recompõe centralizado sobre o fundo
 * do site. Sem dependências: só zlib, que já vem no Node. A logo original tem
 * mais de 2 MB — grande demais para servir como ícone de aba.
 */
import { deflateSync, inflateSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const BACKGROUND = [5, 7, 6]; // --background do site

/* ------------------------------------------------------------- decodificar */

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') throw new Error('não é um PNG');

  let offset = 8;
  const idat = [];
  let header = null;
  let palette = null;
  let transparency = null;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === 'PLTE') palette = Buffer.from(data);
    else if (type === 'tRNS') transparency = Buffer.from(data);
    else if (type === 'IDAT') idat.push(Buffer.from(data));
    else if (type === 'IEND') break;

    offset += 12 + length;
  }

  if (!header) throw new Error('PNG sem cabeçalho IHDR');
  if (header.bitDepth !== 8) throw new Error(`profundidade ${header.bitDepth} não suportada`);
  if (header.interlace !== 0) throw new Error('PNG entrelaçado não suportado');

  const channelsByType = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
  const channels = channelsByType[header.colorType];
  if (!channels) throw new Error(`tipo de cor ${header.colorType} não suportado`);

  const raw = inflateSync(Buffer.concat(idat));
  const { width, height } = header;
  const stride = width * channels;
  const pixels = Buffer.alloc(width * height * 4);

  let previous = Buffer.alloc(stride);
  let cursor = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[cursor++];
    const line = Buffer.from(raw.subarray(cursor, cursor + stride));
    cursor += stride;

    // Desfaz o filtro da linha (spec do PNG, seção 9.2)
    for (let i = 0; i < stride; i++) {
      const left = i >= channels ? line[i - channels] : 0;
      const up = previous[i];
      const upLeft = i >= channels ? previous[i - channels] : 0;

      if (filter === 1) line[i] = (line[i] + left) & 0xff;
      else if (filter === 2) line[i] = (line[i] + up) & 0xff;
      else if (filter === 3) line[i] = (line[i] + ((left + up) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const pred = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        line[i] = (line[i] + pred) & 0xff;
      }
    }

    for (let x = 0; x < width; x++) {
      const target = (y * width + x) * 4;
      const source = x * channels;

      if (header.colorType === 3) {
        const index = line[source];
        pixels[target] = palette[index * 3];
        pixels[target + 1] = palette[index * 3 + 1];
        pixels[target + 2] = palette[index * 3 + 2];
        pixels[target + 3] = transparency?.[index] ?? 255;
      } else if (header.colorType === 0 || header.colorType === 4) {
        const grey = line[source];
        pixels[target] = grey;
        pixels[target + 1] = grey;
        pixels[target + 2] = grey;
        pixels[target + 3] = header.colorType === 4 ? line[source + 1] : 255;
      } else {
        pixels[target] = line[source];
        pixels[target + 1] = line[source + 1];
        pixels[target + 2] = line[source + 2];
        pixels[target + 3] = header.colorType === 6 ? line[source + 3] : 255;
      }
    }

    previous = line;
  }

  return { width, height, pixels };
}

/* ------------------------------------------------------------- redimensionar */

/** Reduz por média de blocos e centraliza num quadrado sobre o fundo do site. */
function fitToSquare(image, size) {
  const scale = Math.min(size / image.width, size / image.height);
  const drawWidth = Math.max(1, Math.round(image.width * scale));
  const drawHeight = Math.max(1, Math.round(image.height * scale));
  const offsetX = Math.floor((size - drawWidth) / 2);
  const offsetY = Math.floor((size - drawHeight) / 2);

  const out = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    out[i * 4] = BACKGROUND[0];
    out[i * 4 + 1] = BACKGROUND[1];
    out[i * 4 + 2] = BACKGROUND[2];
    out[i * 4 + 3] = 255;
  }

  const blockX = image.width / drawWidth;
  const blockY = image.height / drawHeight;

  for (let y = 0; y < drawHeight; y++) {
    const y0 = Math.floor(y * blockY);
    const y1 = Math.max(y0 + 1, Math.floor((y + 1) * blockY));

    for (let x = 0; x < drawWidth; x++) {
      const x0 = Math.floor(x * blockX);
      const x1 = Math.max(x0 + 1, Math.floor((x + 1) * blockX));

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let sy = y0; sy < y1 && sy < image.height; sy++) {
        for (let sx = x0; sx < x1 && sx < image.width; sx++) {
          const i = (sy * image.width + sx) * 4;
          r += image.pixels[i];
          g += image.pixels[i + 1];
          b += image.pixels[i + 2];
          a += image.pixels[i + 3];
          count++;
        }
      }

      const alpha = a / count / 255;
      const target = ((y + offsetY) * size + (x + offsetX)) * 4;

      // Compõe sobre o fundo, respeitando a transparência do original
      out[target] = Math.round((r / count) * alpha + BACKGROUND[0] * (1 - alpha));
      out[target + 1] = Math.round((g / count) * alpha + BACKGROUND[1] * (1 - alpha));
      out[target + 2] = Math.round((b / count) * alpha + BACKGROUND[2] * (1 - alpha));
      out[target + 3] = 255;
    }
  }

  return { width: size, height: size, pixels: out };
}

/* ---------------------------------------------------------------- codificar */

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng({ width, height, pixels }) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bits por canal
  header[9] = 6; // RGBA
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // sem filtro
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* --------------------------------------------------------------------- run */

const [input, sizeArg] = process.argv.slice(2);
if (!input) {
  console.error('Uso: node scripts/make-favicon.mjs <entrada.png> [tamanho]');
  process.exit(1);
}

const size = Number(sizeArg) || 256;
const source = decodePng(readFileSync(input));
const square = fitToSquare(source, size);
const output = join(root, 'public', 'favicon.png');
writeFileSync(output, encodePng(square));

const before = readFileSync(input).length;
const after = readFileSync(output).length;
console.log(
  `favicon.png  ${size}x${size}  ${(after / 1024).toFixed(0)} KB ` +
    `(origem ${source.width}x${source.height}, ${(before / 1024).toFixed(0)} KB)`,
);
