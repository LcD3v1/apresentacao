import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useModalBehavior from '../hooks/useModalBehavior';
import { CornerOrnaments } from './ArabicPattern';
import { resolveVideoSource } from '../utils/video';

const X_EMBED_ORIGIN = 'https://platform.twitter.com';
const X_DEFAULT_HEIGHT = 560;

/** Largura fixa do cartão do X. Alargar o iframe só acrescenta espaço vazio. */
const X_CARD_WIDTH = 550;

/**
 * Frame onde o vídeo aparece. É o alvo: em telas menores encolhe na proporção
 * para caber, mantendo 1440x990 quando há espaço.
 */
const FRAME_W = 1440;
const FRAME_H = 990;

export default function VideoModal({ member, onClose }) {
  const { t, localize } = useLanguage();
  const panelRef = useModalBehavior(Boolean(member), onClose);
  const [failed, setFailed] = useState(false);
  const [xHeight, setXHeight] = useState(X_DEFAULT_HEIGHT);
  const [frame, setFrame] = useState({ w: FRAME_W, h: FRAME_H });

  const source = member ? resolveVideoSource(member) : { kind: 'none', src: '' };
  const title = member ? localize(member.videoTitle) : '';
  const unavailable = failed || source.kind === 'none';

  /**
   * O embed do X avisa a altura real por postMessage. Sem escutar isso o post
   * fica cortado ou sobra tarja preta, porque a altura varia com o texto.
   */
  useEffect(() => {
    if (source.kind !== 'x') return undefined;

    setXHeight(X_DEFAULT_HEIGHT);

    const onMessage = (event) => {
      if (event.origin !== X_EMBED_ORIGIN) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        const height = data?.['twttr.embed']?.params?.[0]?.height;
        if (Number.isFinite(height) && height > 120) setXHeight(Math.ceil(height));
      } catch {
        /* mensagem que não é do embed — ignora */
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [source.kind, source.src]);

  /**
   * Ajusta o frame de 1440x990 ao espaço livre, descontando cabeçalho, rodapé
   * e margem do modal. Mantém a proporção do alvo ao encolher.
   */
  useEffect(() => {
    if (source.kind === 'none') return undefined;

    const measure = () => {
      const roomW = window.innerWidth - 48; // margem lateral do modal
      const roomH = window.innerHeight - 200; // cabeçalho + rodapé + margem do modal
      const scale = Math.min(1, roomW / FRAME_W, roomH / FRAME_H);
      setFrame({ w: Math.round(FRAME_W * scale), h: Math.round(FRAME_H * scale) });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [source.kind]);

  // Cartão do X cobre o frame inteiro: escala pela maior razão e o excedente
  // (cabeçalho e rodapé do tuíte) é cortado pelo overflow, sem faixa preta.
  const xScale = Math.max(frame.w / X_CARD_WIDTH, frame.h / xHeight);

  return (
    <AnimatePresence onExitComplete={() => setFailed(false)}>
      {member && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label={t('videos.closePlayer')}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/90 backdrop-blur-md"
          />

          {/* O frame do vídeo tem alvo fixo de 1440x990; o modal acompanha */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: frame.w + 2 }}
            className="relative z-10 w-full max-w-full border border-gold/40 bg-black shadow-gold"
          >
            <CornerOrnaments opacity={0.5} />

            <div className="flex items-start justify-between gap-4 border-b border-gold/20 px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <p className="text-[0.66rem] uppercase tracking-[0.24em] text-gold">{member.name}</p>
                <h2 id="video-modal-title" className="mt-1 truncate font-display text-lg text-text sm:text-xl">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label={t('videos.closePlayer')}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/40 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-background"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Frame alvo 1440x990, reduzido para caber na tela */}
            <div
              className="relative flex w-full items-center justify-center overflow-hidden bg-black"
              style={{ height: frame.h }}
            >
              {unavailable ? (
                <div className="flex h-full min-h-[16rem] w-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-gold" aria-hidden="true" />
                  <p className="max-w-md text-sm leading-relaxed text-text-muted">
                    {t('videos.unavailable')}
                  </p>
                  {member.videoUrl && (
                    <a
                      href={member.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost px-4 py-2.5 text-[0.68rem]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('videos.openOriginal')}
                    </a>
                  )}
                </div>
              ) : source.kind === 'file' ? (
                <video
                  key={member.id}
                  src={source.src}
                  poster={member.videoThumbnail}
                  controls
                  autoPlay
                  playsInline
                  onError={() => setFailed(true)}
                  className="h-full w-full"
                >
                  {t('common.loading')}
                </video>
              ) : source.kind === 'x' ? (
                <iframe
                  key={`${member.id}-${source.id}`}
                  src={source.src}
                  title={`${member.name} — ${title}`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  scrolling="no"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={() => setFailed(true)}
                  className="block shrink-0 border-0"
                  style={{
                    width: X_CARD_WIDTH,
                    height: xHeight,
                    transform: `scale(${xScale})`,
                    transformOrigin: 'center',
                  }}
                />
              ) : (
                <iframe
                  key={member.id}
                  src={source.src}
                  title={`${member.name} — ${title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={() => setFailed(true)}
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}
            </div>

            {source.kind === 'x' && (
              <a
                href={member.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-t border-gold/20 px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-text-muted transition-colors hover:text-gold-light sm:px-7"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {t('videos.openOriginal')}
              </a>
            )}

            <p className="border-t border-gold/20 px-5 py-4 text-sm leading-relaxed text-text-muted sm:px-7">
              {localize(member.videoDescription)}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
