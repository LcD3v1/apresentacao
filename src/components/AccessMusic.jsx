import { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { parseYouTubeId } from '../utils/video';

const YT_ORIGIN = 'https://www.youtube.com';

/**
 * Trilha da tela de acesso.
 *
 * Fala direto com o iframe do embed por postMessage, sem carregar o script
 * `youtube.com/iframe_api`. Esse script é justamente o que bloqueadores de
 * anúncio e navegadores com proteção de privacidade barram — e era o motivo
 * de a música falhar em alguns computadores. O embed em si raramente é
 * bloqueado, então esta versão toca em muito mais lugares.
 *
 * O segredo que faltava antes: o parâmetro `origin`. Sem ele o YouTube
 * descarta os comandos em silêncio, mesmo com `enablejsapi=1`.
 *
 * Começa mudo (autoplay com som é proibido antes de um gesto) e liga o som no
 * primeiro clique, seja no botão, seja em qualquer ponto da tela.
 */
export default function AccessMusic({ url, canEdit = false }) {
  const id = parseYouTubeId(url);
  const iframeRef = useRef(null);
  const jaLigou = useRef(false);
  const recebeuSinal = useRef(false);

  const [muted, setMuted] = useState(true);
  const [estado, setEstado] = useState('carregando'); // carregando | tocando | bloqueado | erro

  const enviar = (func, args = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      YT_ORIGIN,
    );
  };

  const ligarSom = () => {
    jaLigou.current = true;
    setMuted(false);
    enviar('unMute');
    enviar('setVolume', [70]);
    enviar('playVideo');
  };

  const desligarSom = () => {
    setMuted(true);
    enviar('mute');
  };

  /* ---------------------------------------------------- escuta o player */

  useEffect(() => {
    if (!id) return undefined;

    const onMessage = (event) => {
      if (event.origin !== YT_ORIGIN) return;

      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      recebeuSinal.current = true;

      if (data.event === 'onError') {
        // 101 e 150: o dono do vídeo desativou a reprodução incorporada.
        setEstado(data.info === 101 || data.info === 150 ? 'bloqueado' : 'erro');
      } else if (data.event === 'onReady' || data.event === 'infoDelivery') {
        setEstado((atual) => (atual === 'carregando' ? 'tocando' : atual));
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [id]);

  /* ---------------------------------------------- primeiro gesto e falha */

  useEffect(() => {
    if (!id) return undefined;

    const aoPrimeiroGesto = () => {
      if (jaLigou.current) return;
      ligarSom();
    };

    window.addEventListener('pointerdown', aoPrimeiroGesto, { once: true });
    window.addEventListener('keydown', aoPrimeiroGesto, { once: true });

    // Se em 6 s o iframe não deu nenhum sinal de vida, algo o bloqueou.
    const timer = window.setTimeout(() => {
      if (!recebeuSinal.current) setEstado((atual) => (atual === 'carregando' ? 'erro' : atual));
    }, 6000);

    return () => {
      window.removeEventListener('pointerdown', aoPrimeiroGesto);
      window.removeEventListener('keydown', aoPrimeiroGesto);
      window.clearTimeout(timer);
    };
  }, [id]);

  if (!id) return null;

  const indisponivel = estado === 'bloqueado' || estado === 'erro';

  const legenda = indisponivel
    ? estado === 'bloqueado'
      ? 'Este vídeo não permite reprodução incorporada — escolha outro link.'
      : 'A música não pôde ser carregada. Uma extensão do navegador pode estar bloqueando o YouTube.'
    : muted
      ? 'Ativar som'
      : 'Silenciar';

  // `origin` precisa bater com o endereço da página, aqui e no site publicado.
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src =
    `${YT_ORIGIN}/embed/${id}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&origin=${encodeURIComponent(origin)}`;

  return (
    <>
      {/* Tocador escondido: existe no DOM, mas não aparece */}
      <iframe
        ref={iframeRef}
        src={src}
        title="Trilha da tela de acesso"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={() => {
          // Registra-se para receber os eventos do player.
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening', id: 'arabia-music' }),
            YT_ORIGIN,
          );
        }}
        className="pointer-events-none absolute bottom-0 -z-10 h-24 w-40 opacity-0"
      />

      <button
        type="button"
        onClick={() => (muted ? ligarSom() : desligarSom())}
        disabled={indisponivel}
        aria-label={legenda}
        title={legenda}
        aria-pressed={!muted}
        className={`absolute start-5 top-5 z-20 flex min-h-11 items-center gap-2 border px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] backdrop-blur transition-colors ${
          indisponivel
            ? 'cursor-not-allowed border-red-400/40 bg-black/50 text-red-300/70'
            : 'cursor-pointer border-gold/30 bg-black/50 text-text-muted hover:border-gold hover:text-gold-light'
        }`}
      >
        {muted || indisponivel ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4 text-gold" aria-hidden="true" />
        )}
        <Music className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {/* Só quem edita precisa saber por que a música não tocou */}
      {canEdit && indisponivel && (
        <p className="absolute start-5 top-20 z-20 max-w-[16rem] border border-red-400/40 bg-black/80 p-2 text-[0.62rem] leading-relaxed text-red-200 backdrop-blur">
          {legenda}
        </p>
      )}
    </>
  );
}
