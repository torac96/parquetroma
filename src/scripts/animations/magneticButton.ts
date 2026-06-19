import { gsap, prefersReducedMotion } from './initGSAP';

export function initMagneticButtons(): void {
  if (prefersReducedMotion) return;

  document.querySelectorAll<HTMLElement>('.btn--primary, .btn--white, [data-magnetic]').forEach(btn => {
    let rect: DOMRect;
    let rafId: number;

    /* Cache rect su mouseenter — NON su ogni mousemove */
    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    });

    /* Aggiorna rect al resize con ResizeObserver */
    const ro = new ResizeObserver(() => {
      rect = btn.getBoundingClientRect();
    });
    ro.observe(btn);

    btn.addEventListener('mousemove', (e: MouseEvent) => {
      if (!rect) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.38;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.38;
        gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    btn.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });
}
