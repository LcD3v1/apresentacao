import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Comportamento comum de modal:
 * - fecha com Escape
 * - bloqueia a rolagem da pagina (sem "pulo" da barra de rolagem)
 * - prende o foco dentro do painel (Tab / Shift+Tab)
 * - devolve o foco ao elemento que abriu o modal
 */
export default function useModalBehavior(isOpen, onClose) {
  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    lastFocused.current = document.activeElement;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousPadding = document.body.style.paddingInlineEnd;
    if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`;
    document.body.classList.add('modal-open');

    const focusFirst = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector('[data-autofocus]') ?? panel.querySelector(FOCUSABLE) ?? panel;
      target.focus?.({ preventScroll: true });
    }, 60);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el.tagName === 'IFRAME',
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
      document.body.style.paddingInlineEnd = previousPadding;
      lastFocused.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  return panelRef;
}
