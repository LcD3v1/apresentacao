import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useContent } from '../../context/ContentContext';
import useModalBehavior from '../../hooks/useModalBehavior';
import MediaField from './MediaField';
import SmartImage from '../SmartImage';
import { detectVideoType } from '../../utils/video';

/* -------------------------------------------------------- campos base */

function Field({ label, value, onChange, type = 'text', placeholder, dir }) {
  return (
    <label className="block">
      <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        dir={dir}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full border border-white/15 bg-background px-3 py-2 text-sm text-text outline-none focus:border-gold"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full resize-y border border-white/15 bg-background px-3 py-2 text-sm leading-relaxed text-text outline-none focus:border-gold"
      />
    </label>
  );
}

function StringList({ label, items, onChange, placeholder }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Adicionar
        </button>
      </div>

      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
              className="w-full border border-white/15 bg-background px-3 py-2 text-sm text-text outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label={`Remover item ${index + 1}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-text-muted transition-colors hover:border-red-400/60 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
        {!items.length && <li className="text-xs italic text-text-muted">Nenhum item ainda.</li>}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- editor */

export default function MemberEditor({ member, onClose }) {
  const { language, localize } = useLanguage();
  const { persistMember, removeMember, moveMember, members } = useContent();
  const panelRef = useModalBehavior(Boolean(member), onClose);

  const [draft, setDraft] = useState(() => structuredClone(member));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const index = members.findIndex((m) => m.id === member.id);

  /** Escreve no idioma ativo, preservando as demais traduções. */
  const setLocalized = (key, value) => {
    setDraft((current) => {
      const existing = current[key];
      const base =
        existing && typeof existing === 'object' && !Array.isArray(existing)
          ? existing
          : { pt: existing ?? '', en: existing ?? '', ar: existing ?? '' };
      return { ...current, [key]: { ...base, [language]: value } };
    });
  };

  const setRaw = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const localizedList = (key) => {
    const field = draft[key];
    if (Array.isArray(field)) return field;
    return field?.[language] ?? [];
  };

  const setLocalizedList = (key, list) => {
    setDraft((current) => {
      const existing = current[key];
      if (Array.isArray(existing)) return { ...current, [key]: list };
      const base = existing && typeof existing === 'object' ? existing : { pt: [], en: [], ar: [] };
      return { ...current, [key]: { ...base, [language]: list } };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await persistMember(member.id, draft);
      onClose();
    } catch {
      /* o contexto já avisou */
    } finally {
      setSaving(false);
    }
  };

  const timeline = draft.timeline ?? [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[92] flex items-start justify-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Fechar editor"
          onClick={onClose}
          className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
        />

        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-editor-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-full max-h-[100dvh] w-full max-w-4xl flex-col border-gold/30 bg-surface shadow-deep sm:max-h-[92vh] sm:border"
        >
          <header className="flex items-center justify-between gap-4 border-b border-gold/20 px-5 py-4 sm:px-7">
            <div className="min-w-0">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                Editando · idioma {language.toUpperCase()}
              </p>
              <h2 id="member-editor-title" className="mt-1 truncate font-display text-lg text-text">
                {draft.name || 'Integrante'}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => moveMember(member.id, -1)}
                disabled={index <= 0}
                aria-label="Mover para cima"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveMember(member.id, 1)}
                disabled={index === members.length - 1}
                aria-label="Mover para baixo"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label="Fechar editor"
                className="flex h-9 w-9 items-center justify-center border border-white/15 text-text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="no-scrollbar flex-1 space-y-9 overflow-y-auto px-5 py-7 sm:px-7">
            {/* Mídia */}
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { key: 'portrait', label: 'Retrato', ratio: 'aspect-[3/4]' },
                { key: 'backgroundImage', label: 'Fundo do perfil', ratio: 'aspect-video' },
                { key: 'videoThumbnail', label: 'Capa do vídeo', ratio: 'aspect-video' },
              ].map(({ key, label, ratio }) => (
                <div key={key}>
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">{label}</span>
                  <div className={`relative mt-1.5 ${ratio} overflow-hidden border border-white/15`}>
                    <SmartImage src={draft[key]} alt={label} className="h-full w-full" />
                    <MediaField
                      value={draft[key]}
                      label={label}
                      onSave={(url) => setRaw(key, url)}
                      position="bottom-right"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Identificação */}
            <section className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome" value={draft.name} onChange={(v) => setRaw('name', v)} />
              <Field
                label="Nome em árabe"
                value={draft.arabicName}
                dir="rtl"
                onChange={(v) => setRaw('arabicName', v)}
              />
              <Field label="Número" value={draft.number} onChange={(v) => setRaw('number', v)} />
              <Field
                label={`Função (${language.toUpperCase()})`}
                value={localize(draft.role)}
                onChange={(v) => setLocalized('role', v)}
              />
              <Field
                label={`Base (${language.toUpperCase()})`}
                value={localize(draft.location)}
                onChange={(v) => setLocalized('location', v)}
              />
            </section>

            {/* Textos */}
            <section className="space-y-4">
              <TextArea
                label={`Descrição curta (${language.toUpperCase()})`}
                value={localize(draft.shortDescription)}
                rows={3}
                onChange={(v) => setLocalized('shortDescription', v)}
              />
              <TextArea
                label={`Biografia (${language.toUpperCase()})`}
                value={localize(draft.biography)}
                rows={7}
                onChange={(v) => setLocalized('biography', v)}
              />
            </section>

            {/* Listas */}
            <section className="grid gap-8 lg:grid-cols-2">
              <StringList
                label="Por onde passou"
                items={draft.previousPlaces ?? []}
                placeholder="Equipe, empresa ou projeto"
                onChange={(list) => setRaw('previousPlaces', list)}
              />
              <StringList
                label={`Conquistas (${language.toUpperCase()})`}
                items={localizedList('achievements')}
                placeholder="Conquista"
                onChange={(list) => setLocalizedList('achievements', list)}
              />
            </section>

            {/* Linha do tempo */}
            <section>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">
                  Linha do tempo ({language.toUpperCase()})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRaw('timeline', [...timeline, { year: '', title: { [language]: '' }, description: { [language]: '' } }])
                  }
                  className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-widest text-gold hover:text-gold-light"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Adicionar etapa
                </button>
              </div>

              <ul className="mt-3 space-y-3">
                {timeline.map((entry, i) => (
                  <li key={i} className="border border-white/10 bg-background p-4">
                    <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
                      <Field
                        label="Ano"
                        value={entry.year}
                        onChange={(v) => {
                          const next = [...timeline];
                          next[i] = { ...entry, year: v };
                          setRaw('timeline', next);
                        }}
                      />
                      <Field
                        label="Título"
                        value={localize(entry.title)}
                        onChange={(v) => {
                          const next = [...timeline];
                          const base = typeof entry.title === 'object' ? entry.title : {};
                          next[i] = { ...entry, title: { ...base, [language]: v } };
                          setRaw('timeline', next);
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <TextArea
                        label="Descrição"
                        rows={2}
                        value={localize(entry.description)}
                        onChange={(v) => {
                          const next = [...timeline];
                          const base = typeof entry.description === 'object' ? entry.description : {};
                          next[i] = { ...entry, description: { ...base, [language]: v } };
                          setRaw('timeline', next);
                        }}
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setRaw('timeline', timeline.filter((_, x) => x !== i))}
                        className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-widest text-text-muted transition-colors hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remover etapa
                      </button>
                    </div>
                  </li>
                ))}
                {!timeline.length && <li className="text-xs italic text-text-muted">Nenhuma etapa ainda.</li>}
              </ul>
            </section>

            {/* Vídeo */}
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                <label className="block">
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">Tipo</span>
                  <select
                    value={draft.videoType ?? 'x'}
                    onChange={(event) => setRaw('videoType', event.target.value)}
                    className="mt-1.5 w-full border border-white/15 bg-background px-3 py-2 text-sm text-text outline-none focus:border-gold"
                  >
                    <option value="x">Post do X</option>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="mp4">Arquivo MP4</option>
                  </select>
                </label>
                <Field
                  label="Endereço do vídeo"
                  value={draft.videoUrl}
                  placeholder="https://x.com/usuario/status/1966507991743529347"
                  onChange={(v) => {
                    setRaw('videoUrl', v);
                    // Cola o link e o tipo se ajusta sozinho.
                    const detected = detectVideoType(v);
                    if (detected) setRaw('videoType', detected);
                  }}
                />
              </div>

              <div className="relative border border-white/10 p-4">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">
                  Enviar arquivo de vídeo
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  O arquivo enviado vira o endereço do vídeo e o tipo muda para MP4.
                </p>
                <div className="relative mt-9 h-0">
                  <MediaField
                    kind="video"
                    value={draft.videoUrl}
                    label="Vídeo"
                    position="top-left"
                    onSave={(url) => {
                      setRaw('videoUrl', url);
                      setRaw('videoType', url.startsWith('/uploads/') ? 'mp4' : draft.videoType);
                    }}
                  />
                </div>
              </div>

              <Field
                label={`Título do vídeo (${language.toUpperCase()})`}
                value={localize(draft.videoTitle)}
                onChange={(v) => setLocalized('videoTitle', v)}
              />
              <TextArea
                label={`Descrição do vídeo (${language.toUpperCase()})`}
                rows={2}
                value={localize(draft.videoDescription)}
                onChange={(v) => setLocalized('videoDescription', v)}
              />
            </section>

            {/* Galeria e redes */}
            <section className="grid gap-8 lg:grid-cols-2">
              <StringList
                label="Galeria (endereços de imagem)"
                items={draft.gallery ?? []}
                placeholder="/uploads/arquivo.webp"
                onChange={(list) => setRaw('gallery', list)}
              />

              <div className="space-y-3">
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-text-muted">
                  Redes sociais
                </span>
                {['instagram', 'youtube', 'linkedin', 'x'].map((network) => (
                  <Field
                    key={network}
                    label={network}
                    type="url"
                    value={draft.socialLinks?.[network] ?? ''}
                    placeholder="Deixe vazio para ocultar"
                    onChange={(v) =>
                      setRaw('socialLinks', { ...(draft.socialLinks ?? {}), [network]: v })
                    }
                  />
                ))}
              </div>
            </section>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/20 px-5 py-4 sm:px-7">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">Remover este integrante?</span>
                <button
                  type="button"
                  onClick={() => {
                    removeMember(member.id);
                    onClose();
                  }}
                  className="border border-red-400/60 px-3 py-1.5 text-[0.66rem] uppercase tracking-widest text-red-200 transition-colors hover:bg-red-500/20"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-[0.66rem] uppercase tracking-widest text-text-muted hover:text-text"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 text-[0.66rem] uppercase tracking-widest text-text-muted transition-colors hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remover integrante
              </button>
            )}

            <div className="ms-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[0.68rem] uppercase tracking-widest text-text-muted hover:text-text"
              >
                Cancelar
              </button>
              <button type="button" onClick={save} disabled={saving} className="btn btn-gold disabled:opacity-50">
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
