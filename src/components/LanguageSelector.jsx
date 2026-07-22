import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'desktop' }) {
  const { language, setLanguage, t, translations, languageCodes, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Variante em linha: usada no menu mobile e no rodape
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {languageCodes.map((code) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              aria-pressed={active}
              aria-label={`${t('nav.changeLanguage')}: ${translations[code].meta.label}`}
              className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
                active
                  ? 'border-gold bg-gold/15 text-gold-light'
                  : 'border-white/15 text-text-muted hover:border-gold/60 hover:text-gold-light'
              }`}
            >
              {translations[code].meta.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.changeLanguage')}
        className="flex items-center gap-2 border border-gold/30 bg-surface/60 px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-gold hover:text-gold-light"
      >
        <Globe className="h-4 w-4 text-gold" aria-hidden="true" />
        <span>{translations[language].meta.shortLabel}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t('nav.changeLanguage')}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`glass-panel absolute top-full z-50 mt-2 w-44 overflow-hidden py-1 shadow-deep ${
              isRTL ? 'start-0' : 'end-0'
            }`}
          >
            {languageCodes.map((code) => {
              const active = code === language;
              return (
                <li key={code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(code);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                      active ? 'text-gold-light' : 'text-text-muted hover:bg-white/5 hover:text-text'
                    }`}
                  >
                    <span className={code === 'ar' ? 'font-arabic' : ''}>
                      {translations[code].meta.label}
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
