import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Instagram,
  Landmark,
  Linkedin,
  MapPin,
  PlayCircle,
  Twitter,
  X,
  Youtube,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useModalBehavior from '../hooks/useModalBehavior';
import { ArabicPattern, CornerOrnaments, SectionDivider } from './ArabicPattern';
import SmartImage from './SmartImage';

const SOCIAL_ICONS = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  x: Twitter,
};

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
};

export default function MemberModal({ member, onClose, onPlayVideo }) {
  const { t, localize } = useLanguage();
  const panelRef = useModalBehavior(Boolean(member), onClose);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-hidden p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label={t('modal.close')}
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
            initial={{ opacity: 0, y: 42, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.985 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border-gold/25 bg-background shadow-deep sm:max-h-[92vh] sm:border"
          >
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label={t('modal.close')}
              className="absolute end-4 top-4 z-30 flex h-11 w-11 items-center justify-center border border-gold/40 bg-black/70 text-gold backdrop-blur transition-colors hover:border-gold hover:bg-gold hover:text-background"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
              {/* Cabecalho com foto de fundo e retrato */}
              <header className="relative overflow-hidden">
                <div className="absolute inset-0">
                  <SmartImage src={member.backgroundImage} alt="" className="h-full w-full" />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40"
                />
                <ArabicPattern opacity={0.09} size={140} />

                <div className="relative flex flex-col gap-7 px-5 pb-9 pt-16 sm:px-10 sm:pt-20 md:flex-row md:items-end">
                  <div className="relative h-52 w-40 shrink-0 sm:h-64 sm:w-48">
                    <div
                      className="h-full w-full overflow-hidden border border-gold/50 bg-surface"
                      style={{ borderRadius: '999px 999px 8px 8px' }}
                    >
                      <SmartImage
                        src={member.portrait}
                        alt={`${member.name} — ${localize(member.role)}`}
                        className="h-full w-full"
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3 start-1/2 -translate-x-1/2 border border-gold/50 bg-background px-3 py-1 font-display text-sm text-gold rtl:translate-x-1/2"
                    >
                      {member.number}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p dir="rtl" lang="ar" className="font-arabic text-lg text-gold-light">
                      {member.arabicName}
                    </p>
                    <h2
                      id="member-modal-title"
                      className="mt-1 font-display text-[clamp(1.9rem,5vw,3rem)] font-semibold text-gilded"
                    >
                      {member.name}
                    </h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gold-light">
                      {localize(member.role)}
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                      <MapPin className="h-4 w-4 text-gold/70" aria-hidden="true" />
                      {localize(member.location)}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onPlayVideo(member)}
                        className="btn btn-gold px-5 py-2.5 text-[0.72rem]"
                      >
                        <PlayCircle className="h-4 w-4" aria-hidden="true" />
                        {t('modal.watchFilm')}
                      </button>

                      <ul className="flex items-center gap-2" aria-label={t('modal.social')}>
                        {Object.entries(member.socialLinks || {})
                          .filter(([, url]) => Boolean(url))
                          .map(([key, url]) => {
                            const Icon = SOCIAL_ICONS[key];
                            if (!Icon) return null;
                            return (
                              <li key={key}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`${SOCIAL_LABELS[key]} — ${member.name}`}
                                  className="flex h-10 w-10 items-center justify-center border border-gold/30 text-text-muted transition-colors hover:border-gold hover:text-gold-light"
                                >
                                  <Icon className="h-4 w-4" aria-hidden="true" />
                                </a>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>
              </header>

              <div className="grid gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
                <div>
                  <h3 className="font-display text-xl text-gold-light">{t('modal.biography')}</h3>
                  <span className="mt-3 block h-px w-16 bg-gold/50" aria-hidden="true" />
                  <p className="mt-5 whitespace-pre-line text-[0.97rem] leading-loose text-text-muted">
                    {localize(member.biography)}
                  </p>

                  <h3 className="mt-12 font-display text-xl text-gold-light">{t('modal.timeline')}</h3>
                  <span className="mt-3 block h-px w-16 bg-gold/50" aria-hidden="true" />

                  <ol className="relative mt-7 space-y-8 ps-8">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1 start-[7px] w-px bg-gradient-to-b from-gold via-gold/40 to-transparent"
                    />
                    {member.timeline.map((entry) => (
                      <li key={entry.year} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -start-8 top-1.5 flex h-4 w-4 items-center justify-center"
                        >
                          <span className="h-2.5 w-2.5 rotate-45 border border-gold bg-background" />
                        </span>
                        <p className="font-display text-lg text-gold">{entry.year}</p>
                        <p className="mt-1 font-medium text-text">{localize(entry.title)}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                          {localize(entry.description)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                <aside className="space-y-10">
                  <section>
                    <h3 className="flex items-center gap-2 font-display text-xl text-gold-light">
                      <Landmark className="h-5 w-5 text-gold/80" aria-hidden="true" />
                      {t('modal.previousPlaces')}
                    </h3>
                    <ul className="mt-5 space-y-2.5">
                      {member.previousPlaces.map((place) => (
                        <li
                          key={place}
                          className="flex items-center gap-3 border border-white/10bg-surface px-4 py-3 text-sm text-sand"
                        >
                          <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
                          {place}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 font-display text-xl text-gold-light">
                      <Award className="h-5 w-5 text-gold/80" aria-hidden="true" />
                      {t('modal.achievements')}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {localize(member.achievements).map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary-light" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>
              </div>

              <SectionDivider className="pb-2" />

              <section className="px-5 pb-14 pt-8 sm:px-10">
                <h3 className="font-display text-xl text-gold-light">{t('modal.gallery')}</h3>
                <span className="mt-3 block h-px w-16 bg-gold/50" aria-hidden="true" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {member.gallery.map((image, index) => (
                    <figure key={image} className="ornate-frame relative overflow-hidden border border-gold/20">
                      <SmartImage
                        src={image}
                        alt={`${member.name} — ${t('modal.gallery')} ${index + 1}`}
                        className="aspect-[4/3] w-full"
                        imgClassName="transition-transform duration-700 hover:scale-105"
                      />
                      <CornerOrnaments opacity={0.3} />
                    </figure>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
