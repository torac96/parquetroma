import { gsap, prefersReducedMotion } from './initGSAP';

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function initTiltCards(): void {
  if (prefersReducedMotion) return;

  document.querySelectorAll<HTMLElement>('.tilt-card').forEach(el => {
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      /* Clampa a ±5° — era ±8°, troppo aggressivo vicino ai bordi */
      const rotX = clamp(-(y / r.height) * 10, -5, 5);
      const rotY = clamp((x / r.width) * 10, -5, 5);
      gsap.to(el, {
        rotateX: rotX,
        rotateY: rotY,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.6, ease: 'power3.out',
        overwrite: 'auto',
        clearProps: 'rotateX,rotateY',
      });
    });
  });
}
