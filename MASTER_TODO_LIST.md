# ParquetRoma — Master Todo List

> **Contesto**: Il sito è un'applicazione Astro 5 + Tailwind 4 + GSAP 3.12.5 con ViewTransitions.
> La build viene da `parquetroma/` → `parquetroma/dist/` (22 pagine).
> I file statici nella root (`index.html`, `css/`, `js/`) sono il prototipo originale — le modifiche vanno applicate alla versione **Astro**.

---

## Legenda Stato
`🔴 BLOCCANTE` · `🟠 CRITICO` · `🟡 MIGLIORIA` · `🟢 DONE`

---

## BUG BLOCCANTI — STEP 1

| # | Task | File/Scope | Priorità | Stato |
|---|------|-----------|----------|-------|
| B1 | Fix loader bloccato su navigazione ViewTransitions | `Loader.astro`, `PageLayout.astro` | 🔴 | 🟢 DONE — commit a684f77 |
| B2 | Fix sparizione testo Hero dopo pochi secondi | `heroAnimations.ts`, `Hero.astro` | 🔴 | 🟢 DONE — commit 7fd29a5 |
| B3a | Fix 4a slide scroll orizzontale (testo invisibile) | `index.astro`, `horizontalScroll.ts` | 🔴 | 🟢 DONE — commit e65287e |
| B3b | Fix sezione marrone vuota dopo scroll orizzontale | `index.astro` | 🔴 | 🟢 DONE — commit e65287e |
| B3c | Fix content fade-in pannelli H-scroll (containerAnimation errato) | `horizontalScroll.ts` | 🔴 | 🟢 DONE — commit e65287e |
| B4 | Fix collasso step 2 e 3 sezione "Il Nostro Processo" | `home/processo`, CSS tokens | 🔴 | 🟢 DONE — commit 5973993 |

---

## PAGINE MANCANTI — STEP 1 (continuazione)

| # | Task | File/Scope | Priorità | Stato |
|---|------|-----------|----------|-------|
| B5a | Creare pagina Privacy Policy | `src/pages/privacy/index.astro` | 🟠 | 🟢 DONE |
| B5b | Creare pagina Cookie Policy | `src/pages/cookie/index.astro` | 🟠 | 🟢 DONE |
| B5c | Aggiornare Footer con link reali a PP e CP | `Footer.astro` | 🟠 | 🟢 DONE (già ok) |

---

## UI/UX — STEP 2 Blog

| # | Task | File/Scope | Priorità | Stato |
|---|------|-----------|----------|-------|
| U1 | Fix contrasto chip categoria Blog (testo quasi invisibile) | `tokens.css`, `global.css` | 🟠 | 🟢 DONE — commit adfaa3c |
| U2 | Fix altezza card articolo Blog (occupa più di 1 viewport) | `global.css` (utility .grid--N) | 🟠 | 🟢 DONE — commit adfaa3c |
| U3 | Aggiungere sezione "Articoli Recenti" in sidebar/featured | `blog/index.astro` | 🟡 | 🟢 DONE — commit cea18de |

---

## UI/UX — STEP 2 Pagine Quartieri e Nuove Pagine

| # | Task | File/Scope | Priorità | Stato |
|---|------|-----------|----------|-------|
| U4 | Fix spaziature eccessive sezioni pagine quartieri (Parioli, Trastevere, EUR) | `global.css` `.section` padding | 🟠 | 🟢 DONE |
| U5 | Fix layout grezzo pagine SEO (levigatura, restauro, architetti, essenze) | `global.css` — aggiunto `.feature-card`, `.service-detail`, `.features-list`, `.faq-accordion`, `.processo__list`, contact form | 🟠 | 🟢 DONE |
| U6 | Design system check: headings H1/H2/H3 consistenti con stile principale | Tutte le pagine nuove | 🟡 | 🟢 DONE — H1 solo da PageHero, H2 via `.section__title`/`.service-detail__title`, H3 su card |

---

## SEO / AI-READINESS — STEP 2

| # | Task | File/Scope | Priorità | Stato |
|---|------|-----------|----------|-------|
| S1 | Aggiungere `llms.txt` + `robots.txt` corretto in `public/` | `public/` | 🟡 | Da fare |
| S2 | Verificare BreadcrumbList schema su tutte le pagine nuove | `BaseLayout.astro` | 🟡 | Da fare |
| S3 | Aggiungere `og:image` reale (non picsum) su ogni pagina | `BaseLayout.astro`, dati pagine | 🟡 | Da fare |
| S4 | Audit `<h1>` unico per pagina — verificare doppione in PageHero + SEO title | Tutte le nuove pagine | 🟡 | Da fare |

---

## Note Generali
- Tutte le immagini `picsum.photos` → sostituire con foto reali del cliente (TODO cliente, non dev)
- Numeri telefono placeholder → aggiornare con numeri reali
- La versione Astro è la **fonte di verità** — non modificare i file statici root
