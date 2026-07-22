/**
 * Baixa as imagens geradas no Higgsfield para public/images/ai.
 *
 * Recebe pares "arquivo=url" na linha de comando:
 *   node scripts/fetch-ai-images.mjs portrait-01=https://... hero=https://...
 *
 * Mantido no repositório para dar rastreabilidade: os arquivos em
 * public/images/ai vieram destes endereços.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images', 'ai');
mkdirSync(outDir, { recursive: true });

const pairs = process.argv.slice(2).map((arg) => {
  const at = arg.indexOf('=');
  return { name: arg.slice(0, at), url: arg.slice(at + 1) };
});

if (!pairs.length) {
  console.error('Uso: node scripts/fetch-ai-images.mjs nome=url [nome=url ...]');
  process.exit(1);
}

let failures = 0;

for (const { name, url } of pairs) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = url.includes('.webp') ? '.webp' : url.includes('.jpg') ? '.jpg' : '.png';
    const file = join(outDir, `${name}${ext}`);
    writeFileSync(file, buffer);
    console.log(`  ${name}${ext}  ${(buffer.length / 1024).toFixed(0)} KB`);
  } catch (error) {
    failures += 1;
    console.error(`  FALHOU ${name}: ${error.message}`);
  }
}

process.exit(failures ? 1 : 0);
