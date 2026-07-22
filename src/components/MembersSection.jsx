import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { ArabicPattern, SectionDivider } from './ArabicPattern';
import MemberCard from './MemberCard';
import EditableText from './admin/EditableText';

export default function MembersSection({ onOpenProfile, onPlayVideo, onEditMember }) {
  const { localize } = useLanguage();
  const { site, members, setSiteField } = useContent();
  const section = site.membersSection ?? {};

  return (
    <section
      id="members"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="members-title"
    >
      <ArabicPattern opacity={0.06} size={160} />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] rtl:translate-x-1/2"
      />

      <div className="container-x relative">
        <motion.header
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            <EditableText
              label="Sobretítulo da seção"
              value={section.eyebrow}
              onSave={(v) => setSiteField('membersSection', 'eyebrow', v)}
              className="eyebrow"
            />
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
          </div>

          <div className="relative mt-5">
            {section.arabic && (
              <span
                aria-hidden="true"
                dir="rtl"
                className="pointer-events-none absolute -top-6 start-1/2 -translate-x-1/2 select-none font-arabic text-[3.4rem] leading-none text-gold/[0.07] sm:text-[5rem] rtl:translate-x-1/2"
              >
                {section.arabic}
              </span>
            )}
            <h2 id="members-title" className="relative font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold">
              <EditableText
                as="span"
                label="Título da seção"
                value={section.title}
                onSave={(v) => setSiteField('membersSection', 'title', v)}
                className="text-gilded"
              />
            </h2>
          </div>

          <div className="mt-5">
            <EditableText
              label="Texto da seção"
              multiline
              value={section.subtitle}
              onSave={(v) => setSiteField('membersSection', 'subtitle', v)}
              className="mx-auto max-w-2xl text-base leading-relaxed text-text-muted"
            />
          </div>

          <SectionDivider className="mt-7" />
        </motion.header>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onOpenProfile={onOpenProfile}
              onPlayVideo={onPlayVideo}
              onEdit={onEditMember}
            />
          ))}
        </div>

        {!members.length && (
          <p className="mt-16 text-center text-sm text-text-muted">
            Nenhum integrante cadastrado. Use o painel para adicionar o primeiro.
          </p>
        )}

        <p className="sr-only">{localize(section.subtitle)}</p>
      </div>
    </section>
  );
}
