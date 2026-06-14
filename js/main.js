'use strict';
/* ParquetRoma — Main JS v2 with GSAP */

/* ============================================================
   REGISTER GSAP PLUGINS
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   PAGE LOADER
   ============================================================ */
(function () {
  const loader   = document.getElementById('loader');
  const progress = loader?.querySelector('.loader__progress');
  if (!loader) return;

  /* Stagger the 4 logo squares */
  const rects = loader.querySelectorAll('rect');
  if (rects.length) {
    gsap.to(rects, {
      scale: 0.55, opacity: 1, transformOrigin: 'center', ease: 'power2.inOut',
      duration: 0.5, stagger: { each: 0.14, repeat: -1, yoyo: true }
    });
  }

  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 90);
    if (progress) progress.style.width = pct + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(tick);
    if (progress) progress.style.width = '100%';
    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initPageAnimations();
      }
    });
  });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function () {
  const dot      = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!dot || !follower || window.matchMedia('(pointer: coarse)').matches) return;

  document.body.classList.add('has-cursor');

  let mx = -200, my = -200, fx = -200, fy = -200;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    dot.style.transform = `translate(${mx}px,${my}px)`;
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx}px,${fy}px)`;
    raf = requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, [data-cursor-expand]').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('expanded'));
    el.addEventListener('mouseleave', () => follower.classList.remove('expanded'));
  });

  /* DRAG label on testimonials track + before/after sliders */
  document.querySelectorAll('.testimonials__track, [data-cursor-drag], [data-slider]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.setAttribute('data-label', 'DRAG');
      follower.classList.add('has-label');
    });
    el.addEventListener('mouseleave', () => {
      follower.removeAttribute('data-label');
      follower.classList.remove('has-label');
    });
  });

  /* VIEW label on project/material cards */
  document.querySelectorAll('.project-card, .material-card, [data-cursor-view]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.setAttribute('data-label', 'VIEW');
      follower.classList.add('has-label');
    });
    el.addEventListener('mouseleave', () => {
      follower.removeAttribute('data-label');
      follower.classList.remove('has-label');
    });
  });
})();

/* ============================================================
   SPOTLIGHT GLOW (drives CSS --cx/--cy vars on body::after)
   ============================================================ */
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  }, { passive: true });
}

/* ============================================================
   HEADER — scroll + mobile menu
   ============================================================ */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   PAGE ANIMATIONS (called after loader exits)
   ============================================================ */
function initPageAnimations() {

  /* ---------- HERO (homepage) ---------- */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    // Wrap each word in a span for reveal
    heroTitle.innerHTML = heroTitle.innerHTML.replace(
      /(<[^>]+>)|([^<>\s]+(?:\s+[^<>\s]+)*)/g,
      (m, tag, words) => {
        if (tag) return tag;
        return words.split(' ').map(w =>
          `<span class="hero__word" style="display:inline-block;overflow:hidden"><span class="hero__word-inner" style="display:inline-block">${w}</span></span>`
        ).join(' ');
      }
    );

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    /* Hero eyebrow: character-by-character reveal */
    const heroEyebrow = document.querySelector('.hero__eyebrow');
    if (heroEyebrow) {
      const eyeText = heroEyebrow.textContent;
      heroEyebrow.innerHTML = eyeText.split('').map(ch =>
        ch === ' ' ? '<span style="display:inline-block;width:.28em"> </span>'
                   : `<span class="hec" style="display:inline-block;opacity:0;transform:translateY(10px)">${ch}</span>`
      ).join('');
    }

    /* Ken Burns: hero bg zooms from 1.12 → 1.0 on load */
    tl.fromTo('.hero__bg-img', { scale: 1.12 }, { scale: 1.0, duration: 2.2, ease: 'power2.out' }, 0);
    /* Gold brand line draws in */
    tl.to('.hero__brand-line', { width: 52, duration: 0.55, ease: 'power3.out' }, 0.05);
    if (heroEyebrow) {
      tl.to(heroEyebrow.querySelectorAll('.hec'),
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.028, ease: 'power2.out' }, 0.15);
    } else {
      tl.fromTo('.hero__eyebrow',
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
    }
    tl.fromTo('.hero__word-inner',
      { yPercent: 115 },
      { yPercent: 0, duration: 1, stagger: 0.06 }, 0.4)
     .fromTo('.hero__subtitle',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9 }, 0.9)
     .fromTo('.hero__actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 }, 1.1)
     .fromTo('.hero__badges .hero__badge',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.2);
  }

  /* ---------- HERO ORBS FLOAT ---------- */
  gsap.to('.hero__orb--1', { y: -35, x: 15, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.hero__orb--2', { y: 28, x: -12, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });

  /* ---------- HERO PARALLAX ---------- */
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- HERO SCROLL INDICATOR ---------- */
  gsap.to('.hero__scroll', {
    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: 'sine.inOut'
  });

  /* ---------- MARQUEE ---------- */
  const marqueeInner = document.querySelector('.marquee__inner');
  if (marqueeInner) {
    // Clone items for seamless loop
    marqueeInner.innerHTML += marqueeInner.innerHTML;
    const totalW = marqueeInner.scrollWidth / 2;
    gsap.to(marqueeInner, {
      x: -totalW,
      duration: 30,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(v => parseFloat(v) % totalW)
      }
    });
  }

  /* ---------- TRUST COUNTERS ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + (el.dataset.suffix || '');
          }
        });
      }
    });
  });

  /* ---------- GENERIC SECTION REVEALS ---------- */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  /* ---------- STAGGER GRIDS ---------- */
  document.querySelectorAll('.stagger-grid').forEach(grid => {
    const items = grid.children;
    gsap.fromTo(items,
      { opacity: 0, y: 55, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
      }
    );
  });

  /* ---------- PROCESS LINE DRAW ---------- */
  const processLine = document.querySelector('.processo__line-path');
  if (processLine) {
    const len = processLine.getTotalLength();
    gsap.set(processLine, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(processLine, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.processo__steps',
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 1
      }
    });
  }

  /* ---------- PROCESSO STEPS STAGGER ---------- */
  gsap.utils.toArray('.processo__step').forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 88%', once: true }
      }
    );
  });

  /* ---------- IMAGE CLIP REVEAL ---------- */
  gsap.utils.toArray('.clip-reveal').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      }
    );
  });

  /* ---------- SECTION NUMBERS PARALLAX ---------- */
  gsap.utils.toArray('.section-num').forEach(num => {
    gsap.to(num, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: num.closest('section') || num,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  /* ---------- CTA BAND SCALE ---------- */
  const ctaBand = document.querySelector('.cta-band');
  if (ctaBand) {
    gsap.fromTo(ctaBand,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ctaBand, start: 'top 85%', once: true }
      }
    );
  }

  /* ---------- PAGE HERO KEN BURNS + PARALLAX ---------- */
  const phBgImg = document.querySelector('.page-hero__bg img');
  if (phBgImg) {
    gsap.fromTo(phBgImg, { scale: 1.1 }, { scale: 1.0, duration: 2.4, ease: 'power2.out' });
    gsap.to(phBgImg, {
      yPercent: 24, ease: 'none',
      scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- HORIZONTAL SCROLL PANELS ---------- */
  const hSection = document.getElementById('hscroll');
  const hPanels  = gsap.utils.toArray('.h-panel');
  if (hSection && hPanels.length > 1) {
    const totalMove = hPanels[0].offsetWidth * (hPanels.length - 1);
    gsap.to(hPanels, {
      xPercent: -100 * (hPanels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: hSection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${totalMove}`,
        invalidateOnRefresh: true
      }
    });
    /* Each panel's content fades in as it enters */
    hPanels.forEach((panel, i) => {
      const content = panel.querySelector('.h-panel__content');
      if (!content || i === 0) return;
      gsap.fromTo(content,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: {
            trigger: hSection,
            start: () => `top+=${totalMove / (hPanels.length - 1) * i * 0.7} top`,
            end: () => `top+=${totalMove / (hPanels.length - 1) * i + 200} top`,
            scrub: false,
            containerAnimation: gsap.globalTimeline,
            once: true
          }
        }
      );
    });
  }

  /* ---------- PROCESS LINE ANIMATED ---------- */
  const procLine = document.querySelector('.processo__line-bar');
  if (procLine) {
    gsap.to(procLine, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: procLine.closest('[style*="position:relative"]') || procLine.parentElement,
        start: 'top 70%',
        end: 'bottom 55%',
        scrub: 1
      }
    });
  }

  /* ---------- PAGE HERO EYEBROW ---------- */
  const phEyebrow = document.querySelector('.page-hero__eyebrow');
  if (phEyebrow) {
    gsap.fromTo(phEyebrow, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.35 });
  }

  /* ---------- PAGE HERO BREADCRUMB ---------- */
  const breadcrumb = document.querySelector('.page-hero .breadcrumb');
  if (breadcrumb) {
    gsap.fromTo(breadcrumb, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 });
  }

  /* ---------- PAGE HERO SUBTITLE ---------- */
  const phSub = document.querySelector('.page-hero__subtitle');
  if (phSub) {
    /* Split into words for a staggered reveal */
    phSub.innerHTML = phSub.textContent.split(' ').map(w =>
      `<span style="display:inline-block;overflow:hidden"><span class="phsw" style="display:inline-block">${w}</span></span>`
    ).join(' ');
    gsap.fromTo(phSub.querySelectorAll('.phsw'),
      { yPercent: 105, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: 'power3.out', delay: 0.75 }
    );
  }

  /* ---------- TRUST BAR STAGGER ---------- */
  gsap.utils.toArray('.trust-bar__stat').forEach((stat, i) => {
    gsap.fromTo(stat,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: stat, start: 'top 88%', once: true }
      }
    );
  });

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => gsap.set(prog, { scaleX: self.progress })
    });
  }

  /* ---------- SECTION TITLE WORD REVEALS ---------- */
  gsap.utils.toArray('.section__title').forEach(el => {
    if (el.dataset.wSplit) return;
    el.dataset.wSplit = '1';
    el.innerHTML = el.innerHTML.replace(
      /(<[^>]+>)|([^\s<]+)/g,
      (m, tag, word) => {
        if (tag) return tag;
        return `<span style="display:inline-block;overflow:hidden"><span class="stw" style="display:inline-block">${word}</span></span>`;
      }
    );
    gsap.set(el.querySelectorAll('.stw'), { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(el.querySelectorAll('.stw'), {
          yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out'
        });
      }
    });
  });

  /* ---------- PAGE HERO TITLE WORD REVEALS ---------- */
  gsap.utils.toArray('.page-hero__title').forEach(el => {
    if (el.dataset.wSplit) return;
    el.dataset.wSplit = '1';
    el.innerHTML = el.innerHTML.replace(
      /(<[^>]+>)|([^\s<]+)/g,
      (m, tag, word) => {
        if (tag) return tag;
        return `<span style="display:inline-block;overflow:hidden"><span class="phtw" style="display:inline-block">${word}</span></span>`;
      }
    );
    gsap.fromTo(el.querySelectorAll('.phtw'),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out', delay: 0.4 }
    );
  });

  /* ---------- EYEBROW CHARACTER REVEALS ---------- */
  gsap.utils.toArray('.section__eyebrow').forEach(el => {
    if (el.dataset.cSplit) return;
    el.dataset.cSplit = '1';
    const text = el.textContent;
    el.innerHTML = text.split('').map(ch =>
      ch === ' ' ? ' ' : `<span class="ec" style="display:inline-block">${ch}</span>`
    ).join('');
    gsap.set(el.querySelectorAll('.ec'), { opacity: 0, y: 10 });
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        gsap.to(el.querySelectorAll('.ec'), {
          opacity: 1, y: 0, duration: 0.35, stagger: 0.025, ease: 'power2.out'
        });
      }
    });
  });

  /* ---------- MATERIAL CARDS REVEAL ---------- */
  gsap.utils.toArray('.material-card').forEach((card, i) => {
    gsap.fromTo(card,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power4.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        delay: i * 0.13
      }
    );
    const bg = card.querySelector('.material-card__bg');
    if (bg) {
      gsap.fromTo(bg, { yPercent: -20 }, {
        yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 2 }
      });
    }
  });

  /* ---------- STATEMENT SECTION ---------- */
  const stDecorator = document.querySelector('.statement__decorator');
  if (stDecorator) {
    gsap.to(stDecorator, {
      scaleX: 1, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: '.statement-section', start: 'top 75%', once: true }
    });
  }
  gsap.utils.toArray('.statement__line-inner').forEach((inner, i) => {
    gsap.to(inner, {
      y: 0, duration: 1.15, ease: 'power4.out', delay: i * 0.2,
      scrollTrigger: {
        trigger: inner.closest('.statement__quote') || inner,
        start: 'top 80%',
        once: true
      }
    });
  });
  const stMeta = document.querySelector('.statement__meta');
  if (stMeta) {
    gsap.to(stMeta, {
      opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: stMeta, start: 'top 88%', once: true }
    });
  }
  /* Statement reverse ticker */
  const stTicker = document.querySelector('.statement__ticker-inner');
  if (stTicker) {
    stTicker.innerHTML += stTicker.innerHTML;
    const stTW = stTicker.scrollWidth / 2;
    gsap.fromTo(stTicker,
      { x: -stTW },
      { x: 0, duration: 28, ease: 'none', repeat: -1 }
    );
  }

  /* Statement watermark parallax drift */
  const stWm = document.querySelector('.statement__wm');
  if (stWm) {
    gsap.to(stWm, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.statement-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  /* ---------- MAGNETIC PRIMARY BUTTONS ---------- */
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.btn--primary, .btn--white, [data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.38;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.38;
        gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      });
    });
  }

  /* ---------- FOOTER COLUMNS STAGGER ---------- */
  ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.footer__brand',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
      );
      gsap.fromTo('.footer__col',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.12 }
      );
      gsap.fromTo('.footer__social-link',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(2)', delay: 0.28 }
      );
    }
  });

  /* ---------- TESTIMONIAL GRID (full-page grid, not homepage track) ---------- */
  gsap.utils.toArray('.testimonials__grid .testimonial-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, rotationX: 12, transformPerspective: 900, transformOrigin: 'center bottom' },
      {
        opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        delay: i * 0.09
      }
    );
  });

  /* ---------- GOOGLE BADGE SPRING ---------- */
  const gBadge = document.querySelector('.google-badge');
  if (gBadge) {
    gsap.fromTo(gBadge,
      { opacity: 0, scale: 0.82, y: 28 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'back.out(2)',
        scrollTrigger: { trigger: gBadge, start: 'top 85%', once: true }
      }
    );
  }

  /* ---------- TIMELINE ITEMS ---------- */
  gsap.utils.toArray('.timeline__item').forEach(item => {
    const dot  = item.querySelector('.timeline__dot');
    const cont = item.querySelector('.timeline__content');
    if (dot) {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.5)',
          scrollTrigger: { trigger: item, start: 'top 87%', once: true }
        }
      );
    }
    if (cont) {
      gsap.fromTo(cont,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.18,
          scrollTrigger: { trigger: item, start: 'top 87%', once: true }
        }
      );
    }
  });

  /* ---------- FEATURE LIST STAGGER ---------- */
  document.querySelectorAll('.features-list').forEach(list => {
    gsap.fromTo(list.querySelectorAll('li'),
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0, duration: 0.42, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: list, start: 'top 88%', once: true }
      }
    );
  });

  /* ---------- BEFORE/AFTER SLIDER INTRO DEMO ---------- */
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    if (!before || !handle) return;
    ScrollTrigger.create({
      trigger: slider, start: 'top 78%', once: true,
      onEnter: () => {
        const state = { pct: 50 };
        gsap.timeline({ delay: 0.6 })
          .to(state, { pct: 22, duration: 0.9, ease: 'power2.inOut',
            onUpdate: () => {
              before.style.width = state.pct + '%';
              handle.style.left  = state.pct + '%';
            }
          })
          .to(state, { pct: 50, duration: 0.8, ease: 'power2.inOut', delay: 0.3,
            onUpdate: () => {
              before.style.width = state.pct + '%';
              handle.style.left  = state.pct + '%';
            }
          });
      }
    });
  });

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  initTestimonialsCarousel();
}

/* ============================================================
   TESTIMONIALS CAROUSEL (drag to scroll)
   ============================================================ */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials__track');
  if (!track) return;

  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mouseup', () => { isDown = false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

/* ============================================================
   3D CARD TILT
   ============================================================ */
(function () {
  function initTilt(card) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const rotX = -(y / r.height) * 8;
      const rotY =  (x / r.width)  * 8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  document.querySelectorAll('.tilt-card, .wood-card, .value-block, .team-card').forEach(initTilt);
})();

/* ============================================================
   BEFORE / AFTER SLIDERS
   ============================================================ */
(function () {
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = Math.max(0.02, Math.min(0.98, (clientX - rect.left) / rect.width));
      before.style.width = pct * 100 + '%';
      handle.style.left  = pct * 100 + '%';
    }

    slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    slider.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', e => { if (dragging) { e.preventDefault(); setPosition(e.touches[0].clientX); } }, { passive: false });
    slider.addEventListener('touchend', () => { dragging = false; });

    if (handle) {
      handle.setAttribute('tabindex', '0');
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-valuenow', '50');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.addEventListener('keydown', e => {
        const rect = slider.getBoundingClientRect();
        const cur  = (parseFloat(before.style.width || '50') / 100) * rect.width;
        let delta  = 0;
        if (e.key === 'ArrowLeft')  delta = -rect.width * 0.05;
        if (e.key === 'ArrowRight') delta = +rect.width * 0.05;
        if (delta) { e.preventDefault(); setPosition(rect.left + cur + delta); }
      });
    }
  });
})();

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
(function () {
  const filters = document.querySelectorAll('.portfolio__filter');
  const cards   = document.querySelectorAll('.project-card');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filters.forEach(b => { b.classList.remove('portfolio__filter--active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('portfolio__filter--active');
      btn.setAttribute('aria-selected', 'true');

      let visIdx = 0;
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.split(' ').includes(filter);
        if (show) {
          card.classList.remove('hidden');
          gsap.fromTo(card,
            { opacity: 0, scale: 0.91, y: 24 },
            { opacity: 1, scale: 1, y: 0, duration: 0.55, delay: visIdx * 0.07, ease: 'back.out(1.7)', clearProps: 'transform' }
          );
          visIdx++;
        } else {
          gsap.to(card, {
            opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in',
            onComplete: () => card.classList.add('hidden')
          });
        }
      });
    });
  });
})();

/* ============================================================
   TEXT SCRAMBLE ON NAV LINK HOVER
   ============================================================ */
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function scramble(el) {
    /* Target only the direct text node to preserve SVG child (caret icon) */
    const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
    if (!textNode) return;
    const original = el.dataset.original || textNode.textContent.trim();
    if (!el.dataset.original) el.dataset.original = original;
    let frame = 0;
    const total = 10;
    if (el.__scramble) clearInterval(el.__scramble);
    el.__scramble = setInterval(() => {
      textNode.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < Math.floor(frame / total * original.length)) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame > total) {
        clearInterval(el.__scramble);
        textNode.textContent = original;
      }
    }, 32);
  }

  document.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => scramble(link));
  });
})();

/* ============================================================
   IMAGE HOVER PARALLAX (project cards + service details)
   ============================================================ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card, .service-detail__image, .about__image-wrapper, .team-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      gsap.to(img, { x: x * 14, y: y * 9, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(img, { x: 0, y: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
    });
  });
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
(function () {
  const form    = document.getElementById('contact-form');
  const submit  = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(`${id}-error`);
    const inp = document.getElementById(id);
    if (el)  el.textContent = msg;
    if (inp) inp.classList.toggle('error', !!msg);
  }

  function validate() {
    let valid = true;
    const nome = document.getElementById('nome')?.value.trim();
    if (!nome) { showError('nome', 'Il nome è obbligatorio.'); valid = false; } else showError('nome', '');

    const email = document.getElementById('email')?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Email non valida.'); valid = false; } else showError('email', '');

    const tel = document.getElementById('telefono')?.value.trim();
    if (!tel) { showError('telefono', 'Il telefono è obbligatorio.'); valid = false; } else showError('telefono', '');

    const priv = document.getElementById('privacy')?.checked;
    const privErr = document.getElementById('privacy-error');
    if (!priv) { if (privErr) privErr.textContent = 'Devi accettare la Privacy Policy.'; valid = false; }
    else        { if (privErr) privErr.textContent = ''; }

    return valid;
  }

  ['nome','email','telefono'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) { form.querySelector('.error')?.focus(); return; }
    const btnText = submit.querySelector('.btn__text');
    const btnLoad = submit.querySelector('.btn__loading');
    submit.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoad) btnLoad.hidden = false;
    await new Promise(r => setTimeout(r, 1200));
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
(function () {
  const curtain = document.getElementById('page-curtain');
  if (!curtain) return;

  /* If we arrived via a page transition, drop from scaleY(1) and reveal */
  if (sessionStorage.getItem('__pr_trans')) {
    sessionStorage.removeItem('__pr_trans');
    gsap.set(curtain, { scaleY: 1 });
    gsap.to(curtain, {
      scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'power4.inOut', delay: 0.05
    });
  }

  /* On same-origin link click: drop curtain then navigate */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    const isSameSite = !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')
      && !href.startsWith('tel:') && !href.startsWith('mailto:') && a.target !== '_blank';
    if (!isSameSite) return;
    e.preventDefault();
    sessionStorage.setItem('__pr_trans', '1');
    gsap.to(curtain, {
      scaleY: 1, transformOrigin: 'bottom', duration: 0.55, ease: 'power4.inOut',
      onComplete: () => { window.location.href = href; }
    });
  });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    window.scrollTo({ top: target.offsetTop - headerH, behavior: 'smooth' });
  });
});
