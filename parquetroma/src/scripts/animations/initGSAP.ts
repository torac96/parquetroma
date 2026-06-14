import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  gsap.defaults({ ease: 'power3.out', duration: 0.85 });
  ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
}

export { gsap, ScrollTrigger };

/* Cleanup on Astro View Transitions */
document.addEventListener('astro:before-swap', () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.killTweensOf('*');
});
