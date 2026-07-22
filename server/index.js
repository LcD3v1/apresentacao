// Confere a versão do Node antes de tudo — precisa vir antes do db.js.
import './preflight.js';

import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import express from 'express';
import multer from 'multer';

import {
  createMember,
  deleteMember,
  getMembers,
  getSiteContent,
  listMedia,
  recordMedia,
  reorderMembers,
  resetToSeed,
  saveMember,
  saveSiteSection,
  seedIfEmpty,
} from './db.js';
import {
  DEFAULT_ADMIN_PASSWORD,
  changePassword,
  checkPassword,
  ensureAdminPassword,
  issueToken,
  requireAuth,
} from './auth.js';

const here = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(here, 'uploads');
mkdirSync(uploadsDir, { recursive: true });

/**
 * Porta da API. A ordem importa: `--port` vence tudo, porque alguns ambientes
 * de desenvolvimento exportam PORT apontando para o servidor web e a API
 * acabaria brigando pela mesma porta.
 */
function resolvePort() {
  const flagIndex = process.argv.indexOf('--port');
  const fromFlag = flagIndex > -1 ? Number(process.argv[flagIndex + 1]) : NaN;
  if (Number.isInteger(fromFlag) && fromFlag > 0) return fromFlag;

  const fromEnv = Number(process.env.API_PORT || process.env.PORT);
  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : 3001;
}

const PORT = resolvePort();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Pasta do site construído (`npm run build`). */
const distDir = join(here, '..', 'dist');
const hasBuild = existsSync(join(distDir, 'index.html'));

const app = express();

// Atrás do proxy da hospedagem, para o Express ler o IP e o protocolo reais.
app.set('trust proxy', 1);

/*
 * Em produção o site é servido por este mesmo processo, então não há outra
 * origem para liberar. CORS só entra se você hospedar o front separado e
 * definir CORS_ORIGIN. Em desenvolvimento o Vite faz proxy, também sem CORS.
 */
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) }));
}

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

/* -------------------------------------------------------------- uploads */

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'audio/mpeg': '.mp3',
  'audio/mp4': '.m4a',
  'audio/aac': '.aac',
  'audio/ogg': '.ogg',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/webm': '.weba',
};

const AUDIO_MIME = new Set(Object.keys(ALLOWED).filter((m) => m.startsWith('audio/')));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = ALLOWED[file.mimetype] || extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 512 * 1024 * 1024 }, // 512 MB, o bastante para um filme curto
  fileFilter: (_req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    return cb(new Error(`Formato não suportado: ${file.mimetype}`));
  },
});

/* --------------------------------------------------------------- rotas */

app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

/* ------------------------------------------------------- tempo real */

/**
 * Canal de avisos (Server-Sent Events).
 *
 * Cada aba aberta mantém uma conexão e recebe um aviso sempre que o conteúdo
 * muda, sem precisar recarregar. O aviso carrega só o `origin` — quem fez a
 * alteração ignora o próprio eco e não recarrega à toa.
 */
const listeners = new Set();

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    // Impede o proxy da hospedagem de segurar a resposta em buffer.
    'X-Accel-Buffering': 'no',
  });

  res.write('retry: 5000\n\n');
  listeners.add(res);

  req.on('close', () => {
    listeners.delete(res);
  });
});

function broadcast(event, payload = {}) {
  const frame = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of listeners) {
    try {
      client.write(frame);
    } catch {
      listeners.delete(client);
    }
  }
}

/** Avisa que o conteúdo mudou, marcando quem foi para evitar eco. */
const announce = (req, detail = {}) =>
  broadcast('content', { origin: req.get('x-client-id') || null, ...detail });

// Sinal de vida: sem tráfego, proxies costumam cortar conexões ociosas.
setInterval(() => broadcast('ping', { at: Date.now() }), 25000).unref();

/** Conteúdo público do site — é o que o front consome ao carregar. */
app.get('/api/content', (_req, res) => {
  res.json({ site: getSiteContent(), members: getMembers() });
});

app.post('/api/auth/login', (req, res) => {
  if (!checkPassword(req.body?.password)) {
    return res.status(401).json({ error: 'invalid_password', message: 'Senha incorreta.' });
  }
  return res.json({ token: issueToken() });
});

app.get('/api/auth/session', requireAuth, (_req, res) => res.json({ valid: true }));

app.post('/api/auth/password', requireAuth, (req, res) => {
  const { current, next } = req.body ?? {};
  if (!next || String(next).length < 6) {
    return res.status(400).json({ error: 'weak_password', message: 'Use pelo menos 6 caracteres.' });
  }
  if (!changePassword(current, next)) {
    return res.status(401).json({ error: 'invalid_password', message: 'Senha atual incorreta.' });
  }
  return res.json({ ok: true });
});

app.put('/api/site/:section', requireAuth, (req, res) => {
  const { section } = req.params;
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'invalid_payload' });
  }
  const saved = saveSiteSection(section, req.body);
  announce(req, { scope: 'site', section });
  return res.json(saved);
});

app.get('/api/members', (_req, res) => res.json(getMembers()));

app.post('/api/members', requireAuth, (req, res) => {
  const created = createMember(req.body ?? {});
  announce(req, { scope: 'members', action: 'create' });
  res.status(201).json(created);
});

app.put('/api/members/reorder', requireAuth, (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'invalid_payload' });
  const ordered = reorderMembers(ids.map(Number));
  announce(req, { scope: 'members', action: 'reorder' });
  return res.json(ordered);
});

app.put('/api/members/:id', requireAuth, (req, res) => {
  const updated = saveMember(Number(req.params.id), req.body ?? {});
  if (!updated) return res.status(404).json({ error: 'not_found' });
  announce(req, { scope: 'members', action: 'update', id: updated.id });
  return res.json(updated);
});

app.delete('/api/members/:id', requireAuth, (req, res) => {
  if (!deleteMember(Number(req.params.id))) return res.status(404).json({ error: 'not_found' });
  announce(req, { scope: 'members', action: 'delete' });
  return res.json({ ok: true });
});

app.get('/api/media', requireAuth, (_req, res) => res.json(listMedia()));

app.post('/api/media', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no_file' });
  const kind = AUDIO_MIME.has(req.file.mimetype)
    ? 'audio'
    : req.file.mimetype.startsWith('video/')
      ? 'video'
      : 'image';
  const entry = recordMedia({
    id: randomUUID(),
    url: `/uploads/${req.file.filename}`,
    kind,
    filename: req.file.originalname,
    size: req.file.size,
  });
  return res.status(201).json(entry);
});

app.delete('/api/media/:filename', requireAuth, (req, res) => {
  // Impede subir na árvore de diretórios a partir do nome recebido.
  const safe = req.params.filename.replace(/[^a-zA-Z0-9._-]/g, '');
  const target = join(uploadsDir, safe);
  if (!safe || !target.startsWith(uploadsDir) || !existsSync(target)) {
    return res.status(404).json({ error: 'not_found' });
  }
  unlinkSync(target);
  return res.json({ ok: true });
});

app.post('/api/content/reset', requireAuth, (req, res) => {
  const restored = resetToSeed();
  announce(req, { scope: 'all', action: 'reset' });
  return res.json(restored);
});

/* ------------------------------------------------------------- site */

/*
 * Serve o site construído. Fica depois das rotas de API para não engolir
 * nenhuma delas, e devolve o index.html em qualquer outro caminho para o
 * roteamento do front continuar funcionando ao recarregar a página.
 */
if (hasBuild) {
  app.use(express.static(distDir, { maxAge: '1y', index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(join(distDir, 'index.html'));
  });
}

/* ------------------------------------------------------------- erros */

app.use((error, _req, res, _next) => {
  const isMulter = error instanceof multer.MulterError;
  const status = isMulter ? 413 : 400;
  console.error('[api]', error.message);
  res.status(status).json({ error: 'upload_failed', message: error.message });
});

/* ------------------------------------------------------------- start */

const seeded = seedIfEmpty();
const admin = ensureAdminPassword();

/*
 * Em produção a senha padrão é pública (está no README), então deixar o painel
 * de edição aberto com ela seria entregar o site. Melhor não subir do que subir
 * exposto.
 */
if (IS_PRODUCTION && admin.source === 'default') {
  console.error('\n  Falta definir a senha do painel.\n');
  console.error('  Defina a variável de ambiente ADMIN_PASSWORD antes de iniciar.');
  console.error('  Sem ela o painel ficaria com a senha padrão, que é pública.\n');
  process.exit(1);
}

if (IS_PRODUCTION && !hasBuild) {
  console.error('\n  O site ainda não foi construído.\n');
  console.error('  Rode `npm run build` antes de iniciar — é ele que gera a pasta dist/.\n');
  process.exit(1);
}

app.listen(PORT, () => {
  const modo = IS_PRODUCTION ? 'produção' : 'desenvolvimento';
  console.log(`\n  ARABIA GANG · ${modo} · porta ${PORT}`);
  console.log(hasBuild ? '  Site e API no mesmo processo.' : '  Somente API (sem dist/).');
  if (seeded) console.log('  Banco criado e populado com o conteúdo inicial.');

  if (admin.source === 'default') {
    console.log(`  Senha do painel (padrão): ${admin.password ?? DEFAULT_ADMIN_PASSWORD}`);
    console.log('  Defina ADMIN_PASSWORD no ambiente para trocar.\n');
  } else {
    console.log(`  Senha do painel: definida via ${admin.source}.\n`);
  }
});
