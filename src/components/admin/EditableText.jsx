import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useContent } from '../../context/ContentContext';

/**
 * Texto que vira campo de edição quando o modo edição está ligado.
 *
 * Edita sempre o idioma ativo: troque o idioma no cabeçalho para escrever
 * a versão em inglês ou árabe do mesmo campo.
 */
export default function EditableText({
  value,
  onSave,
  as: Tag = 'p',
  className = '',
  multiline = false,
  label,
  placeholder = 'Escreva aqui…',
  children,
}) {
  const { localize, language } = useLanguage();
  const { canEdit } = useContent();

  const text = localize(value) || '';
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(text);
  const [saving, setSaving] = useState(false);
  const fieldRef = useRef(null);

  useEffect(() => {
    if (!open) setDraft(text);
  }, [text, open]);

  useEffect(() => {
    if (!open) return;
    const field = fieldRef.current;
    field?.focus();
    field?.setSelectionRange?.(field.value.length, field.value.length);
  }, [open]);

  const commit = async () => {
    if (draft === text) return setOpen(false);
    setSaving(true);
    try {
      await onSave(draft);
      setOpen(false);
    } catch {
      /* o contexto já avisou do erro e desfez a alteração */
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(text);
    setOpen(false);
  };

  if (!canEdit) {
    return <Tag className={className}>{children ?? text}</Tag>;
  }

  if (!open) {
    return (
      <Tag className={`${className} group/edit relative cursor-text`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Editar ${label || 'texto'} (${language.toUpperCase()})`}
          className="relative -mx-1 -my-0.5 inline w-full rounded-sm px-1 py-0.5 text-start outline-dashed outline-1 outline-offset-2 outline-gold/40 transition-colors hover:outline-gold focus-visible:outline-gold-light"
        >
          {children ?? (text || <span className="italic text-text-muted">{placeholder}</span>)}
          <Pencil
            className="ms-2 inline h-3.5 w-3.5 shrink-0 align-baseline text-gold opacity-0 transition-opacity group-hover/edit:opacity-100"
            aria-hidden="true"
          />
        </button>
      </Tag>
    );
  }

  const Field = multiline ? 'textarea' : 'input';

  return (
    <div className={`${className} relative`}>
      <div className="rounded-sm border border-gold/60 bg-black/85 p-2 shadow-gold backdrop-blur">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold">
            {label || 'Texto'} · {language.toUpperCase()}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={commit}
              disabled={saving}
              aria-label="Salvar alteração"
              className="flex h-7 w-7 items-center justify-center border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-background disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancelar edição"
              className="flex h-7 w-7 items-center justify-center border border-white/20 text-text-muted transition-colors hover:border-white/50 hover:text-text"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Field
          ref={fieldRef}
          value={draft}
          rows={multiline ? 5 : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancel();
            if (event.key === 'Enter' && (!multiline || event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              commit();
            }
          }}
          className="w-full resize-y border border-white/15 bg-surface px-3 py-2 font-sans text-sm leading-relaxed text-text outline-none focus:border-gold"
        />
        <p className="mt-1.5 text-[0.62rem] text-text-muted">
          {multiline ? 'Ctrl+Enter salva · Esc cancela' : 'Enter salva · Esc cancela'}
        </p>
      </div>
    </div>
  );
}
