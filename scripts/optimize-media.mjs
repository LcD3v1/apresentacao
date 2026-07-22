/**
 * Reduz o peso dos arquivos enviados pelo painel.
 *
 *   npm run optimize
 *
 * Fotos saem da câmera ou de captura de tela com um peso que não faz sentido
 * na web: uma logo de 2 MB é exibida a 96 px. Este script converte as imagens
 * para WebP e recomprime os vídeos, depois atualiza as referências no banco.
 *
 * Precisa do ffmpeg no PATH. Os arquivos originais não são apagados.
 */
import { DatabaseSync } from 'node:sqlite';
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const uploadsDir = join(root, 'server', 'uploads');
const dbPath = join(root, 'server', 'data', 'content.db');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm']);

const MAX_IMAGE_WIDTH = 1600;
const IMAGE_QUALITY = 84;
const VIDEO_CRF = 24;

if (!existsSync(dbPath)) {
  console.error('\n  Banco não encontrado. Rode o site uma vez antes de otimizar.\n');
  process.exit(1);
}

try {
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
} catch {
  console.error('\n  ffmpeg não encontrado no PATH — ele é necessário para converter.\n');
  process.exit(1);
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
const ffmpeg = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

/* ------------------------------------------------------- conteúdo atual */

const db = new DatabaseSync(dbPath);
const sections = db.prepare('SELECT section, data FROM site_content').all();
const members = db.prepare('SELECT id, data FROM members').all();

const serialized = JSON.stringify(sections) + JSON.stringify(members);
const referenced = [...new Set(serialized.match(/\/uploads\/[A-Za-z0-9._-]+/g) ?? [])];

/* ---------------------------------------------------------- conversões */

const rename = new Map(); // caminho antigo -> caminho novo
let antes = 0;
let depois = 0;

for (const reference of referenced) {
  const name = reference.replace('/uploads/', '');
  const source = join(uploadsDir, name);
  if (!existsSync(source)) {
    console.warn(`  ausente, ignorado: ${name}`);
    continue;
  }

  const ext = extname(name).toLowerCase();
  const base = name.slice(0, -ext.length);
  const originalSize = statSync(source).size;

  if (IMAGE_EXT.has(ext)) {
    const outName = `${base}-web.webp`;
    const target = join(uploadsDir, outName);
    ffmpeg([
      '-i', source,
      '-vf', `scale='min(${MAX_IMAGE_WIDTH},iw)':-2:flags=lanczos`,
      '-c:v', 'libwebp',
      '-quality', String(IMAGE_QUALITY),
      '-compression_level', '6',
      target,
    ]);
    const newSize = statSync(target).size;
    antes += originalSize;
    depois += newSize;
    rename.set(reference, `/uploads/${outName}`);
    console.log(`  ${mb(originalSize)} MB → ${mb(newSize)} MB   ${outName}`);
  } else if (VIDEO_EXT.has(ext)) {
    const outName = `${base}-web.mp4`;
    const target = join(uploadsDir, outName);
    ffmpeg([
      '-i', source,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', String(VIDEO_CRF),
      '-profile:v', 'high',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      target,
    ]);
    const newSize = statSync(target).size;
    antes += originalSize;
    depois += newSize;
    rename.set(reference, `/uploads/${outName}`);
    console.log(`  ${mb(originalSize)} MB → ${mb(newSize)} MB   ${outName}`);
  }
}

/* ------------------------------------------------ atualiza as referências */

function trocar(texto) {
  let saida = texto;
  for (const [de, para] of rename) saida = saida.split(de).join(para);
  return saida;
}

const agora = new Date().toISOString();
const updateSection = db.prepare('UPDATE site_content SET data = ?, updated_at = ? WHERE section = ?');
const updateMember = db.prepare('UPDATE members SET data = ?, updated_at = ? WHERE id = ?');

for (const row of sections) {
  const novo = trocar(row.data);
  if (novo !== row.data) updateSection.run(novo, agora, row.section);
}

for (const row of members) {
  const novo = trocar(row.data);
  if (novo !== row.data) updateMember.run(novo, agora, row.id);
}

console.log(
  `\n  ${rename.size} arquivo(s) convertidos: ${mb(antes)} MB → ${mb(depois)} MB ` +
    `(${Math.round((1 - depois / antes) * 100)}% menor)`,
);
console.log('  Referências atualizadas no banco. Os originais continuam em server/uploads.\n');
