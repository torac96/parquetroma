import { gsap, ScrollTrigger, prefersReducedMotion } from './initGSAP';

export function initScrollReveals(): void {
  if (prefersReducedMotion) return;

  /* reveal-up */
  gsap.utils.toArray<HTMLElement>('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* reveal-left */
  gsap.utils.toArray<HTMLElement>('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* reveal-right */
  gsap.utils.toArray<HTMLElement>('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* stagger grids */
  gsap.utils.toArray<HTMLElement>('.stagger-grid').forEach(grid => {
    const children = grid.querySelectorAll<HTMLElement>(':scope > *');
    gsap.to(children, {
      opacity: 1, y: 0, scale: 1, duration: 0.8,
      ease: 'back.out(1.5)',
      stagger: 0.12,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    });
  });

  /* material cards — translateY + overflow:hidden (no clip-path) */
  gsap.utils.toArray<HTMLElement>('.mat-reveal').forEach((card, i) => {
    gsap.to(card, {
      yPercent: 0, opacity: 1, duration: 1.0, ease: 'power4.out',
      scrollTrigger: { trigger: card.closest('.mat-reveal-wrap') ?? card, start: 'top 85%', once: true },
      delay: i * 0.13,
    });
  });

  /* processo line draw */
  const lineBar = document.querySelector<HTMLElement>('.processo__line-bar');
  if (lineBar) {
    gsap.to(lineBar, {
      scaleY: 1, duration: 1, ease: 'none',
      scrollTrigger: {
        trigger: lineBar.closest('.processo__steps') ?? lineBar,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 1,
      },
    });
  }

  /* processo steps stagger */
  gsap.utils.toArray<HTMLElement>('.processo__step').forEach((step, i) => {
    gsap.from(step, {
      opacity: 0, x: -30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 87%', once: true },
      delay: i * 0.1,
    });
  });

  /* timeline items (chi-siamo) */
  gsap.utils.toArray<HTMLElement>('.timeline__item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, x: i % 2 === 0 ? -40 : 40, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 87%', once: true },
    });
  });

  /* section numbers parallax */
  gsap.utils.toArray<HTMLElement>('.section-num').forEach(num => {
    gsap.to(num, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: num.closest('.section') ?? num, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  /* trust bar counters */
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count') ?? '0');
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate() {
        el.textContent = Number.isInteger(target)
          ? Math.round(obj.val).toString()
          : obj.val.toFixed(1);
      },
    });
  });

  /* statement section */
  const statDecorator = document.querySelector<HTMLElement>('.statement__decorator');
  if (statDecorator) {
    gsap.to(statDecorator, {
      scaleX: 1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: statDecorator, start: 'top 80%', once: true },
    });
  }
  gsap.utils.toArray<HTMLElement>('.statement__line-inner').forEach((inner, i) => {
    gsap.to(inner, {
      y: 0, duration: 0.85, ease: 'power4.out',
      scrollTrigger: { trigger: inner.closest('.statement__quote') ?? inner, start: 'top 80%', once: true },
      delay: i * 0.2,
    });
  });
  const statMeta = document.querySelector<HTMLElement>('.statement__meta');
  if (statMeta) {
    gsap.to(statMeta, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: statMeta, start: 'top 80%', once: true },
      delay: 0.5,
    });
  }

  /* statement watermark parallax */
  const wm = document.querySelector<HTMLElement>('.statement__wm');
  if (wm) {
    gsap.to(wm, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '.statement-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  }

  /* statement ticker */
  const ticker = document.querySelector<HTMLElement>('.statement__ticker-inner');
  if (ticker) {
    const totalW = ticker.scrollWidth;
    gsap.to(ticker, {
      x: -totalW / 2, duration: 28, ease: 'none', repeat: -1,
    });
  }

  /* scroll progress bar */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        gsap.set(progressBar, { scaleX: self.progress });
      },
    });
  }
}
