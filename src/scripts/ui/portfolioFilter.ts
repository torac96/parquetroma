import { gsap, prefersReducedMotion } from '../animations/initGSAP';

export function initPortfolioFilter(): void {
  const filters = document.querySelectorAll<HTMLElement>('.portfolio__filter');
  const cards   = document.querySelectorAll<HTMLElement>('.project-card');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter') ?? 'all';

      /* Update active state */
      filters.forEach(b => b.classList.remove('portfolio__filter--active'));
      btn.classList.add('portfolio__filter--active');

      if (prefersReducedMotion) {
        cards.forEach(card => {
          const show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.classList.toggle('hidden', !show);
        });
        return;
      }

      /* Animate out */
      const visible = [...cards].filter(c => !c.classList.contains('hidden'));
      gsap.to(visible, {
        opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in',
        onComplete() {
          cards.forEach(card => {
            const show = cat === 'all' || card.getAttribute('data-category') === cat;
            card.classList.toggle('hidden', !show);
          });

          /* Animate in */
          const nowVisible = [...cards].filter(c => !c.classList.contains('hidden'));
          gsap.fromTo(
            nowVisible,
            { opacity: 0, y: 24, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.7)', clearProps: 'transform' }
          );
        },
      });
    });
  });
}
