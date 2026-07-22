import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArabicPattern } from './ArabicPattern';

const DURATION = 2600; // ms até liberar o site
const EASE = [0.22, 1, 0.36, 1];

/** Faixas de areia atravessando a tela em velocidades diferentes. */
function SandStreams({ reduce }) {
  const streams = [
    { top: '18%', height: 90, blur: 26, opacity: 0.5, delay: 0, duration: 2.1 },
    { top: '38%', height: 150, blur: 36, opacity: 0.7, delay: 0.15, duration: 1.7 },
    { top: '52%', height: 60, blur: 18, opacity: 0.45, delay: 0.35, duration: 2.4 },
    { top: '68%', height: 120, blur: 32, opacity: 0.55, delay: 0.1, duration: 1.9 },
    { top: '82%', height: 80, blur: 22, opacity: 0.4, delay: 0.45, duration: 2.2 },
  ];

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {streams.map((stream, index) => (
        <motion.div
          key={index}
          className="absolute -left-1/3 w-[85%]"
          style={{
            top: stream.top,
            height: stream.height,
            filter: `blur(${stream.blur}px)`,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(217,195,154,0.28) 30%, rgba(241,215,122,0.42) 50%, rgba(217,195,154,0.24) 70%, transparent 100%)',
          }}
          initial={{ x: '-60%', opacity: 0 }}
          animate={{ x: ['-60%', '190%'], opacity: [0, stream.opacity, stream.opacity, 0] }}
          transition={{ duration: stream.duration, delay: stream.delay, ease: 'easeInOut', times: [0, 0.2, 0.7, 1] }}
        />
      ))}
    </div>
  );
}

/** Grãos soltos levados pelo mesmo vento. */
function SandGrains({ reduce }) {
  if (reduce) return null;

  const grains = Array.from({ length: 46 }, (_, i) => ({
    id: i,
    top: (i * 37) % 100,
    size: 1 + ((i * 13) % 5) * 0.7,
    delay: ((i % 11) * 0.09).toFixed(2),
    duration: 1.5 + ((i * 7) % 12) * 0.11,
    drift: ((i % 5) - 2) * 26,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {grains.map((grain) => (
        <motion.span
          key={grain.id}
          className="absolute rounded-full bg-sand"
          style={{ top: `${grain.top}%`, width: grain.size, height: grain.size }}
          initial={{ x: '-10vw', opacity: 0 }}
          animate={{ x: '115vw', y: grain.drift, opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: grain.duration,
            delay: Number(grain.delay),
            ease: 'linear',
            times: [0, 0.15, 0.75, 1],
          }}
        />
      ))}
    </div>
  );
}

/**
 * Cortina entre a tela de acesso e o site.
 *
 * A logo atravessa a tela junto com a areia: entra pela esquerda, é varrida por
 * uma faixa de luz e sai pela direita enquanto a cortina abre.
 */
export default function SandTransition({ logo, alt = '', onDone }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduce ? 420 : DURATION);
    return () => window.clearTimeout(timer);
  }, [onDone, reduce]);

  // Quem não quer movimento recebe só um escurecer curto.
  if (reduce) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="status"
        aria-label="Entrando"
      >
        {logo && <img src={logo} alt={alt} className="h-24 w-auto max-w-[70vw] object-contain" />}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
      role="status"
      aria-label="Entrando"
    >
      {/* Horizonte quente ao fundo */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.6] }}
        transition={{ duration: 2.6, times: [0, 0.25, 0.7, 1] }}
        style={{
          background:
            'radial-gradient(90% 60% at 50% 55%, rgba(0,108,69,0.34), transparent 70%), radial-gradient(70% 50% at 50% 100%, rgba(212,175,55,0.22), transparent 75%)',
        }}
      />
      <ArabicPattern opacity={0.07} size={170} />

      <SandStreams reduce={reduce} />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ x: '-22vw', opacity: 0, scale: 1.14, filter: 'blur(14px)' }}
          animate={{
            x: ['-22vw', '0vw', '0vw', '20vw'],
            opacity: [0, 1, 1, 0],
            scale: [1.14, 1, 1, 0.94],
            filter: ['blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
          }}
          transition={{ duration: 2.6, times: [0, 0.32, 0.66, 1], ease: EASE }}
        >
          {logo ? (
            <img
              src={logo}
              alt={alt}
              className="h-28 w-auto max-w-[76vw] object-contain sm:h-40 lg:h-52"
              draggable="false"
            />
          ) : (
            <span className="font-display text-[clamp(2rem,7vw,4.5rem)] font-semibold tracking-[0.24em] text-gilded">
              ARÁBIA
            </span>
          )}

          {/* Varredura de luz passando por cima da logo */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 w-1/3 skew-x-[-16deg]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(241,215,122,0.55), transparent)',
              filter: 'blur(6px)',
            }}
            initial={{ left: '-40%', opacity: 0 }}
            animate={{ left: ['-40%', '130%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, delay: 0.75, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <SandGrains reduce={reduce} />

      {/* Duna que sobe e depois desce, dando o corte final */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        initial={{ height: '0%' }}
        animate={{ height: ['0%', '14%', '0%'] }}
        transition={{ duration: 2.6, times: [0, 0.55, 1], ease: EASE }}
        style={{
          background: 'linear-gradient(to top, rgba(217,195,154,0.22), transparent)',
          filter: 'blur(24px)',
        }}
      />

      {/* Vinheta para o corte não estourar nas bordas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(75% 65% at 50% 50%, transparent 40%, rgba(5,7,6,0.85) 100%)' }}
      />
    </motion.div>
  );
}
