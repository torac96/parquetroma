import { gsap, prefersReducedMotion } from './initGSAP';

export function initHorizontalScroll(): void {
  const hSection = document.getElementById('hscroll');
  const hTrack   = hSection?.querySelector<HTMLElement>('.hscroll-track');
  const hPanels  = gsap.utils.toArray<HTMLElement>('.h-panel');

  if (!hSection || !hTrack || hPanels.length < 2) return;
  if (prefersReducedMotion) return;
  /* Su mobile la sezione è già in layout verticale via CSS */
  if (window.innerWidth <= 768) return;

  /* CSS sticky handles pinning (.hscroll-sticky); GSAP scrubs the track.
     Use explicit pixel distance to avoid xPercent/offsetWidth ambiguity. */
  gsap.to(hTrack, {
    x: () => -(hPanels.length - 1) * window.innerWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: hSection,
      scrub: 1,
      start: 'top top',
      end: () => `+=${window.innerHeight * (hPanels.length - 1)}`,
      invalidateOnRefresh: true,
    },
  });
}
