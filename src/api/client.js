/**
 * Cliente da API.
 *
 * Em desenvolvimento o Vite faz proxy de /api e /uploads para o servidor
 * (vite.config.js). Em produção, sirva o front pelo mesmo domínio da API
 * ou defina VITE_API_URL.
 */
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const TOKEN_KEY = 'al-thamaniya:token';

/**
 * Identifica esta aba. Vai junto em toda alteração e volta no aviso de
 * tempo real, para quem editou não recarregar por causa da própria mudança.
 */
export const CLIENT_ID =
  globalThis.crypto?.randomUUID?.() ?? `c${Date.now()}${Math.random().toString(36).slice(2)}`;

/** Endereço do canal de avisos (Server-Sent Events). */
export const eventsUrl = () => `${BASE}/api/events`;

export const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const writeToken = (token) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* modo privado: a sessão dura só enquanto a aba estiver aberta */
  }
};

async function request(path, { method = 'GET', body, auth = false, raw } = {}) {
  const headers = { 'X-Client-Id': CLIENT_ID };
  if (auth) headers.Authorization = `Bearer ${readToken()}`;
  if (body && !raw) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: raw ? body : body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || `Falha na requisição (${response.status})`);
    error.status = response.status;
    error.code = payload?.error;
    throw error;
  }

  return payload;
}

export const api = {
  getContent: () => request('/api/content'),

  login: (password) => request('/api/auth/login', { method: 'POST', body: { password } }),
  checkSession: () => request('/api/auth/session', { auth: true }),
  changePassword: (current, next) =>
    request('/api/auth/password', { method: 'POST', auth: true, body: { current, next } }),

  saveSiteSection: (section, data) =>
    request(`/api/site/${section}`, { method: 'PUT', auth: true, body: data }),

  saveMember: (id, patch) => request(`/api/members/${id}`, { method: 'PUT', auth: true, body: patch }),
  createMember: (payload) => request('/api/members', { method: 'POST', auth: true, body: payload }),
  deleteMember: (id) => request(`/api/members/${id}`, { method: 'DELETE', auth: true }),
  reorderMembers: (ids) => request('/api/members/reorder', { method: 'PUT', auth: true, body: { ids } }),

  resetContent: () => request('/api/content/reset', { method: 'POST', auth: true }),

  uploadMedia: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/api/media', { method: 'POST', auth: true, body: form, raw: true });
  },
};

export default api;
