import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { getSessionSecret, getSetting, setSetting } from './db.js';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 horas

/** Senha usada só até alguém definir ADMIN_PASSWORD ou trocá-la pelo painel. */
export const DEFAULT_ADMIN_PASSWORD = 'thamaniya2026';

/* ------------------------------------------------------------ password */

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, stored) {
  const [salt, expected] = String(stored).split(':');
  if (!salt || !expected) return false;
  const derived = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (derived.length !== expectedBuffer.length) return false;
  return timingSafeEqual(derived, expectedBuffer);
}

/**
 * Define a senha do painel na primeira execução.
 * Use ADMIN_PASSWORD no ambiente; sem ela, cai no padrão de desenvolvimento.
 */
export function ensureAdminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD;
  const storedHash = getSetting('admin_password');
  const storedSource = getSetting('admin_password_source');

  if (fromEnv) {
    // Se a variável mudou, a senha nova vale a partir de agora.
    if (!storedHash || storedSource !== 'env' || !verifyPassword(fromEnv, storedHash)) {
      setSetting('admin_password', hashPassword(fromEnv));
      setSetting('admin_password_source', 'env');
    }
    return { source: 'env' };
  }

  if (!storedHash) {
    setSetting('admin_password', hashPassword(DEFAULT_ADMIN_PASSWORD));
    setSetting('admin_password_source', 'default');
    return { source: 'default', password: DEFAULT_ADMIN_PASSWORD };
  }

  return { source: storedSource || 'stored' };
}

export function checkPassword(password) {
  const stored = getSetting('admin_password');
  return Boolean(stored) && verifyPassword(String(password ?? ''), stored);
}

export function changePassword(current, next) {
  if (!checkPassword(current)) return false;
  setSetting('admin_password', hashPassword(String(next)));
  setSetting('admin_password_source', 'manual');
  return true;
}

/* --------------------------------------------------------------- token */

const sign = (payload) =>
  createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');

export function issueToken() {
  const payload = `${Date.now() + TOKEN_TTL_MS}.${randomBytes(8).toString('hex')}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;

  let payload;
  try {
    payload = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return false;
  }

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload.split('.')[0]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/** Middleware Express: exige um token válido no cabeçalho Authorization. */
export function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'unauthorized', message: 'Sessão expirada ou inválida.' });
  }
  return next();
}
