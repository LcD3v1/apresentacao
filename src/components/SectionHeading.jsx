import { motion } from 'framer-motion';
import { SectionDivider } from './ArabicPattern';

/** Cabecalho padrao das secoes: sobrenome, titulo, caligrafia decorativa e divisor. */
export default function SectionHeading({
  eyebrow,
  title,
  arabic,
  subtitle,
  align = 'center',
  className = '',
}) {
  const centered = align === 'center';

  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-start'} ${className}`}
    >
      <div className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
        <p className="eyebrow">{eyebrow}</p>
        <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
      </div>

      <div className="relative mt-5">
        {arabic && (
          <span
            aria-hidden="true"
            dir="rtl"
            className={`pointer-events-none absolute -top-6 select-none font-arabic text-[3.4rem] leading-none text-gold/[0.07] sm:text-[5rem] ${
              centered ? 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2' : 'start-0'
            }`}
          >
            {arabic}
          </span>
        )}
        <h2 className="relative font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold text-gilded">
          {title}
        </h2>
      </div>

      {subtitle && (
        <p
          className={`mt-5 text-base leading-relaxed text-text-muted ${centered ? 'mx-auto max-w-2xl' : ''}`}
        >
          {subtitle}
        </p>
      )}

      <SectionDivider className={`mt-7 ${centered ? '' : 'justify-start'}`} />
    </motion.header>
  );
}
