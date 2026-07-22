import { useCallback, useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { isAudioFile, parseYouTubeId } from '../utils/video';

const YT_ORIGIN = 'https://www.youtube.com';

/**
 * Trilha de fundo do site inteiro.
 *
 * Fica no topo da aplicação, então **sobrevive à transição** da tela de acesso
 * para o site — sem isso a música parava no instante em que a pessoa clicava em
 * Acessar, e era por isso que quase nunca dava para ouvir.
 *
 * Aceita duas fontes:
 *   - arquivo de áudio hospedado aqui (o caminho confiável): toca com <audio>,
 *     sem depender do YouTube, sem bloqueio de extensão, sem restrição de embed;
 *   - link do YouTube (reserva): embute o vídeo e controla por postMessage.
 *
 * Navegador nenhum deixa tocar com som antes de um gesto, então começa mudo e
 * liga o som no primeiro clique da pessoa — inclusive o clique em Acessar.
 */
export default function BackgroundMusic({ url }) {
  const audioRef = useRef(null);
  const iframeRef = useRef(null);
  const jaLigou = useRef(false);

  const [muted, setMuted] = useState(true);
  const [indisponivel, setIndisponivel] = useState(false);

  const audioSrc = isAudioFile(url) ? url : null;
  const youtubeId = audioSrc ? null : parseYouTubeId(url);
  const ativo = Boolean(audioSrc || youtubeId);

  /* --------------------------------------------------------- comandos */

  const enviarYT = useCallback((func, args = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      YT_ORIGIN,
    );
  }, []);

  const ligarSom = useCallback(() => {
    jaLigou.current = true;
    setMuted(false);

    if (audioSrc) {
      const el = audioRef.current;
      if (el) {
        el.muted = false;
        el.volume = 0.7;
        el.play().catch(() => setIndisponivel(true));
      }
    } else {
      enviarYT('unMute');
      enviarYT('setVolume', [70]);
      enviarYT('playVideo');
    }
  }, [audioSrc, enviarYT]);

  const desligarSom = useCallback(() => {
    setMuted(true);
    if (audioSrc) {
      if (audioRef.current) audioRef.current.muted = true;
    } else {
      enviarYT('mute');
    }
  }, [audioSrc, enviarYT]);

  /* ------------------------------------------------- primeiro gesto */

  useEffect(() => {
    if (!ativo) return undefined;

    // Uma fonte nova recomeça muda.
    jaLigou.current = false;
    setMuted(true);
    setIndisponivel(false);

    const aoPrimeiroGesto = () => {
      if (jaLigou.current) return;
      ligarSom();
    };

    window.addEventListener('pointerdown', aoPrimeiroGesto);
    window.addEventListener('keydown', aoPrimeiroGesto);
    return () => {
      window.removeEventListener('pointerdown', aoPrimeiroGesto);
      window.removeEventListener('keydown', aoPrimeiroGesto);
    };
  }, [url, ativo, ligarSom]);

  if (!ativo) return null;

  const legenda = indisponivel ? 'A música não pôde ser carregada.' : muted ? 'Ativar som' : 'Silenciar';

  return (
    <>
      {audioSrc ? (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          autoPlay
          muted
          preload="auto"
          onError={() => setIndisponivel(true)}
          className="sr-only"
          aria-hidden="true"
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={
            `${YT_ORIGIN}/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${youtubeId}` +
            `&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&origin=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.origin : '',
            )}`
          }
          title="Trilha do site"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 -z-10 h-24 w-40 opacity-0"
        />
      )}

      <button
        type="button"
        onClick={() => (muted ? ligarSom() : desligarSom())}
        disabled={indisponivel}
        aria-label={legenda}
        title={legenda}
        aria-pressed={!muted}
        className={`fixed bottom-6 end-5 z-[65] flex h-11 w-11 items-center justify-center border backdrop-blur transition-colors sm:bottom-8 sm:end-24 ${
          indisponivel
            ? 'cursor-not-allowed border-red-400/40 bg-black/60 text-red-300/70'
            : 'cursor-pointer border-gold/40 bg-black/60 text-gold hover:border-gold hover:bg-gold hover:text-background'
        }`}
      >
        {muted || indisponivel ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
        <Music className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 opacity-60" aria-hidden="true" />
      </button>
    </>
  );
}
