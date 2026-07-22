import { DatabaseSync } from 'node:sqlite';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { members as seedMembers } from '../src/data/members.js';
import { siteContent as seedSite } from '../src/data/siteContent.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, 'data');
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(join(dataDir, 'content.db'));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_content (
    section    TEXT PRIMARY KEY,
    data       TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS members (
    id         INTEGER PRIMARY KEY,
    position   INTEGER NOT NULL,
    data       TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media (
    id         TEXT PRIMARY KEY,
    url        TEXT NOT NULL,
    kind       TEXT NOT NULL,
    filename   TEXT NOT NULL,
    size       INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const now = () => new Date().toISOString();

/* ------------------------------------------------------------- settings */

const readSetting = db.prepare('SELECT value FROM settings WHERE key = ?');
const writeSetting = db.prepare(
  'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
);

export function getSetting(key, fallback = null) {
  const row = readSetting.get(key);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  writeSetting.run(key, String(value));
}

/** Segredo de assinatura dos tokens: gerado uma vez e mantido entre reinícios. */
export function getSessionSecret() {
  let secret = getSetting('session_secret');
  if (!secret) {
    secret = randomBytes(48).toString('hex');
    setSetting('session_secret', secret);
  }
  return secret;
}

/* --------------------------------------------------------- site content */

const selectSite = db.prepare('SELECT section, data FROM site_content');
const upsertSite = db.prepare(`
  INSERT INTO site_content (section, data, updated_at) VALUES (?, ?, ?)
  ON CONFLICT(section) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
`);

export function getSiteContent() {
  const out = {};
  for (const row of selectSite.all()) out[row.section] = JSON.parse(row.data);
  return out;
}

export function saveSiteSection(section, data) {
  upsertSite.run(section, JSON.stringify(data), now());
  return data;
}

/* -------------------------------------------------------------- members */

const selectMembers = db.prepare('SELECT id, position, data FROM members ORDER BY position ASC, id ASC');
const selectMember = db.prepare('SELECT id, position, data FROM members WHERE id = ?');
const upsertMember = db.prepare(`
  INSERT INTO members (id, position, data, updated_at) VALUES (?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET position = excluded.position, data = excluded.data, updated_at = excluded.updated_at
`);
const deleteMemberStmt = db.prepare('DELETE FROM members WHERE id = ?');
const maxId = db.prepare('SELECT COALESCE(MAX(id), 0) AS value FROM members');
const maxPosition = db.prepare('SELECT COALESCE(MAX(position), 0) AS value FROM members');

const hydrate = (row) => ({ ...JSON.parse(row.data), id: row.id, position: row.position });

export function getMembers() {
  return selectMembers.all().map(hydrate);
}

export function getMember(id) {
  const row = selectMember.get(id);
  return row ? hydrate(row) : null;
}

export function saveMember(id, patch) {
  const current = getMember(id);
  if (!current) return null;
  const { position, ...rest } = { ...current, ...patch };
  upsertMember.run(id, position ?? current.position, JSON.stringify({ ...rest, id }), now());
  return getMember(id);
}

export function createMember(payload = {}) {
  const id = maxId.get().value + 1;
  const position = maxPosition.get().value + 1;
  const data = {
    ...payload,
    id,
    number: payload.number ?? String(position).padStart(2, '0'),
  };
  upsertMember.run(id, position, JSON.stringify(data), now());
  return getMember(id);
}

export function deleteMember(id) {
  const existing = getMember(id);
  if (!existing) return false;
  deleteMemberStmt.run(id);
  return true;
}

export function reorderMembers(orderedIds) {
  const stmt = db.prepare('UPDATE members SET position = ?, updated_at = ? WHERE id = ?');
  orderedIds.forEach((id, index) => stmt.run(index + 1, now(), id));
  return getMembers();
}

/* ---------------------------------------------------------------- media */

const insertMedia = db.prepare(
  'INSERT INTO media (id, url, kind, filename, size, created_at) VALUES (?, ?, ?, ?, ?, ?)',
);
const selectMedia = db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT 200');

export function recordMedia(entry) {
  insertMedia.run(entry.id, entry.url, entry.kind, entry.filename, entry.size, now());
  return entry;
}

export function listMedia() {
  return selectMedia.all();
}

/* ----------------------------------------------------------------- seed */

/**
 * Escolhe a carga inicial: o snapshot exportado (`npm run export`) tem
 * prioridade, porque carrega o conteúdo real do site. Sem ele, cai nos
 * arquivos de demonstração em src/data.
 */
function loadSeed() {
  const snapshotPath = join(here, '..', 'src', 'data', 'snapshot.json');

  if (existsSync(snapshotPath)) {
    try {
      const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));
      if (snapshot?.site && Array.isArray(snapshot.members) && snapshot.members.length) {
        return { site: snapshot.site, members: snapshot.members, origem: 'snapshot' };
      }
      console.warn('[db] snapshot.json existe mas está incompleto — usando src/data.');
    } catch (error) {
      console.warn(`[db] snapshot.json ilegível (${error.message}) — usando src/data.`);
    }
  }

  return { site: seedSite, members: seedMembers, origem: 'demonstração' };
}

/** Popula o banco na primeira execução. */
export function seedIfEmpty() {
  const seeded = getSetting('seeded_at');
  if (seeded) return false;

  const { site, members, origem } = loadSeed();

  for (const [section, data] of Object.entries(site)) saveSiteSection(section, data);

  members.forEach((member, index) => {
    const id = Number(member.id) || index + 1;
    upsertMember.run(id, index + 1, JSON.stringify({ ...member, id }), now());
  });

  setSetting('seeded_at', now());
  setSetting('seeded_from', origem);
  return origem;
}

/** Restaura o conteúdo original (usado pelo botão "restaurar padrão" do painel). */
export function resetToSeed() {
  db.exec('DELETE FROM site_content; DELETE FROM members;');
  setSetting('seeded_at', '');
  seedIfEmpty();
  return { site: getSiteContent(), members: getMembers() };
}
