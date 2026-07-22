import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Minus, Plus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import LanguageSelector from './LanguageSelector';
import MediaField from './admin/MediaField';

export const NAV_ITEMS = [
  { id: 'home', key: 'nav.home' },
  { id: 'members', key: 'nav.members' },
];

export function BrandMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M17 2 L24 10 L32 17 L24 24 L17 32 L10 24 L2 17 L10 10 Z" stroke="var(--gold)" strokeWidth="1.1" />
      <path d="M17 7 L27 17 L17 27 L7 17 Z" stroke="var(--primary-light)" strokeWidth="1.1" />
      <circle cx="17" cy="17" r="2.6" fill="var(--gold)" />
    </svg>
  );
}

/**
 * Logo do cabecalho: usa a imagem enviada pelo painel e, se ela faltar ou
 * falhar, cai no emblema geometrico — o cabecalho nunca fica sem marca.
 */
export const LOGO_MIN = 28;
export const LOGO_MAX = 96;
export const LOGO_DEFAULT = 44;

export function BrandLogo({ brand, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  const height = Number(brand?.logoHeight) || LOGO_DEFAULT;

  if (!brand?.logo || failed) return <BrandMark size={Math.min(height, 56)} />;

  return (
    <img
      src={brand.logo}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ height }}
      className={`w-auto max-w-[52vw] shrink-0 object-contain sm:max-w-[18rem] ${className}`}
    />
  );
}

/** Aumenta e diminui a logo do cabeçalho, em passos de 4px. */
function LogoSizer({ height, onStep }) {
  const step = (delta) => onStep(delta);

  return (
    <div className="flex items-center gap-1 border border-gold/40 bg-black/80 px-1.5 py-1 backdrop-blur">
      <button
        type="button"
        onClick={() => step(-4)}
        disabled={height <= LOGO_MIN}
        aria-label="Diminuir a logo"
        className="flex h-8 w-8 cursor-pointer items-center justify-center text-gold transition-colors hover:bg-gold hover:text-background disabled:opacity-30"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="min-w-[2.5rem] text-center text-[0.62rem] tabular-nums text-text-muted">
        {height}px
      </span>
      <button
        type="button"
        onClick={() => step(4)}
        disabled={height >= LOGO_MAX}
        aria-label="Aumentar a logo"
        className="flex h-8 w-8 cursor-pointer items-center justify-center text-gold transition-colors hover:bg-gold hover:text-background disabled:opacity-30"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Header() {
  const { t, localize } = useLanguage();
  const { site, setSiteField, canEdit } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  const brand = site.brand ?? {};

  /**
   * A altura da logo responde na hora e só grava quando os cliques param:
   * sem isso cada toque no +/- dispararia um PUT, e cliques rápidos leriam
   * o valor antigo em vez de acumular.
   */
  const savedLogoHeight = Number(brand.logoHeight) || LOGO_DEFAULT;
  const [draftLogoHeight, setDraftLogoHeight] = useState(null);
  const saveTimer = useRef(null);
  const logoHeight = draftLogoHeight ?? savedLogoHeight;

  // Espelho síncrono da altura: dois cliques seguidos no mesmo quadro precisam
  // somar, e o valor vindo do render ainda seria o anterior.
  const heightRef = useRef(logoHeight);
  useEffect(() => {
    heightRef.current = logoHeight;
  }, [logoHeight]);

  useEffect(() => setDraftLogoHeight(null), [savedLogoHeight]);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const stepLogoHeight = (delta) => {
    const next = Math.min(LOGO_MAX, Math.max(LOGO_MIN, heightRef.current + delta));
    heightRef.current = next;
    setDraftLogoHeight(next);

    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setSiteField('brand', 'logoHeight', next, { localized: false });
    }, 550);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const goTo = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-gold/15 bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#members"
        onClick={(e) => goTo(e, 'members')}
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        {t('nav.members')}
      </a>

      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        {/* Só a logo. No modo edição ganha ao lado os controles de troca e tamanho. */}
        {canEdit ? (
          <div className="flex items-center gap-2">
            <BrandLogo brand={{ ...brand, logoHeight }} alt={brand.name || ''} />
            <MediaField
              position="inline"
              value={brand.logo}
              label="Logo do cabeçalho"
              onSave={(url) => setSiteField('brand', 'logo', url, { localized: false })}
            />
            <LogoSizer height={logoHeight} onStep={stepLogoHeight} />
          </div>
        ) : (
          <a
            href="#home"
            onClick={(e) => goTo(e, 'home')}
            className="flex items-center"
            aria-label={`${brand.name} — ${localize(brand.tagline)}`}
          >
            <BrandLogo brand={{ ...brand, logoHeight }} alt={brand.name || ''} />
          </a>
        )}

        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.openMenu')}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => goTo(e, item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`relative cursor-pointer px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-colors duration-200 ${
                active === item.id ? 'text-gold-light' : 'text-text-muted hover:text-text'
              }`}
            >
              {t(item.key)}
              {active === item.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="flex h-11 w-11 cursor-pointer items-center justify-center border border-gold/30 text-gold transition-colors duration-200 hover:border-gold hover:bg-gold/10 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gold/15 bg-black/90 backdrop-blur-xl md:hidden"
          >
            <nav className="container-x flex flex-col py-4" aria-label={t('nav.openMenu')}>
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => goTo(e, item.id)}
                  className="flex cursor-pointer items-center justify-between border-b border-white/5 py-4 text-sm uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold-light"
                >
                  <span>{t(item.key)}</span>
                  <span className="text-[0.65rem] text-gold/60">{String(index + 1).padStart(2, '0')}</span>
                </a>
              ))}
              <div className="pt-5 sm:hidden">
                <LanguageSelector variant="inline" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
