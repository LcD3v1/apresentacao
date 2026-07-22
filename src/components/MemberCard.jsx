import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Pencil, Play, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { CornerOrnaments, GoldenParticles } from './ArabicPattern';
import SmartImage from './SmartImage';
import MediaField from './admin/MediaField';

export default function MemberCard({ member, index, onOpenProfile, onPlayVideo, onEdit }) {
  const { t, localize } = useLanguage();
  const { canEdit, persistMember, removeMember } = useContent();
  const [confirming, setConfirming] = useState(false);

  const role = localize(member.role);
  const location = localize(member.location);
  const description = localize(member.shortDescription);

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden bg-surface"
    >
      {/* O retrato ocupa o card inteiro */}
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={member.portrait}
          alt={`${member.name} — ${role}`}
          className="h-full w-full"
          imgClassName="object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06] motion-reduce:transform-none"
        />
      </div>

      {/* Véu escuro: garante contraste do texto sobre qualquer foto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/75 via-40% to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background/95 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-primary/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
      />

      <GoldenParticles
        count={8}
        className="-z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
      />

      {/* Moldura dourada e luz que percorre a borda */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-gold/20 transition-colors duration-500 group-hover:border-gold/70 group-focus-within:border-gold/70"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-gold-light/20 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100 group-focus-within:animate-shimmer group-focus-within:opacity-100" />
      </div>
      <CornerOrnaments opacity={0.35} />

      {/* Número */}
      <span
        aria-hidden="true"
        className="absolute start-5 top-4 font-display text-4xl font-semibold leading-none text-transparent sm:text-5xl"
        style={{ WebkitTextStroke: '1px rgba(212,175,55,0.5)' }}
      >
        {member.number}
      </span>

      {canEdit && (
        <>
          <MediaField
            value={member.portrait}
            label="Retrato"
            onSave={(url) => persistMember(member.id, { portrait: url })}
          />
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="absolute end-3 top-16 z-30 flex min-h-11 items-center gap-2 border border-gold/60 bg-black/80 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-gold backdrop-blur transition-colors duration-200 hover:bg-gold hover:text-background"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>

          {/* Remover pede confirmação no próprio card: some um integrante inteiro */}
          {confirming ? (
            <div className="absolute end-3 top-[7.25rem] z-30 w-[13rem] border border-red-400/50 bg-black/90 p-3 backdrop-blur">
              <p className="text-[0.7rem] leading-relaxed text-text">
                Remover <span className="text-gold-light">{member.name}</span>?
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="cursor-pointer px-2 py-1.5 text-[0.62rem] uppercase tracking-widest text-text-muted transition-colors hover:text-text"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    removeMember(member.id);
                  }}
                  className="cursor-pointer border border-red-400/60 px-2.5 py-1.5 text-[0.62rem] uppercase tracking-widest text-red-200 transition-colors hover:bg-red-500/20"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Remover integrante — ${member.name}`}
              className="absolute end-3 top-[7.25rem] z-30 flex h-11 w-11 cursor-pointer items-center justify-center border border-white/25 bg-black/80 text-text-muted backdrop-blur transition-colors duration-200 hover:border-red-400/70 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </>
      )}

      <div className="relative p-5 sm:p-6">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1 motion-reduce:transform-none">
          {member.arabicName && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm text-gold/80">
              {member.arabicName}
            </p>
          )}
          <h3 className="mt-1 font-display text-2xl font-semibold text-text drop-shadow sm:text-[1.6rem]">
            {member.name}
          </h3>
          <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-gold-light">{role}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
            {location}
          </p>
        </div>

        {/* Bloco que sobe no hover — sempre visível quando o movimento é reduzido */}
        <div className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] motion-reduce:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-1 text-sm leading-relaxed text-text-muted">{description}</p>

            {member.previousPlaces?.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {member.previousPlaces.slice(0, 3).map((place) => (
                  <li
                    key={place}
                    className="border border-gold/20 bg-black/50 px-2.5 py-1 text-[0.66rem] text-sand"
                  >
                    {place}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenProfile(member)}
            className="btn btn-gold cursor-pointer px-4 py-2.5 text-[0.68rem]"
            aria-label={`${t('members.viewProfile')} — ${member.name}`}
          >
            {t('members.viewProfile')}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onPlayVideo(member)}
            aria-label={`${t('members.watchVideo')} — ${member.name}`}
            className="flex h-11 w-11 cursor-pointer items-center justify-center border border-gold/40 text-gold transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-background"
          >
            <Play className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
