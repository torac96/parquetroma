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

  // Pre-nasconde subito tutti gli elementi per prevenire FOUC su ViewTransitions
  const eyebrow  = hero.querySelector<HTMLElement>('.hero__eyebrow');
  const title    = hero.querySelector<HTMLElement>('.hero__title');
  const subtitle = hero.querySelector<HTMLElement>('.hero__subtitle');
  const actions  = hero.querySelector<HTMLElement>('.hero__actions');
  const badges   = hero.querySelectorAll<HTMLElement>('.hero__badge');
  const brandLine = hero.querySelector<HTMLElement>('.hero__brand-line');

  if (!prefersReducedMotion) {
    if (eyebrow)        gsap.set(eyebrow,   { opacity: 0 });
    if (title)          gsap.set(title,     { opacity: 0 });
    if (subtitle)       gsap.set(subtitle,  { opacity: 0 });
    if (actions)        gsap.set(actions,   { opacity: 0 });
    if (badges.length)  gsap.set(badges,    { opacity: 0, y: 16 });
    if (brandLine)      gsap.set(brandLine, { width: 0 });
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  /* Ken Burns sull'immagine di sfondo */
  const bgImg = hero.querySelector<HTMLElement>('.hero__bg-img');
  if (bgImg) {
    gsap.fromTo(bgImg, { scale: 1.12 }, { scale: 1.0, duration: 2.2, ease: 'power2.out' });
  }

  /* Brand line */
  if (brandLine) {
    tl.to(brandLine, { width: '52px', duration: 0.55, ease: 'power3.out' }, 0.3);
  }

  /* Eyebrow — character by character */
  if (eyebrow) {
    const text = eyebrow.textContent ?? '';
    eyebrow.innerHTML = text.split('').map(c =>
      c === ' ' ? ' ' : `<span style="display:inline-block;opacity:0;transform:translateY(10px)">${c}</span>`
    ).join('');
    // Il container ha CSS opacity:0 — va ripristinato a 1 dopo il rewrite
    // (i singoli char-span rimangono a opacity:0 tramite il loro inline style)
    gsap.set(eyebrow, { opacity: 1 });
    tl.to(eyebrow.querySelectorAll('span'), {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: 'power2.out',
    }, 0.5);
  }

  /* Title — word by word (yPercent reveal) */
  if (title) {
    const newHTML = Array.from(title.childNodes)
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? '';
          return text.split(/(\s+)/).map(word =>
            /\s+/.test(word) ? word : `<span class="word-wrap" style="overflow:hidden;display:inline-block;vertical-align:top"><span class="word" style="display:inline-block;transform:translateY(115%)">` + word + `</span></span>`
          ).join('');
        } else {
          return (node as Element).outerHTML;
        }
      })
      .join('');
    title.innerHTML = newHTML;
    gsap.set(title, { opacity: 0 }); // re-nascondi dopo innerHTML rewrite (resetta stili inline)
    tl.to(title, { opacity: 1, duration: 0.01 }, 0.64); // snap visibile prima che le parole scorrano
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

  const title      = pageHero.querySelector<HTMLElement>('.page-hero__title');
  const subtitle   = pageHero.querySelector<HTMLElement>('.page-hero__subtitle');
  const eyebrow    = pageHero.querySelector<HTMLElement>('.page-hero__eyebrow');
  const breadcrumb = pageHero.querySelector<HTMLElement>('.breadcrumb');

  // Pre-nascondi subito per prevenire FOUC
  if (breadcrumb) gsap.set(breadcrumb, { opacity: 0, y: 15 });
  if (eyebrow)    gsap.set(eyebrow,   { opacity: 0, y: 15 });
  if (title)      gsap.set(title,     { opacity: 0 });
  if (subtitle)   gsap.set(subtitle,  { opacity: 0, y: 20 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

  if (breadcrumb) tl.to(breadcrumb, { opacity: 1, y: 0, duration: 0.5 }, 0);
  if (eyebrow)    tl.to(eyebrow,   { opacity: 1, y: 0, duration: 0.5 }, 0.1);

  if (title) {
    const newHTML = Array.from(title.childNodes)
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? '';
          return text.split(/(\s+)/).map(word =>
            /\s+/.test(word) ? word : `<span style="overflow:hidden;display:inline-block;vertical-align:top"><span style="display:inline-block;transform:translateY(110%)">` + word + `</span></span>`
          ).join('');
        } else {
          return (node as Element).outerHTML;
        }
      })
      .join('');
    title.innerHTML = newHTML;
    gsap.set(title, { opacity: 0 }); // re-nascondi dopo innerHTML rewrite (resetta stili inline)
    tl.to(title, { opacity: 1, duration: 0.01 }, 0.19); // snap visibile prima dello slide
    tl.to(title.querySelectorAll('span > span'), {
      yPercent: 0, duration: 0.8, stagger: 0.06,
    }, 0.2);
  }
  if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, 0.55);
}
