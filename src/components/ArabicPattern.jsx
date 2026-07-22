import { memo, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Malha geometrica islamica usada como textura de fundo.
 * Puramente decorativa: aria-hidden e sem custo de imagem.
 */
function ArabicPatternBase({ className = '', opacity = 0.14, size = 120, color = 'var(--gold)' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={`pat-${id}`}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <g fill="none" stroke={color} strokeWidth="1" opacity={opacity}>
            <path
              d={`M${size / 2} ${size * 0.05} L${size * 0.7} ${size * 0.3} L${size * 0.95} ${size / 2} L${size * 0.7} ${size * 0.7} L${size / 2} ${size * 0.95} L${size * 0.3} ${size * 0.7} L${size * 0.05} ${size / 2} L${size * 0.3} ${size * 0.3} Z`}
            />
            <path
              d={`M${size / 2} ${size * 0.2} L${size * 0.8} ${size / 2} L${size / 2} ${size * 0.8} L${size * 0.2} ${size / 2} Z`}
            />
            <circle cx={size / 2} cy={size / 2} r={size * 0.08} />
            <path d={`M0 0 L${size} ${size} M${size} 0 L0 ${size}`} opacity="0.4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#pat-${id})`} />
    </svg>
  );
}

export const ArabicPattern = memo(ArabicPatternBase);

/** Divisor de secao inspirado em mosaico: linha dourada com losango central. */
export function SectionDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="hairline w-16 sm:w-32" />
      <svg width="52" height="18" viewBox="0 0 52 18" fill="none" className="shrink-0">
        <path d="M26 1 L34 9 L26 17 L18 9 Z" stroke="var(--gold)" strokeWidth="1" />
        <path d="M26 5 L30 9 L26 13 L22 9 Z" fill="var(--gold)" opacity="0.65" />
        <path d="M0 9 H14 M38 9 H52" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
        <circle cx="14" cy="9" r="1.8" fill="var(--gold)" opacity="0.8" />
        <circle cx="38" cy="9" r="1.8" fill="var(--gold)" opacity="0.8" />
      </svg>
      <span className="hairline w-16 sm:w-32" />
    </div>
  );
}

/** Contorno de arco arabe usado como moldura de titulos e imagens. */
export function ArchFrame({ className = '', strokeOpacity = 0.4 }) {
  return (
    <svg
      viewBox="0 0 200 260"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 256 L4 118 Q4 78 40 62 Q100 40 100 4 Q100 40 160 62 Q196 78 196 118 L196 256"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.2"
        opacity={strokeOpacity}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Ornamento de canto — quatro cantos por padrao. */
export function CornerOrnaments({ className = '', color = 'var(--gold)', opacity = 0.55 }) {
  const corner = (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path d="M1 33 L1 9 Q1 1 9 1 L33 1" stroke={color} strokeWidth="1" opacity={opacity} />
      <path d="M7 33 L7 13 Q7 7 13 7 L33 7" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
      <circle cx="9" cy="9" r="1.8" fill={color} opacity={opacity} />
    </svg>
  );
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute left-3 top-3">{corner}</div>
      <div className="absolute right-3 top-3 rotate-90">{corner}</div>
      <div className="absolute bottom-3 right-3 rotate-180">{corner}</div>
      <div className="absolute bottom-3 left-3 -rotate-90">{corner}</div>
    </div>
  );
}

/** Particulas douradas suspensas — respeita prefers-reduced-motion. */
export function GoldenParticles({ count = 18, className = '' }) {
  const reduce = useReducedMotion();
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    top: (i * 61) % 100,
    size: 1.5 + ((i * 7) % 4) * 0.6,
    delay: (i % 9) * 0.7,
    duration: 9 + (i % 6) * 2.2,
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-gold-light"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          initial={{ opacity: 0.15, y: 0 }}
          animate={
            reduce
              ? { opacity: 0.3 }
              : { opacity: [0.1, 0.65, 0.1], y: [0, -38, 0], x: [0, 12, 0] }
          }
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** Camada de poeira do deserto em movimento horizontal lento. */
export function SandDrift({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute -inset-x-1/2 bottom-0 h-1/2 animate-drift-sand opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 60%, rgba(217,195,154,0.16), transparent 42%), radial-gradient(circle at 62% 78%, rgba(212,175,55,0.12), transparent 38%), radial-gradient(circle at 85% 55%, rgba(217,195,154,0.1), transparent 40%)',
        }}
      />
    </div>
  );
}

export default ArabicPattern;
