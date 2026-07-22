import { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { parseYouTubeId } from '../utils/video';

/**
 * Carrega a API de player do YouTube uma única vez por página.
 *
 * Usamos a API oficial em vez de mandar postMessage no iframe cru: assim os
 * comandos só saem depois que o player avisa que está pronto, e não é preciso
 * acertar o parâmetro `origin` na mão — sem ele o YouTube ignora os comandos
 * em silêncio, que foi exatamente o motivo do som não ligar antes.
 */
let apiPromise = null;

function loadYouTubeApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);

    const anterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      anterior?.();
      resolve(window.YT);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('player do YouTube não carregou'));
    document.head.appendChild(script);
    return undefined;
  });

  return apiPromise;
}

/**
 * Trilha da tela de acesso.
 *
 * Começa muda, porque nenhum navegador deixa tocar com som antes de um gesto,
 * e liga o som no primeiro clique — no botão ou em qualquer ponto da tela.
 * Some quando a tela de acesso sai.
 */
export default function AccessMusic({ url, canEdit = false }) {
  const id = parseYouTubeId(url);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const jaLigou = useRef(false);

  const [muted, setMuted] = useState(true);
  const [estado, setEstado] = useState('carregando'); // carregando | pronto | bloqueado | erro

  /* ------------------------------------------------------------ player */

  useEffect(() => {
    if (!id) return undefined;

    let cancelado = false;
    let player = null;
    const container = containerRef.current;

    // A API substitui o elemento que recebe pelo iframe, então entregamos um
    // nó criado à mão — o React continua dono só do container.
    const alvo = document.createElement('div');
    container?.appendChild(alvo);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelado) return;

        player = new YT.Player(alvo, {
          videoId: id,
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: id, // o loop exige a própria faixa como "lista"
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (cancelado) return;
              event.target.playVideo();
              setEstado('pronto');
              // Se o gesto veio antes do player ficar pronto, liga agora.
              if (jaLigou.current) {
                event.target.unMute();
                event.target.setVolume(70);
                setMuted(false);
              }
            },
            onError: (event) => {
              // 101 e 150: o dono do vídeo desativou a reprodução incorporada.
              setEstado(event.data === 101 || event.data === 150 ? 'bloqueado' : 'erro');
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => setEstado('erro'));

    return () => {
      cancelado = true;
      try {
        player?.destroy();
      } catch {
        /* já removido */
      }
      playerRef.current = null;
      if (container) container.innerHTML = '';
    };
  }, [id]);

  /* ------------------------------------------------------------- som */

  const ligarSom = () => {
    jaLigou.current = true;
    const player = playerRef.current;
    if (!player?.unMute) return; // ainda carregando: o onReady liga depois
    player.unMute();
    player.setVolume(70);
    player.playVideo();
    setMuted(false);
  };

  const desligarSom = () => {
    playerRef.current?.mute?.();
    setMuted(true);
  };

  // Primeiro gesto em qualquer lugar da tela já libera o áudio.
  useEffect(() => {
    if (!id) return undefined;

    const aoPrimeiroGesto = () => {
      if (jaLigou.current) return;
      ligarSom();
    };

    window.addEventListener('pointerdown', aoPrimeiroGesto, { once: true });
    window.addEventListener('keydown', aoPrimeiroGesto, { once: true });
    return () => {
      window.removeEventListener('pointerdown', aoPrimeiroGesto);
      window.removeEventListener('keydown', aoPrimeiroGesto);
    };
  }, [id]);

  if (!id) return null;

  const indisponivel = estado === 'bloqueado' || estado === 'erro';

  const legenda = indisponivel
    ? estado === 'bloqueado'
      ? 'Este vídeo não permite reprodução incorporada — escolha outro link.'
      : 'A música não pôde ser carregada.'
    : muted
      ? 'Ativar som'
      : 'Silenciar';

  return (
    <>
      {/* Tocador escondido: existe no DOM, mas não aparece */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -z-10 h-24 w-40 overflow-hidden opacity-0"
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
        <p className="absolute start-5 top-20 z-20 max-w-[15rem] border border-red-400/40 bg-black/80 p-2 text-[0.62rem] leading-relaxed text-red-200 backdrop-blur">
          {legenda}
        </p>
      )}
    </>
  );
}
