import { gsap, prefersReducedMotion } from './initGSAP';

export function initHorizontalScroll(): void {
  const hSection = document.getElementById('hscroll');
  const hTrack   = hSection?.querySelector<HTMLElement>('.hscroll-track');
  const hPanels  = gsap.utils.toArray<HTMLElement>('.h-panel');

  if (!hSection || !hTrack || hPanels.length < 2) return;
  if (prefersReducedMotion) return;
  /* Su mobile la sezione è già in layout verticale via CSS */
  if (window.innerWidth <= 768) return;

  /* UN SOLO ScrollTrigger per pin + scrub — anima il track, non i singoli pannelli.
     Il track è largo numPanels×100vw; xPercent -75 (per 4 pannelli) lo sposta di 3×100vw. */
  /* CSS sticky handles pinning (.hscroll-sticky); GSAP scrubs the track
     over the section's natural 400vh height — no pin: true needed */
  const containerAnim = gsap.to(hTrack, {
    xPercent: -100 * (hPanels.length - 1) / hPanels.length,
    ease: 'none',
    scrollTrigger: {
      trigger: hSection,
      scrub: 1,
      start: 'top top',
      end: () => `+=${window.innerHeight * (hPanels.length - 1)}`,
      invalidateOnRefresh: true,
    },
  });

  /* Panel content reveal — containerAnimation referenzia il tween corretto */
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
          start: 'left 85%',
          end: 'left 40%',
          scrub: false,
          once: true,
        },
      }
    );
  });
}
