import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { ArabicPattern, GoldenParticles, SectionDivider } from './ArabicPattern';
import SmartImage from './SmartImage';
import LanguageSelector from './LanguageSelector';
import AccessMusic from './AccessMusic';
import EditableText from './admin/EditableText';
import MediaField from './admin/MediaField';

/** Porta de entrada do site: dois emblemas, uma frase e o botão de acesso. */
export default function AccessScreen({ onEnter }) {
  const { localize } = useLanguage();
  const { site, setSiteField, canEdit } = useContent();
  const reduce = useReducedMotion();

  const access = site.access ?? {};
  const brand = site.brand ?? {};

  const rise = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 + i * 0.14, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <motion.section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="access-headline"
    >
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={access.background}
          alt=""
          className="h-full w-full"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 45%, rgba(0,108,69,0.30), transparent 65%), linear-gradient(180deg, rgba(5,7,6,0.92) 0%, rgba(5,7,6,0.78) 45%, rgba(5,7,6,0.97) 100%)',
        }}
      />
      <ArabicPattern className="-z-10" opacity={0.08} size={150} />
      <GoldenParticles count={14} className="-z-10" />

      {canEdit && (
        <MediaField
          value={access.background}
          label="Fundo da tela de acesso"
          onSave={(url) => setSiteField('access', 'background', url, { localized: false })}
        />
      )}

      <div className="absolute end-5 top-5 z-20">
        <LanguageSelector />
      </div>

      <AccessMusic url={access.music} canEdit={canEdit} />

      {/* Os dois emblemas */}
      <motion.div
        custom={0}
        variants={rise}
        initial="hidden"
        animate="show"
        className="flex w-full items-center justify-center gap-5 sm:gap-10 lg:gap-14"
      >
        <div className="relative">
          <SmartImage
            src={access.logoPrimary}
            alt={localize(access.logoPrimaryAlt) || 'Emblema principal'}
            className="h-28 w-[38vw] max-w-[13rem] sm:h-40 sm:w-60 sm:max-w-none lg:h-48 lg:w-72"
            fit="contain"
            loading="eager"
          />
          {canEdit && (
            <MediaField
              value={access.logoPrimary}
              label="Logo 1"
              position="bottom-right"
              onSave={(url) => setSiteField('access', 'logoPrimary', url, { localized: false })}
            />
          )}
        </div>

        <span
          className="h-24 w-px shrink-0 bg-gradient-to-b from-transparent via-gold/60 to-transparent sm:h-36 lg:h-44"
          aria-hidden="true"
        />

        <div className="relative">
          <SmartImage
            src={access.logoSecondary}
            alt={localize(access.logoSecondaryAlt) || 'Emblema parceiro'}
            className="h-28 w-[38vw] max-w-[13rem] sm:h-40 sm:w-60 sm:max-w-none lg:h-48 lg:w-72"
            fit="contain"
            loading="eager"
          />
          {canEdit && (
            <MediaField
              value={access.logoSecondary}
              label="Logo 2"
              position="bottom-right"
              onSave={(url) => setSiteField('access', 'logoSecondary', url, { localized: false })}
            />
          )}
        </div>
      </motion.div>

      <motion.p
        custom={1}
        variants={rise}
        initial="hidden"
        animate="show"
        dir="rtl"
        lang="ar"
        className="mt-10 font-arabic text-lg text-gold-light"
      >
        {access.arabic}
      </motion.p>

      <motion.div custom={2} variants={rise} initial="hidden" animate="show" className="mt-4 text-center">
        <EditableText
          as="h1"
          label="Título da tela de acesso"
          value={access.headline}
          onSave={(v) => setSiteField('access', 'headline', v)}
          className="max-w-2xl text-balance font-display text-[clamp(1.8rem,5vw,3.2rem)] font-semibold text-gilded"
        />
      </motion.div>

      <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="mt-4 text-center">
        <EditableText
          label="Subtítulo da tela de acesso"
          value={access.subline}
          onSave={(v) => setSiteField('access', 'subline', v)}
          className="max-w-xl text-sm leading-relaxed text-text-muted sm:text-base"
        />
      </motion.div>

      <SectionDivider className="mt-9 w-full max-w-md" />

      <motion.div custom={4} variants={rise} initial="hidden" animate="show" className="mt-9">
        <button type="button" onClick={onEnter} className="btn btn-gold px-10 py-4 text-sm">
          {localize(access.buttonLabel) || 'Acessar'}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </motion.div>

      <motion.p
        custom={5}
        variants={rise}
        initial="hidden"
        animate="show"
        className="mt-10 text-[0.62rem] uppercase tracking-[0.3em] text-text-muted"
      >
        {brand.name} · {localize(brand.tagline)}
      </motion.p>

      {/* Só no modo edição: escolhe qual logo atravessa a cortina de areia */}
      {canEdit && (
        <div className="mt-10 flex items-center gap-4 border border-gold/25 bg-black/70 p-3 backdrop-blur">
          <div className="flex h-14 w-24 items-center justify-center border border-white/10 bg-surface">
            <SmartImage
              src={access.transitionLogo || access.logoPrimary}
              alt=""
              className="h-full w-full"
              fit="contain"
            />
          </div>
          <div className="text-start">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">Logo da transição</p>
            <p className="mt-1 max-w-[16rem] text-[0.68rem] leading-relaxed text-text-muted">
              É ela que atravessa a areia depois do Acessar. Vazio usa a logo principal.
            </p>
          </div>
          <MediaField
            position="inline"
            value={access.transitionLogo}
            label="Logo da transição"
            onSave={(url) => setSiteField('access', 'transitionLogo', url, { localized: false })}
          />
        </div>
      )}

      {/* Só no modo edição: link da música que toca aqui */}
      {canEdit && (
        <div className="mt-4 w-full max-w-lg border border-gold/25 bg-black/70 p-3 text-start backdrop-blur">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">Música da tela (YouTube)</p>
          <EditableText
            label="Link da música"
            value={access.music}
            onSave={(v) => setSiteField('access', 'music', v, { localized: false })}
            className="mt-1.5 break-all text-[0.72rem] leading-relaxed text-text-muted"
            placeholder="Cole um link do YouTube…"
          />
          <p className="mt-1.5 text-[0.62rem] leading-relaxed text-text-muted/70">
            Começa em silêncio e o som liga no primeiro clique. Vazio desliga a música.
          </p>
        </div>
      )}
    </motion.section>
  );
}
