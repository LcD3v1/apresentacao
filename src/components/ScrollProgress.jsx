import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Fio dourado no topo que acompanha a rolagem da página.
 * A mola tira o "degrau" do scroll e deixa o traço fluido.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left rtl:origin-right"
      style={{
        scaleX: reduce ? scrollYProgress : scaleX,
        background: 'linear-gradient(90deg, var(--primary-light), var(--gold), var(--gold-light))',
        boxShadow: '0 0 12px rgba(212,175,55,0.55)',
      }}
    />
  );
}
