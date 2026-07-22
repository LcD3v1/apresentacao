/**
 * Congela o conteúdo atual como carga inicial do deploy.
 *
 *   npm run export
 *
 * O banco (server/data) e os arquivos enviados (server/uploads) ficam de fora
 * do versionamento, então uma instalação nova subiria com o conteúdo de
 * demonstração. Este script resolve isso:
 *
 *   1. lê o banco local;
 *   2. copia para public/images/uploads todo arquivo que o conteúdo usa,
 *      fazendo com que ele passe a fazer parte do build;
 *   3. grava src/data/snapshot.json com os caminhos já reescritos.
 *
 * Na primeira execução em produção o servidor popula o banco a partir desse
 * snapshot, e o site sobe exatamente como está aqui.
 */
import { DatabaseSync } from 'node:sqlite';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = join(root, 'server', 'data', 'content.db');
const uploadsDir = join(root, 'server', 'uploads');
const publicUploads = join(root, 'public', 'images', 'uploads');
const snapshotPath = join(root, 'src', 'data', 'snapshot.json');

if (!existsSync(dbPath)) {
  console.error('\n  Nenhum banco encontrado em server/data/content.db.');
  console.error('  Rode o site uma vez (npm run dev) antes de exportar.\n');
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });

const site = {};
for (const row of db.prepare('SELECT section, data FROM site_content').all()) {
  site[row.section] = JSON.parse(row.data);
}

const members = db
  .prepare('SELECT id, position, data FROM members ORDER BY position ASC, id ASC')
  .all()
  .map((row) => ({ ...JSON.parse(row.data), id: row.id, position: row.position }));

/* ------------------------------------------------- arquivos referenciados */

const serialized = JSON.stringify({ site, members });
const referenced = [...new Set(serialized.match(/\/uploads\/[A-Za-z0-9._-]+/g) ?? [])];

// Recria a pasta para não acumular arquivos de exportações antigas.
if (existsSync(publicUploads)) rmSync(publicUploads, { recursive: true, force: true });
mkdirSync(publicUploads, { recursive: true });

const copied = [];
const missing = [];

for (const reference of referenced) {
  const name = reference.replace('/uploads/', '');
  const source = join(uploadsDir, name);
  if (!existsSync(source)) {
    missing.push(name);
    continue;
  }
  copyFileSync(source, join(publicUploads, name));
  copied.push(name);
}

/* ------------------------------------------------------ caminhos novos */

/** Troca /uploads/... por /images/uploads/... em todo texto do conteúdo. */
function rewrite(value) {
  if (typeof value === 'string') return value.split('/uploads/').join('/images/uploads/');
  if (Array.isArray(value)) return value.map(rewrite);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewrite(v)]));
  }
  return value;
}

const snapshot = {
  exportedAt: new Date().toISOString(),
  site: rewrite(site),
  members: rewrite(members),
};

writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

/* ------------------------------------------------------------- relatório */

const totalBytes = readdirSync(publicUploads).reduce(
  (sum, file) => sum + statSync(join(publicUploads, file)).size,
  0,
);

console.log(`\n  Snapshot gravado em src/data/snapshot.json`);
console.log(`  Seções: ${Object.keys(snapshot.site).join(', ')}`);
console.log(`  Integrantes: ${snapshot.members.length}`);
console.log(
  `  Arquivos copiados para public/images/uploads: ${copied.length} (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`,
);

if (missing.length) {
  console.warn(`\n  Aviso: ${missing.length} arquivo(s) referenciados não existem mais em server/uploads:`);
  for (const name of missing) console.warn(`    ${name}`);
  console.warn('  O site vai mostrar o aviso de imagem indisponível nesses pontos.');
}

console.log('');
