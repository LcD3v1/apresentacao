import { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { parseYouTubeId } from '../utils/video';

const YT_ORIGIN = 'https://www.youtube.com';

/**
 * Trilha da tela de acesso.
 *
 * O navegador só deixa tocar com som depois de um gesto do usuário, então o
 * vídeo começa mudo (autoplay permitido) e o som liga no primeiro clique — seja
 * no botão de som, seja em qualquer lugar da tela. Some quando a tela troca.
 */
export default function AccessMusic({ url }) {
  const id = parseYouTubeId(url);
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const armed = useRef(false);

  const command = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      YT_ORIGIN,
    );
  };

  const unmute = () => {
    command('unMute');
    command('playVideo');
    setMuted(false);
  };

  const mute = () => {
    command('mute');
    setMuted(true);
  };

  // Liga o som no primeiro gesto em qualquer ponto da tela (uma vez só).
  useEffect(() => {
    if (!id) return undefined;

    const onFirstGesture = () => {
      if (armed.current) return;
      armed.current = true;
      unmute();
    };

    window.addEventListener('pointerdown', onFirstGesture, { once: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [id]);

  if (!id) return null;

  const src =
    `${YT_ORIGIN}/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
    '&controls=0&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&rel=0';

  return (
    <>
      {/* Tocador escondido: precisa existir no DOM, mas não deve aparecer */}
      <iframe
        ref={iframeRef}
        src={src}
        title="Trilha da tela de acesso"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -z-10 h-24 w-40 opacity-0"
      />

      <button
        type="button"
        onClick={() => {
          armed.current = true; // o clique já conta como o gesto
          muted ? unmute() : mute();
        }}
        aria-label={muted ? 'Ativar som' : 'Silenciar'}
        aria-pressed={!muted}
        className="absolute start-5 top-5 z-20 flex items-center gap-2 border border-gold/30 bg-black/50 px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] text-text-muted backdrop-blur transition-colors hover:border-gold hover:text-gold-light"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4 text-gold" aria-hidden="true" />
        )}
        <Music className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </>
  );
}
