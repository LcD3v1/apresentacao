import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScrollToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > window.innerHeight * 0.85);
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  const radius = 21;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t('footer.backToTop')}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.28 }}
          className="group fixed bottom-6 end-5 z-[70] flex h-12 w-12 items-center justify-center border border-gold/40 bg-black/70 text-gold backdrop-blur transition-colors hover:border-gold hover:bg-gold hover:text-background sm:bottom-8 sm:end-8"
        >
          <svg
            viewBox="0 0 48 48"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              opacity="0.85"
            />
          </svg>
          <ArrowUp className="relative h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
