'use strict';
/* Shared header + footer injection for ParquetRoma */
(function () {
  const base = document.documentElement.dataset.base || '';
  function p(path) { return base + path; }

  const loc = window.location.pathname.split('/').pop() || 'index.html';
  function active(page) { return loc === page ? ' active' : ''; }

  const PHONE_DISPLAY = '06 1234 5678';
  const PHONE_HREF    = 'tel:+390612345678';
  const WA_HREF       = 'https://wa.me/390612345678';

  /* ---- HEADER ---- */
  const headerHTML = `
<a href="#main-content" class="skip-link">Salta al contenuto</a>
<div id="scroll-progress" aria-hidden="true"></div>
<div id="page-curtain" aria-hidden="true"></div>
<div class="loader" id="loader" aria-hidden="true">
  <div class="loader__inner">
    <svg class="loader__logo-icon" width="48" height="48" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1" fill="#C4922A"/>
      <rect x="18" y="2" width="12" height="12" rx="1" fill="#9E7420"/>
      <rect x="2" y="18" width="12" height="12" rx="1" fill="#9E7420"/>
      <rect x="18" y="18" width="12" height="12" rx="1" fill="#C4922A"/>
    </svg>
    <div class="loader__bar"><div class="loader__progress"></div></div>
  </div>
</div>
<div class="cursor" id="cursor" aria-hidden="true"></div>
<div class="cursor-follower" id="cursor-follower" aria-hidden="true"></div>
<header class="header" id="header" role="banner">
  <div class="container header__inner">
    <a href="${p('index.html')}" class="header__logo" aria-label="ParquetRoma — Home">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="1" fill="#C4922A"/>
        <rect x="18" y="2" width="12" height="12" rx="1" fill="#9E7420"/>
        <rect x="2" y="18" width="12" height="12" rx="1" fill="#9E7420"/>
        <rect x="18" y="18" width="12" height="12" rx="1" fill="#C4922A"/>
      </svg>
      <span class="header__logo-text">Parquet<strong>Roma</strong></span>
    </a>

    <nav class="header__nav" id="nav" role="navigation" aria-label="Navigazione principale">
      <ul class="header__nav-list" role="list">
        <li><a href="${p('chi-siamo.html')}" class="header__nav-link${active('chi-siamo.html')}">Chi Siamo</a></li>
        <li class="header__nav-item--has-drop">
          <a href="${p('servizi.html')}" class="header__nav-link${active('servizi.html')}">Servizi
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <ul class="header__nav-dropdown" role="list">
            <li><a href="${p('servizi.html')}#parquet">Posa Parquet</a></li>
            <li><a href="${p('servizi.html')}#porte">Installazione Porte</a></li>
            <li><a href="${p('servizi.html')}#consulenza">Consulenza &amp; Design</a></li>
          </ul>
        </li>
        <li><a href="${p('portfolio.html')}" class="header__nav-link${active('portfolio.html')}">Portfolio</a></li>
        <li><a href="${p('testimonianze.html')}" class="header__nav-link${active('testimonianze.html')}">Testimonianze</a></li>
        <li><a href="${p('contatti.html')}" class="header__nav-link${active('contatti.html')}">Contatti</a></li>
      </ul>
    </nav>

    <div class="header__cta">
      <a href="${PHONE_HREF}" class="btn btn--phone" aria-label="Chiama ${PHONE_DISPLAY}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.1 11.9 19.79 19.79 0 01.07 3.28 2 2 0 012.03 1H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        <span>${PHONE_DISPLAY}</span>
      </a>
      <button class="header__burger" id="burger" aria-label="Apri menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;

  /* ---- FOOTER ---- */
  const footerHTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <a href="${p('index.html')}" class="header__logo" aria-label="ParquetRoma">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="#C4922A"/>
            <rect x="18" y="2" width="12" height="12" rx="1" fill="#9E7420"/>
            <rect x="2" y="18" width="12" height="12" rx="1" fill="#9E7420"/>
            <rect x="18" y="18" width="12" height="12" rx="1" fill="#C4922A"/>
          </svg>
          <span class="header__logo-text" style="color:#fff">Parquet<strong>Roma</strong></span>
        </a>
        <p class="footer__tagline">20+ anni di maestria artigianale nel parquet e nell'installazione di porte a Roma e nel Lazio.</p>
        <div class="footer__social">
          <a href="#" class="footer__social-link" aria-label="Facebook" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="Instagram" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="${WA_HREF}" class="footer__social-link" aria-label="WhatsApp" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h3 class="footer__col-title">Servizi</h3>
        <ul class="footer__links" role="list">
          <li><a class="footer__link" href="${p('servizi.html')}#parquet">Posa Parquet</a></li>
          <li><a class="footer__link" href="${p('servizi.html')}#porte">Installazione Porte</a></li>
          <li><a class="footer__link" href="${p('servizi.html')}#consulenza">Consulenza Design</a></li>
          <li><a class="footer__link" href="${p('servizi.html')}#levigatura">Levigatura &amp; Finitura</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h3 class="footer__col-title">Azienda</h3>
        <ul class="footer__links" role="list">
          <li><a class="footer__link" href="${p('chi-siamo.html')}">Chi Siamo</a></li>
          <li><a class="footer__link" href="${p('portfolio.html')}">Portfolio</a></li>
          <li><a class="footer__link" href="${p('testimonianze.html')}">Testimonianze</a></li>
          <li><a class="footer__link" href="${p('contatti.html')}">Contatti</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h3 class="footer__col-title">Contatti</h3>
        <ul class="footer__links" role="list">
          <li><a class="footer__link" href="${PHONE_HREF}">${PHONE_DISPLAY}</a></li>
          <li><a class="footer__link" href="mailto:info@parquetroma.it">info@parquetroma.it</a></li>
          <li><span class="footer__link">Roma &amp; Lazio</span></li>
          <li><span class="footer__link">Lun–Ven 8:00–18:00 · Sab 9:00–13:00</span></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p class="footer__copy">&copy; <span id="footer-year"></span> ParquetRoma. Tutti i diritti riservati.</p>
      <div class="footer__legal">
        <a href="#" class="footer__legal-link">Privacy Policy</a>
        <a href="#" class="footer__legal-link">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>
<div class="sticky-cta" role="navigation" aria-label="Contatti rapidi">
  <a href="${PHONE_HREF}" class="sticky-cta__phone">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.1 11.9 19.79 19.79 0 01.07 3.28 2 2 0 012.03 1H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
    Chiama
  </a>
  <a href="${WA_HREF}" class="sticky-cta__wa" rel="noopener" target="_blank">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    WhatsApp
  </a>
  <a href="${p('contatti.html')}" class="sticky-cta__quote">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    Preventivo
  </a>
</div>`;

  /* ---- Inject ---- */
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  /* ---- Footer year ---- */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
