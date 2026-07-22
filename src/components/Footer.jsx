import { ArrowUp, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { ArabicPattern, SectionDivider } from './ArabicPattern';
import { BrandLogo, NAV_ITEMS } from './Header';
import LanguageSelector from './LanguageSelector';
import EditableText from './admin/EditableText';

const NETWORKS = [
  { id: 'instagram', label: 'Instagram', Icon: Instagram },
  { id: 'youtube', label: 'YouTube', Icon: Youtube },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'x', label: 'X', Icon: Twitter },
];

export default function Footer() {
  const { t, localize } = useLanguage();
  const { site, setSiteField, isAdmin } = useContent();
  const year = new Date().getFullYear();

  const brand = site.brand ?? {};
  const footer = site.footer ?? {};
  const socials = footer.socialLinks ?? {};

  const goTo = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className={`relative overflow-hidden border-t border-gold/20 bg-background ${isAdmin ? 'pb-16' : ''}`}>
      <ArabicPattern opacity={0.09} size={110} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent"
      />

      <div className="container-x relative py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo brand={brand} />
              <div>
                <p className="font-display text-lg font-semibold tracking-[0.22em] text-gilded">
                  {brand.name}
                </p>
                <p className="mt-1 text-[0.58rem] uppercase tracking-[0.28em] text-text-muted">
                  {localize(brand.tagline)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <EditableText
                label="Texto do rodapé"
                multiline
                value={footer.description}
                onSave={(v) => setSiteField('footer', 'description', v)}
                className="max-w-md text-sm leading-relaxed text-text-muted"
              />
            </div>

            <div className="mt-7">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold/80">
                {t('footer.languages')}
              </p>
              <div className="mt-3">
                <LanguageSelector variant="inline" />
              </div>
            </div>
          </div>

          <nav aria-label={t('footer.navigation')}>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold/80">
              {t('footer.navigation')}
            </p>
            <ul className="mt-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => goTo(e, item.id)}
                    className="group inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text-muted transition-colors duration-200 hover:text-gold-light"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rotate-45 bg-gold/50 transition-colors group-hover:bg-gold"
                    />
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold/80">
              {t('footer.follow')}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {NETWORKS.filter(({ id }) => socials[id]).map(({ id, label, Icon }) => (
                <li key={id}>
                  <a
                    href={socials[id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center border border-gold/25 text-text-muted transition-colors duration-200 hover:border-gold hover:text-gold-light"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <button type="button" onClick={toTop} className="btn btn-ghost mt-7 cursor-pointer px-4 py-2.5 text-[0.66rem]">
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              {t('footer.backToTop')}
            </button>
          </div>
        </div>

        <SectionDivider className="mt-12" />

        <div className="mt-7 flex flex-col items-center justify-between gap-3 text-center text-xs text-text-muted sm:flex-row sm:text-start">
          <p>
            © {year} {brand.name}. {t('footer.rights')}
          </p>
          <p className="opacity-70">{t('footer.credits')}</p>
        </div>
      </div>
    </footer>
  );
}
