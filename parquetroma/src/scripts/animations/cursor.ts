import { prefersReducedMotion } from './initGSAP';

export function initCursor(): void {
  const dot      = document.getElementById('cursor') as HTMLElement | null;
  const follower = document.getElementById('cursor-follower') as HTMLElement | null;

  if (!dot || !follower) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (prefersReducedMotion) return;

  document.body.classList.add('has-cursor');

  let mx = -200, my = -200, fx = -200, fy = -200;
  let raf: number;

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;

    /* Spotlight glow via CSS custom property */
    document.documentElement.style.setProperty('--cx', `${mx}px`);
    document.documentElement.style.setProperty('--cy', `${my}px`);
  }, { passive: true });

  function animate(): void {
    /* Dot segue istantaneamente */
    dot!.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;

    /* Follower con lag (easing 0.12) */
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower!.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;

    raf = requestAnimationFrame(animate);
  }
  animate();

  /* Expand on interactive elements */
  document.querySelectorAll('a, button, [data-cursor-expand]').forEach(el => {
    el.addEventListener('mouseenter', () => follower!.classList.add('expanded'));
    el.addEventListener('mouseleave', () => follower!.classList.remove('expanded'));
  });

  /* DRAG label */
  document.querySelectorAll('.testimonials__track, [data-cursor-drag], [data-slider]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower!.setAttribute('data-label', 'DRAG');
      follower!.classList.add('has-label');
    });
    el.addEventListener('mouseleave', () => {
      follower!.removeAttribute('data-label');
      follower!.classList.remove('has-label');
    });
  });

  /* VIEW label */
  document.querySelectorAll('.project-card, .material-card, [data-cursor-view]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower!.setAttribute('data-label', 'VIEW');
      follower!.classList.add('has-label');
    });
    el.addEventListener('mouseleave', () => {
      follower!.removeAttribute('data-label');
      follower!.classList.remove('has-label');
    });
  });

  /* Cleanup on Astro View Transitions */
  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(raf);
  });
  document.addEventListener('astro:after-swap', () => {
    animate();
  });
}
