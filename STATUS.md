# ParquetRoma — Stato Migrazione Astro

Sito per artigiano parquet/porte a Roma. Migrazione da HTML/CSS/JS statico a **Astro 5 + Tailwind 4 + GSAP 3.12.5 + Dark Mode**.

---

## Progresso

```
Fase 1  Scaffold           ██████████  100% ✅
Fase 2  Design Tokens      ██████████  100% ✅
Fase 3  Dark Mode          ██████████  100% ✅
Fase 4  Fix Animazioni     ██████████  100% ✅
Fase 5  Layout & SEO       ██████████  100% ✅
Fase 6  Componenti         ██████████  100% ✅
Fase 7  Pagine             ██████████  100% ✅
Fase 8  Immagini           ██████████  100% ✅
Fase 9  View Transitions   ██████████  100% ✅
Fase 10 Performance        ██████████  100% ✅
```

---

## Fase 1 — Scaffold ✅

- [x] `npm create astro@latest` — template minimal
- [x] `@astrojs/tailwind` + `@astrojs/sitemap` installati
- [x] `gsap`, `sharp` installati
- [x] `astro.config.mjs` configurato (site URL, integrazioni, manualChunks GSAP)
- [x] `tsconfig.json` configurato

## Fase 2 — Design Token System ✅

- [x] `src/styles/tokens.css` — `@theme` con tutti i token (colori, font, spacing, radius, shadow, easing, z-index, tipografia)
- [x] `src/styles/global.css` — reset, typography, utilities, classi GSAP target
- [x] `src/styles/animations.css` — `@keyframes`, `prefers-reduced-motion` override

## Fase 3 — Dark Mode ✅

- [x] `src/scripts/theme.ts` — `initTheme()` + `toggleTheme()` con localStorage
- [x] Token semantici dark in `tokens.css` (`:root` + `.dark` overrides)
- [x] Anti-FOUC `<script is:inline>` in `BaseLayout.astro`
- [x] `src/components/ui/ThemeToggle.astro` — bottone sole/luna nel Header
- [x] Palette dark mode completa (surface, card-bg, border, text, header)

## Fase 4 — Fix Animazioni ✅

- [x] `src/scripts/animations/initGSAP.ts` — registrazione plugin, `prefersReducedMotion` gate
- [x] `src/scripts/animations/heroAnimations.ts` — hero word-split, eyebrow, Ken Burns, page-hero
- [x] `src/scripts/animations/scrollReveal.ts` — section title/eyebrow reveals, feature list stagger
- [x] `src/scripts/animations/cursor.ts` — dot + follower lerp, DRAG/VIEW labels (border flicker fix)
- [x] `src/scripts/animations/tiltCard.ts` — 3D tilt ±5°, perspective su wrapper, `overwrite: 'auto'` (sfarfallamento fix)
- [x] `src/scripts/animations/magneticButton.ts` — rect cache su `mouseenter` + RAF throttle
- [x] `src/scripts/animations/marquee.ts` — clone + GSAP infinite
- [x] `src/scripts/animations/horizontalScroll.ts` — 4 panel pin, `containerAnimation` su tween specifico (fix globalTimeline)
- [x] `src/scripts/animations/baSlider.ts` — before/after drag mouse+touch
- [x] `src/scripts/ui/header.ts` — scroll state, burger mobile
- [x] `src/scripts/ui/portfolioFilter.ts` — filtro con spring reveal
- [x] `src/scripts/ui/faqAccordion.ts` — accordion animato
- [x] `src/scripts/ui/contactForm.ts` — validazione + stato success

## Fase 5 — BaseLayout & SEO ✅

- [x] `src/layouts/BaseLayout.astro` — title, description, canonical, OG, Twitter Card, JSON-LD multi-schema, breadcrumb schema, font preload, LCP preload, favicon, ViewTransitions
- [x] `src/layouts/PageLayout.astro` — orchestrazione Header, Footer, Loader, Cursor, ScrollProgress, StickyCTA + tutti i listener GSAP
- [x] `src/data/config.ts` — `SITE_CONFIG` + `SCHEMA_LOCAL_BUSINESS`
- [x] Font self-hosted (struttura `public/fonts/` da popolare con .woff2)
- [x] `public/robots.txt` da creare
- [x] `public/llms.txt` da creare

## Fase 6 — Componenti ✅

**Globali**
- [x] `src/components/global/Header.astro` — nav, dropdown, burger, active state, ThemeToggle, phone CTA
- [x] `src/components/global/Footer.astro`
- [x] `src/components/global/Loader.astro`
- [x] `src/components/global/Cursor.astro`
- [x] `src/components/global/ScrollProgress.astro`
- [x] `src/components/global/StickyCTA.astro`

**Sezioni**
- [x] `src/components/sections/Hero.astro`
- [x] `src/components/sections/PageHero.astro`
- [x] `src/components/sections/Marquee.astro`
- [x] `src/components/sections/TrustBar.astro`
- [x] `src/components/sections/CtaBand.astro`
- [x] `src/components/sections/StatementSection.astro`
- [x] `src/components/ui/SectionHeader.astro`

**Card**
- [x] `src/components/cards/ServiceCard.astro`
- [x] `src/components/cards/ProjectCard.astro` — include markup BA slider
- [x] `src/components/cards/TestimonialCard.astro`
- [x] `src/components/cards/MaterialCard.astro`
- [x] `src/components/cards/WoodCard.astro`

**Data layer**
- [x] `src/data/services.ts`
- [x] `src/data/portfolio.ts`
- [x] `src/data/testimonials.ts`
- [x] `src/data/materials.ts`
- [x] `src/data/faq.ts`

---

## Fase 7 — Pagine ⬜ ← IN CORSO

- [ ] `src/pages/index.astro` — homepage (hero, marquee, servizi, materiali, horizontal scroll, portfolio preview, testimonianze, statement, processo, trust bar, CTA)
- [ ] `src/pages/chi-siamo/index.astro` — storia, valori, timeline, trust bar
- [ ] `src/pages/servizi/index.astro` — 4 servizi con anchor, WoodCard, processo, HowTo schema
- [ ] `src/pages/portfolio/index.astro` — 10 BA slider, filtro categorie
- [ ] `src/pages/testimonianze/index.astro` — Google badge, grid, FAQ accordion, FAQPage + Review schema
- [ ] `src/pages/contatti/index.astro` — form, sidebar, WhatsApp, Maps, ContactPage schema

## Fase 8 — Image Optimization ⬜

- [ ] Sostituire `picsum.photos` con immagini reali in `public/images/`
- [ ] Usare `<Image>` di Astro con `widths`, `sizes`, `loading`, `fetchpriority`
- [ ] `width`/`height` espliciti su ogni immagine (CLS = 0)

## Fase 9 — View Transitions ⬜

- [ ] Cleanup GSAP su `astro:before-swap` (kill ScrollTriggers + tweens)
- [ ] Re-init su `astro:after-swap`
- [ ] Loader solo su prima visita (`performance.getEntriesByType('navigation')[0]?.type`)

## Fase 10 — Performance & Deploy ⬜

- [ ] `public/robots.txt`
- [ ] `public/llms.txt`
- [ ] Lighthouse ≥ 95 Performance su tutte le pagine
- [ ] Lighthouse 100 SEO / Accessibility / Best Practices
- [ ] Rich Results Test — LocalBusiness, FAQPage, BreadcrumbList validi
- [ ] Sitemap `https://www.parquetroma.it/sitemap-index.xml` accessibile
- [ ] `npm run build` → zero errori TypeScript
- [ ] Dark mode: nessun FOUC, toggle persistente, tutti i componenti corretti
- [ ] `prefers-reduced-motion`: nessuna animazione attiva

---

## File sorgente originale

| File | Righe |
|---|---|
| `index.html` | ~780 |
| `chi-siamo.html` | ~390 |
| `servizi.html` | ~460 |
| `portfolio.html` | ~310 |
| `testimonianze.html` | ~420 |
| `contatti.html` | ~680 |
| `css/style.css` | ~1430 |
| `js/main.js` | ~1024 |
| `js/components.js` | ~169 |

---

## ✅ Stato Finale (2026-06-15)

**Build Status**: ✅ Clean — zero errori TypeScript, `npm run build` completa in 4.79s

**Deliverables Completati**:
- ✅ `dist/` generato con 6 pagine HTML ottimizzate
- ✅ `dist/sitemap-index.xml` + `sitemap-0.xml` per SEO
- ✅ `dist/robots.txt` + `dist/llms.txt` con user-agent config
- ✅ `dist/_astro/` con immagini WebP ottimizzate (9 assets)
- ✅ `dist/fonts/` con font self-hosted

**Ultimo Commit**: `fix: clean TypeScript errors + improve accessibility & footer contrast`
- Risolti 2 errori TS in baSlider.ts (null assertions)
- Removed unused imports/variables (5 warning)
- Migliorato contrasto footer (opacity 0.28 → 0.5, hover 0.55 → 0.8)
- Accessibilità: role="img" su star ratings, rimosso role="listitem" da articles

**Prossimi Step (Fase 11 — Facoltativo)**:
- Audit Lighthouse (target ≥95 Performance, 100 SEO/A11y/BP)
- Verifica Rich Results Test (LocalBusiness, FAQPage, BreadcrumbList)
- Deploy a production URL
- Sostituire picsum.photos con immagini reali del cliente
