import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Film, Image as ImageIcon, Link2, Loader2, Music, Upload, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const PANEL_WIDTH = 288; // w-72
const MARGIN = 12;

/**
 * Botão sobreposto a uma imagem ou vídeo que permite trocar o arquivo.
 * Aceita upload (vai para o servidor) ou um endereço colado.
 *
 * O painel é renderizado num portal preso ao body: os lugares onde este botão
 * aparece (moldura da imagem, card do integrante, hero) têm `overflow-hidden`,
 * e um painel posicionado dentro deles sairia recortado — invisível.
 */
export default function MediaField({
  value,
  onSave,
  kind = 'image',
  label,
  className = '',
  position = 'top-right',
}) {
  const { canEdit, uploadMedia } = useContent();
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(value || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [coords, setCoords] = useState(null);

  /** Ancora o painel ao botão, virando para cima quando não há espaço abaixo. */
  const place = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 300;
    const spaceBelow = window.innerHeight - rect.bottom;

    const openUpwards = spaceBelow < panelHeight + MARGIN && rect.top > panelHeight + MARGIN;
    const top = openUpwards ? rect.top - panelHeight - 8 : rect.bottom + 8;

    // Alinha pela direita do botão e mantém tudo dentro da janela.
    const rawLeft = rect.right - PANEL_WIDTH;
    const left = Math.min(Math.max(MARGIN, rawLeft), window.innerWidth - PANEL_WIDTH - MARGIN);

    setCoords({ top: Math.max(MARGIN, top), left });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (panelRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      // Não deixa o Escape fechar o modal inteiro por baixo do painel.
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) setUrl(value || '');
  }, [value, open]);

  if (!canEdit) return null;

  // `inline` sai do posicionamento absoluto: serve onde o botao fica ao lado
  // do conteudo, e nao sobreposto a ele (o cabecalho, por exemplo).
  const anchor =
    position === 'inline'
      ? 'relative'
      : position === 'top-right'
        ? 'absolute end-3 top-3'
        : position === 'bottom-right'
          ? 'absolute end-3 bottom-3'
          : 'absolute start-3 top-3';

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const entry = await uploadMedia(file);
      await onSave(entry.url);
      setUrl(entry.url);
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Falha no envio.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleUrl = async () => {
    if (!url.trim()) return;
    setBusy(true);
    setError('');
    try {
      await onSave(url.trim());
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Falha ao salvar.');
    } finally {
      setBusy(false);
    }
  };

  const Icon = kind === 'video' ? Film : kind === 'audio' ? Music : ImageIcon;
  const title = label || (kind === 'video' ? 'Vídeo' : kind === 'audio' ? 'Áudio' : 'Imagem');

  const accept = kind === 'video' ? 'video/*' : kind === 'audio' ? 'audio/*' : 'image/*';
  const placeholderUrl =
    kind === 'video'
      ? 'https://…/embed/ID'
      : kind === 'audio'
        ? 'https://…/musica.mp3'
        : 'https://…/foto.webp';

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`Trocar ${title}`}
      style={{ top: coords?.top ?? -9999, left: coords?.left ?? -9999, width: PANEL_WIDTH }}
      className="fixed z-[120] border border-gold/50 bg-black/95 p-4 shadow-deep backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">{title}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="-me-1 -mt-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-text-muted transition-colors hover:text-gold"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 border border-gold/40 px-3 py-2.5 text-xs text-text transition-colors hover:border-gold hover:text-gold-light disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4" aria-hidden="true" />
        )}
        Enviar arquivo
      </button>

      <div className="my-3 flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-text-muted">
        <span className="h-px flex-1 bg-white/10" />
        ou
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <label className="flex items-center gap-2 border border-white/15 bg-surface px-2 focus-within:border-gold">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
        <span className="sr-only">Endereço do arquivo</span>
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleUrl()}
          placeholder={placeholderUrl}
          className="w-full bg-transparent py-2 text-xs text-text outline-none"
        />
      </label>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="cursor-pointer px-3 py-1.5 text-[0.68rem] uppercase tracking-widest text-text-muted hover:text-text"
        >
          Fechar
        </button>
        <button
          type="button"
          onClick={handleUrl}
          disabled={busy || !url.trim()}
          className="btn btn-gold cursor-pointer px-3 py-1.5 text-[0.62rem] disabled:opacity-50"
        >
          Usar endereço
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[0.68rem] text-red-300">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className={`z-30 ${anchor} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Trocar ${title}`}
        aria-expanded={open}
        className="flex min-h-11 cursor-pointer items-center gap-2 border border-gold/60 bg-black/80 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-gold backdrop-blur transition-colors duration-200 hover:bg-gold hover:text-background"
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        Trocar
      </button>

      {/* O input fica fora do painel para sobreviver ao fechamento dele */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {open && createPortal(panel, document.body)}
    </div>
  );
}
