import { gsap, prefersReducedMotion } from './initGSAP';

export function initMarquee(): void {
  const inner = document.querySelector<HTMLElement>('.marquee__inner');
  if (!inner) return;

  /* Clone per loop seamless */
  const clone = inner.cloneNode(true) as HTMLElement;
  clone.setAttribute('aria-hidden', 'true');
  inner.parentElement?.appendChild(clone);

  if (prefersReducedMotion) return;

  /* Anima entrambi con xPercent -100 per loop infinito */
  gsap.to([inner, clone], {
    xPercent: -100,
    repeat: -1,
    duration: 30,
    ease: 'none',
    will_change: 'transform',
  });
}
