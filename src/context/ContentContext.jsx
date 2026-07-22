import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api, { CLIENT_ID, eventsUrl, readToken, writeToken } from '../api/client';
import { members as fallbackMembers } from '../data/members';
import { siteContent as fallbackSite } from '../data/siteContent';
import { useLanguage } from './LanguageContext';

const ContentContext = createContext(null);

/** Escreve um valor no idioma atual, preservando as outras traduções. */
function writeLocalized(current, value, language) {
  if (current && typeof current === 'object' && !Array.isArray(current)) {
    return { ...current, [language]: value };
  }
  const base = typeof current === 'string' ? current : '';
  return { pt: base, en: base, ar: base, [language]: value };
}

export function ContentProvider({ children }) {
  const { language } = useLanguage();

  const [site, setSite] = useState(fallbackSite);
  const [members, setMembers] = useState(fallbackMembers);
  const [status, setStatus] = useState('loading'); // loading | online | offline
  const [live, setLive] = useState('conectando'); // conectando | live | reconectando | polling
  // Espelho do estado de admin, para o canal SSE ler sem se reinscrever.
  const adminRef = useRef(false);
  const [token, setToken] = useState(() => readToken());
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = 'info') => {
    setToast({ message, tone, id: Date.now() });
    window.setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 2600 ? null : t)), 2800);
  }, []);

  /* ------------------------------------------------------------ carga */

  const load = useCallback(async () => {
    try {
      const data = await api.getContent();
      if (data?.site && Object.keys(data.site).length) setSite(data.site);
      if (Array.isArray(data?.members) && data.members.length) setMembers(data.members);
      setStatus('online');
      return true;
    } catch {
      // Sem API no ar o site continua de pé com o conteúdo do repositório.
      setStatus('offline');
      return false;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Sincronia em tempo real.
   *
   * O servidor avisa por SSE quando alguém edita, e a aba recarrega o conteúdo
   * sozinha — sem F5 e sem reiniciar nada. Se o canal não abrir (proxy que corta
   * conexão longa, navegador antigo), cai para uma sondagem periódica.
   */
  useEffect(() => {
    let source = null;
    let pollTimer = null;
    let connectTimer = null;
    let encerrado = false;

    const startPolling = () => {
      if (pollTimer || encerrado) return;
      setLive('polling');
      pollTimer = window.setInterval(load, 20000);
    };

    const stopPolling = () => {
      if (!pollTimer) return;
      window.clearInterval(pollTimer);
      pollTimer = null;
    };

    if (typeof window.EventSource === 'undefined') {
      startPolling();
      return () => {
        encerrado = true;
        stopPolling();
      };
    }

    source = new EventSource(eventsUrl());

    source.onopen = () => {
      stopPolling();
      setLive('live');
    };

    source.addEventListener('content', (event) => {
      let payload = {};
      try {
        payload = JSON.parse(event.data || '{}');
      } catch {
        /* aviso sem corpo — recarrega mesmo assim */
      }
      // Quem fez a alteração já está com ela na tela.
      if (payload.origin && payload.origin === CLIENT_ID) return;

      load().then((ok) => {
        // Visitante recebe em silêncio; quem edita merece saber que mudou.
        if (ok && adminRef.current) notify('Conteúdo atualizado em outra aba.');
      });
    });

    source.onerror = () => {
      // O EventSource tenta reconectar sozinho; a sondagem cobre o intervalo.
      setLive((atual) => (atual === 'live' ? 'reconectando' : atual));
      startPolling();
    };

    // Se em 8 s o canal não abriu, assume que esta hospedagem não sustenta SSE.
    connectTimer = window.setTimeout(() => {
      if (source?.readyState !== 1) startPolling();
    }, 8000);

    return () => {
      encerrado = true;
      window.clearTimeout(connectTimer);
      stopPolling();
      source?.close();
    };
  }, [load]);

  // Confere se o token guardado ainda vale antes de mostrar o modo edição.
  useEffect(() => {
    if (!token) return;
    api.checkSession().catch(() => {
      writeToken('');
      setToken('');
      setEditing(false);
    });
  }, [token]);

  /* ------------------------------------------------------------ sessão */

  const login = useCallback(
    async (password) => {
      const { token: fresh } = await api.login(password);
      writeToken(fresh);
      setToken(fresh);
      setEditing(true);
      notify('Modo edição ativado.', 'success');
      return true;
    },
    [notify],
  );

  const logout = useCallback(() => {
    writeToken('');
    setToken('');
    setEditing(false);
    notify('Sessão encerrada.');
  }, [notify]);

  const isAdmin = Boolean(token);
  const canEdit = isAdmin && editing && status === 'online';

  useEffect(() => {
    adminRef.current = isAdmin;
  }, [isAdmin]);

  /* ----------------------------------------------------------- escrita */

  /**
   * Salva otimista: aplica na tela, envia para a API e desfaz se falhar.
   */
  const persistSite = useCallback(
    async (section, nextSection, previous) => {
      setSite((current) => ({ ...current, [section]: nextSection }));
      try {
        await api.saveSiteSection(section, nextSection);
      } catch (error) {
        setSite((current) => ({ ...current, [section]: previous }));
        notify(error.message || 'Não foi possível salvar.', 'error');
        throw error;
      }
    },
    [notify],
  );

  const setSiteField = useCallback(
    (section, key, value, { localized = true } = {}) => {
      const currentSection = site[section] ?? {};
      const nextValue = localized ? writeLocalized(currentSection[key], value, language) : value;
      return persistSite(section, { ...currentSection, [key]: nextValue }, currentSection);
    },
    [site, language, persistSite],
  );

  const persistMember = useCallback(
    async (id, patch) => {
      const previous = members.find((m) => m.id === id);
      setMembers((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      try {
        await api.saveMember(id, patch);
      } catch (error) {
        setMembers((current) => current.map((m) => (m.id === id ? previous : m)));
        notify(error.message || 'Não foi possível salvar.', 'error');
        throw error;
      }
    },
    [members, notify],
  );

  const setMemberField = useCallback(
    (id, key, value, { localized = true } = {}) => {
      const member = members.find((m) => m.id === id);
      if (!member) return Promise.resolve();
      const nextValue = localized ? writeLocalized(member[key], value, language) : value;
      return persistMember(id, { [key]: nextValue });
    },
    [members, language, persistMember],
  );

  const addMember = useCallback(async () => {
    const position = members.length + 1;
    const number = String(position).padStart(2, '0');
    const created = await api.createMember({
      number,
      name: 'Novo integrante',
      arabicName: 'عضو جديد',
      role: { pt: 'Função', en: 'Role', ar: 'الدور' },
      location: { pt: 'Cidade, País', en: 'City, Country', ar: 'المدينة، الدولة' },
      portrait: '/images/member-01-portrait.svg',
      backgroundImage: '/images/ai/backdrop-01.webp',
      shortDescription: { pt: 'Breve descrição.', en: 'Short description.', ar: 'وصف قصير.' },
      biography: { pt: 'Biografia completa.', en: 'Full biography.', ar: 'السيرة الكاملة.' },
      previousPlaces: [],
      timeline: [],
      achievements: { pt: [], en: [], ar: [] },
      videoType: 'youtube',
      videoUrl: '',
      videoThumbnail: '/images/member-01-video.svg',
      videoTitle: { pt: 'Título do vídeo', en: 'Video title', ar: 'عنوان الفيلم' },
      videoDescription: { pt: '', en: '', ar: '' },
      gallery: [],
      socialLinks: { instagram: '', youtube: '', linkedin: '', x: '' },
    });
    setMembers((current) => [...current, created]);
    notify('Integrante criado.', 'success');
    return created;
  }, [members.length, notify]);

  const removeMember = useCallback(
    async (id) => {
      const previous = members;
      setMembers((current) => current.filter((m) => m.id !== id));
      try {
        await api.deleteMember(id);
        notify('Integrante removido.', 'success');
      } catch (error) {
        setMembers(previous);
        notify(error.message || 'Não foi possível remover.', 'error');
      }
    },
    [members, notify],
  );

  const moveMember = useCallback(
    async (id, direction) => {
      const index = members.findIndex((m) => m.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= members.length) return;

      const next = [...members];
      [next[index], next[target]] = [next[target], next[index]];
      setMembers(next);
      try {
        await api.reorderMembers(next.map((m) => m.id));
      } catch (error) {
        setMembers(members);
        notify(error.message || 'Não foi possível reordenar.', 'error');
      }
    },
    [members, notify],
  );

  const resetContent = useCallback(async () => {
    const data = await api.resetContent();
    setSite(data.site);
    setMembers(data.members);
    notify('Conteúdo original restaurado.', 'success');
  }, [notify]);

  const uploadMedia = useCallback(
    async (file) => {
      const entry = await api.uploadMedia(file);
      notify('Arquivo enviado.', 'success');
      return entry;
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      site,
      members,
      status,
      live,
      isAdmin,
      editing,
      canEdit,
      toast,
      notify,
      setEditing,
      login,
      logout,
      reload: load,
      setSiteField,
      setMemberField,
      persistMember,
      addMember,
      removeMember,
      moveMember,
      resetContent,
      uploadMedia,
    }),
    [
      site,
      members,
      status,
      live,
      isAdmin,
      editing,
      canEdit,
      toast,
      notify,
      login,
      logout,
      load,
      setSiteField,
      setMemberField,
      persistMember,
      addMember,
      removeMember,
      moveMember,
      resetContent,
      uploadMedia,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent precisa estar dentro de <ContentProvider>.');
  return ctx;
}

export default ContentContext;
