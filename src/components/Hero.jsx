import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { ArabicPattern, GoldenParticles, SandDrift } from './ArabicPattern';
import SmartImage from './SmartImage';
import EditableText from './admin/EditableText';
import MediaField from './admin/MediaField';

export default function Hero() {
  const { t, localize } = useLanguage();
  const { site, setSiteField, canEdit } = useContent();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const hero = site.hero ?? {};

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);

  const scrollToMembers = () => {
    document
      .getElementById('members')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const fade = {
    hidden: { opacity: 0, y: 26 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        <SmartImage
          src={hero.background}
          alt=""
          className="h-full w-full"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(100deg, rgba(5,7,6,0.96) 0%, rgba(5,7,6,0.84) 34%, rgba(0,108,69,0.26) 64%, rgba(5,7,6,0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 110%, rgba(0,155,99,0.26), transparent 60%), linear-gradient(to top, var(--background) 4%, transparent 42%)',
        }}
      />
      <ArabicPattern className="-z-10" opacity={0.09} size={150} />
      <SandDrift className="-z-10" />
      <GoldenParticles count={20} className="-z-10" />

      {canEdit && (
        <MediaField
          value={hero.background}
          label="Fundo do início"
          className="top-24"
          onSave={(url) => setSiteField('hero', 'background', url, { localized: false })}
        />
      )}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative w-full pb-28 pt-32 sm:pt-36"
      >
        <div className="max-w-3xl">
          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="font-arabic text-lg text-gold-light sm:text-xl"
            dir="rtl"
            lang="ar"
          >
            {hero.arabic}
          </motion.p>

          <motion.div custom={1} variants={fade} initial="hidden" animate="show" className="mt-5 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/70" aria-hidden="true" />
            <EditableText
              label="Selo do início"
              value={hero.badge}
              onSave={(v) => setSiteField('hero', 'badge', v)}
              className="eyebrow"
            />
          </motion.div>

          <motion.h1
            id="hero-title"
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-6 font-display text-[clamp(2.6rem,8vw,5.6rem)] font-semibold leading-[1.02]"
          >
            <EditableText
              as="span"
              label="Título principal"
              value={hero.titleTop}
              onSave={(v) => setSiteField('hero', 'titleTop', v)}
              className="block text-gilded"
            />
            <EditableText
              as="span"
              label="Segunda linha do título"
              value={hero.titleBottom}
              onSave={(v) => setSiteField('hero', 'titleBottom', v)}
              className="mt-2 block text-[clamp(1.4rem,3.4vw,2.6rem)] font-normal tracking-[0.06em] text-text/90"
            />
          </motion.h1>

          <motion.div custom={3} variants={fade} initial="hidden" animate="show" className="mt-7">
            <EditableText
              label="Texto de apresentação"
              multiline
              value={hero.subtitle}
              onSave={(v) => setSiteField('hero', 'subtitle', v)}
              className="max-w-xl text-balance text-base leading-relaxed text-text-muted sm:text-lg"
            />
          </motion.div>

          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <button type="button" onClick={scrollToMembers} className="btn btn-gold">
              <Users className="h-4 w-4" aria-hidden="true" />
              {localize(hero.primaryCta) || t('nav.members')}
            </button>
          </motion.div>

          {/* Números de apoio */}
          {Array.isArray(hero.stats) && hero.stats.length > 0 && (
            <motion.dl
              custom={5}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-gold/15 pt-8"
            >
              {hero.stats.map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{localize(stat.label)}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-semibold text-gilded sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block text-[0.62rem] uppercase tracking-[0.22em] text-text-muted">
                      {localize(stat.label)}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToMembers}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-7 start-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-text-muted transition-colors hover:text-gold-light rtl:translate-x-1/2"
        aria-label={t('hero.scroll')}
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
        <motion.span
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40"
          aria-hidden="true"
        >
          <ArrowDown className="h-4 w-4 text-gold" />
        </motion.span>
      </motion.button>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
