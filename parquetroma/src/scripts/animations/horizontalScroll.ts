import { gsap, prefersReducedMotion } from './initGSAP';

export function initHorizontalScroll(): void {
  const hSection = document.getElementById('hscroll');
  const hPanels  = gsap.utils.toArray<HTMLElement>('.h-panel');

  if (!hSection || hPanels.length < 2) return;
  if (prefersReducedMotion) return;
  /* Su mobile la sezione è già in layout verticale via CSS */
  if (window.innerWidth <= 768) return;

  /* UN SOLO ScrollTrigger per pin + scrub */
  const containerAnim = gsap.to(hPanels, {
    xPercent: -100 * (hPanels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: hSection,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${hSection.offsetWidth * (hPanels.length - 1)}`,
      invalidateOnRefresh: true,
    },
  });

  /* Panel content reveal — containerAnimation referenzia il tween corretto (non gsap.globalTimeline) */
  hPanels.forEach((panel, i) => {
    if (i === 0) return;
    const content = panel.querySelector<HTMLElement>('.h-panel__content');
    if (!content) return;
    gsap.fromTo(
      content,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: containerAnim,
          start: 'left center',
          once: true,
        },
      }
    );
  });
}
