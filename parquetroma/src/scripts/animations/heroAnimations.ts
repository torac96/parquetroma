import { gsap, ScrollTrigger, prefersReducedMotion } from './initGSAP';

export function initHeroAnimations(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;

  if (prefersReducedMotion) {
    /* Rendi visibile tutto senza animazione */
    hero.querySelectorAll('.hero__eyebrow, .hero__subtitle, .hero__actions, .hero__badges').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  /* Ken Burns sull'immagine di sfondo */
  const bgImg = hero.querySelector<HTMLElement>('.hero__bg-img');
  if (bgImg) {
    gsap.fromTo(bgImg, { scale: 1.12 }, { scale: 1.0, duration: 2.2, ease: 'power2.out' });
  }

  /* Brand line */
  const brandLine = hero.querySelector<HTMLElement>('.hero__brand-line');
  if (brandLine) {
    tl.to(brandLine, { width: '52px', duration: 0.55, ease: 'power3.out' }, 0.3);
  }

  /* Eyebrow — character by character */
  const eyebrow = hero.querySelector<HTMLElement>('.hero__eyebrow');
  if (eyebrow) {
    const text = eyebrow.textContent ?? '';
    eyebrow.innerHTML = text.split('').map(c =>
      c === ' ' ? ' ' : `<span style="display:inline-block;opacity:0;transform:translateY(10px)">${c}</span>`
    ).join('');
    tl.to(eyebrow.querySelectorAll('span'), {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: 'power2.out',
    }, 0.5);
  }

  /* Title — word by word (yPercent reveal) */
  const title = hero.querySelector<HTMLElement>('.hero__title');
  if (title) {
    const html = title.innerHTML;
    title.innerHTML = html.replace(/(\S+)/g, '<span class="word-wrap" style="overflow:hidden;display:inline-block;vertical-align:top"><span class="word" style="display:inline-block;transform:translateY(115%)">$1</span></span>');
    tl.to(title.querySelectorAll('.word'), {
      yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out',
    }, 0.65);
  }

  /* Subtitle */
  tl.to('.hero__subtitle', { opacity: 1, duration: 0.7 }, 1.0);
  /* Actions */
  tl.to('.hero__actions', { opacity: 1, duration: 0.6 }, 1.15);
  /* Badges stagger */
  tl.to('.hero__badge', { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 1.25);

  /* Floating orbs */
  hero.querySelectorAll<HTMLElement>('.hero__orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: i === 0 ? -30 : 25,
      duration: i === 0 ? 9 : 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  /* Scroll indicator bounce */
  const scrollBtn = hero.querySelector<HTMLElement>('.hero__scroll');
  if (scrollBtn) {
    gsap.to(scrollBtn, { y: 10, duration: 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });
  }

  /* Parallax on hero bg on scroll */
  if (bgImg) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        gsap.set(bgImg, { yPercent: self.progress * 25 });
      },
    });
  }
}

export function initPageHeroAnimations(): void {
  const pageHero = document.querySelector<HTMLElement>('.page-hero');
  if (!pageHero) return;
  if (prefersReducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

  const title    = pageHero.querySelector<HTMLElement>('.page-hero__title');
  const subtitle = pageHero.querySelector<HTMLElement>('.page-hero__subtitle');
  const eyebrow  = pageHero.querySelector<HTMLElement>('.page-hero__eyebrow');
  const breadcrumb = pageHero.querySelector<HTMLElement>('.breadcrumb');

  if (breadcrumb) tl.from(breadcrumb, { opacity: 0, y: 15, duration: 0.5 }, 0);
  if (eyebrow)   tl.from(eyebrow,   { opacity: 0, y: 15, duration: 0.5 }, 0.1);

  if (title) {
    const html = title.innerHTML;
    title.innerHTML = html.replace(/(\S+)/g, '<span style="overflow:hidden;display:inline-block;vertical-align:top"><span style="display:inline-block;transform:translateY(110%)">$1</span></span>');
    tl.to(title.querySelectorAll('span > span'), {
      yPercent: 0, duration: 0.8, stagger: 0.06,
    }, 0.2);
  }
  if (subtitle) tl.from(subtitle, { opacity: 0, y: 20, duration: 0.7 }, 0.55);
}
