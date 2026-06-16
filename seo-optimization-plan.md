# Piano di Ottimizzazione SEO — ParquetRoma
**Data:** 15 Giugno 2026  
**Basato su:** Analisi competitor Arm Parquet + Orlandi Parquet  
**Effort totale stimato:** ~38 ore di sviluppo

---

## Executive Summary

Tre gap principali rispetto ai competitor:
1. **Zero pagine standalone** per servizi chiave (posa, levigatura, restauro) — Arm Parquet ne ha 14+
2. **Zero contenuto educativo** (blog, guide) — Orlandi lo fa, noi no
3. **Zero geo-targeting** su quartieri e essenze legno — nessun competitor presidia queste keyword

---

## Priorità P1 — Settimana 1–2 (impatto massimo, effort minimo)

| # | Task | File | Effort |
|---|------|------|--------|
| 1 | Fix title tag 3 pagine esistenti | `servizi/`, `chi-siamo/`, `contatti/` | 30 min |
| 2 | FAQPage schema in homepage e servizi | `index.astro`, `servizi/index.astro` | 1h |
| 3 | Creare `/posa-parquet-roma/` | Nuovo file | 3h |
| 4 | Creare `/preventivo-parquet-roma/` | Nuovo file | 2h |
| 5 | Creare `/parquettista-roma/` | Nuovo file | 2h |

---

## TASK 1 — Fix Title Tag Pagine Esistenti

### `src/pages/servizi/index.astro` (riga 12)
```
PRIMA:  title="Servizi Parquet Roma | Posa, Porte, Consulenza | ParquetRoma"
DOPO:   title="Posa Parquet Roma | Levigatura, Restauro, Consulenza | ParquetRoma"
        description="Posa parquet, levigatura, restauro e installazione porte a Roma. 20+ anni di esperienza artigianale. Sopralluogo gratuito entro 48 ore in tutta Roma e Lazio."
```

### `src/pages/chi-siamo/index.astro` (riga 12)
```
PRIMA:  title="Chi Siamo | ParquetRoma — 20+ Anni di Maestria Artigianale a Roma"
DOPO:   title="Parquettista Roma da 20+ Anni | La Nostra Storia | ParquetRoma"
        description="ParquetRoma: artigiani del parquet a Roma dal 2003. 500+ progetti realizzati, 127 recensioni 5 stelle. Scopri chi siamo e perché ci scelgono architetti e famiglie romane."
```

### `src/pages/contatti/index.astro` (riga 13)
```
PRIMA:  title="Contatti | Preventivo Gratuito Parquet Roma | ParquetRoma"
DOPO:   title="Preventivo Gratuito Parquet Roma | Sopralluogo 48h | ParquetRoma"
        description="Richiedi un preventivo gratuito per posa parquet a Roma. Sopralluogo entro 48 ore, risposta in 24 ore. Zero costi nascosti. Chiama o scrivi su WhatsApp."
```

---

## TASK 2 — FAQPage Schema

I dati FAQ esistono già in `src/data/faq.ts` ma non sono esposti come schema strutturato.

**Aggiunta in `src/pages/index.astro`** (dopo `websiteSchema`):

```typescript
import { faq } from '../data/faq';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
};
```

Poi nella prop `schema` di `PageLayout` passare `schema={[websiteSchema, faqSchema]}`.

---

## TASK 3 — `/posa-parquet-roma/`

**Percorso:** `src/pages/posa-parquet-roma/index.astro`

**Title:** `Posa Parquet Roma | Installazione Professionale | ParquetRoma`  
**Description:** `Posa parquet Roma professionale: quercia, noce, frassino, bambù. Pattern spina di pesce, diagonale, chevron. 20+ anni di esperienza. Sopralluogo gratuito. Chiama ora!`

**Schema aggiuntivo:** `Service` + `HowTo`

```typescript
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Posa Parquet Roma',
  provider: { '@id': 'https://www.parquetroma.it/#business' },
  areaServed: { '@type': 'City', name: 'Roma' },
  description: 'Installazione professionale di pavimenti in parquet a Roma.',
  serviceType: 'Posa Parquet',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      name: 'Posa parquet dal mq',
    },
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Come funziona la posa del parquet a Roma',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Sopralluogo gratuito', text: 'Veniamo da te entro 48 ore per valutare la superficie.' },
    { '@type': 'HowToStep', position: 2, name: 'Preventivo dettagliato', text: 'Preventivo trasparente senza sorprese, materiali inclusi.' },
    { '@type': 'HowToStep', position: 3, name: 'Posa professionale', text: 'Installiamo con precisione artigianale e rispetto dei tempi.' },
    { '@type': 'HowToStep', position: 4, name: 'Consegna garantita', text: 'Risultato garantito per iscritto con assistenza post-posa.' },
  ],
};
```

**Struttura sezioni:**
1. `PageHero` — `eyebrow="Servizio #1"` · `title="Posa Parquet Roma"` · CTA doppio
2. "Perché sceglierci" — 4 value prop con icone
3. Essenze disponibili — griglia 6 essenze (riusata da `servizi/index.astro`)
4. Pattern di posa — 5 pattern con descrizione
5. "Il Nostro Processo" — 4 step HowTo
6. FAQ specifica posa — accordion
7. `TrustBar` + `CtaBand`

**Internal link da aggiornare:**
- `servizi/index.astro` sezione `#parquet`: aggiungere link "Scopri tutto" → `/posa-parquet-roma/`
- `index.astro` ServiceCard parquet: linkare a `/posa-parquet-roma/`

---

## TASK 4 — `/preventivo-parquet-roma/`

**Percorso:** `src/pages/preventivo-parquet-roma/index.astro`

**Title:** `Preventivo Parquet Roma Gratuito | Sopralluogo in 48h | ParquetRoma`  
**Description:** `Preventivo parquet Roma gratuito e senza impegno. Sopralluogo entro 48 ore, stima costi trasparente. Parquet, levigatura, restauro e porte. Chiama o scrivi ora!`

**Struttura:**
1. Hero con focus "gratuito senza impegno"
2. "Cosa include il preventivo" — lista bullet
3. "Come funziona" — 3 step: richiesta → sopralluogo → preventivo
4. Form di contatto (identico a `contatti/index.astro`)
5. "Le nostre garanzie" — 4 card (sopralluogo €0, preventivo €0, risposta 24h, soddisfazione 100%)
6. `TrustBar` + `CtaBand`

---

## TASK 5 — `/parquettista-roma/`

**Percorso:** `src/pages/parquettista-roma/index.astro`

**Title:** `Parquettista Roma | Artigiano Parquet con 20+ Anni | ParquetRoma`  
**Description:** `Cerca un parquettista a Roma esperto? ParquetRoma: 20+ anni di mestiere artigianale, 500+ progetti, 127 recensioni 5 stelle. Sopralluogo gratuito. Chiama oggi.`

**Struttura:** Pagina editoriale/trust building
1. Hero: focus sull'artigiano ("Il Tuo Parquettista a Roma")
2. "Chi è un parquettista" — contenuto educativo
3. "20+ anni di mestiere" — storytelling con timeline da `chi-siamo/`
4. Certificazioni e garanzie
5. Tutti e 6 i testimonial
6. FAQ "Come scelgo un parquettista?"
7. `TrustBar` + `CtaBand`

---

## Priorità P2 — Settimana 3–4

| # | Task | File | Effort |
|---|------|------|--------|
| 6 | `/levigatura-parquet-roma/` | Nuovo | 2.5h |
| 7 | `/restauro-parquet-roma/` | Nuovo | 2.5h |
| 8 | `/architetti-interior-designer-roma/` ⭐ | Nuovo | 3h |
| 9 | `/parquet-quercia-roma/` | Nuovo | 2h |
| 10 | `/parquet-noce-roma/` | Nuovo | 2h |
| 11 | `/parquet-wenge-roma/` | Nuovo | 2h |

### TASK 6 — `/levigatura-parquet-roma/`

**Title:** `Levigatura Parquet Roma | Ripristino Professionale | ParquetRoma`  
**Description:** `Levigatura parquet Roma professionale: ripristiniamo il tuo parquet come nuovo senza sostituirlo. Macchine silenziose, nessuna polvere. Preventivo gratuito.`

**Struttura:**
1. Hero con before/after slider (riusare `baSlider.ts`)
2. "Quando è il momento di levigare" — checklist visiva
3. Processo di levigatura — HowTo schema 5 step
4. Tipi di finitura — 4 opzioni (verniciatura opaca/lucida, oliatura, ceratura)
5. FAQ levigatura
6. `TrustBar` + `CtaBand`

### TASK 7 — `/restauro-parquet-roma/`

**Title:** `Restauro Parquet Roma | Ripristino Parquet Storico | ParquetRoma`  
**Description:** `Restauro parquet Roma: recuperiamo pavimenti storici e d'epoca con tecniche tradizionali. Stuccatura, riparazione assi, cambio finitura. Preventivo gratuito.`

**Proof point:** Portfolio "Palazzo Storico Trastevere" + testimonial Anna R.

### TASK 8 — `/architetti-interior-designer-roma/` ⭐ Vantaggio unico

**Nessun competitor ha questa pagina.** Keyword target: `parquet architetti Roma`, `posa parquet cantieri Roma`, `parquettista per interior designer Roma`

**Title:** `Parquet per Architetti Roma | Partner Affidabile per Cantieri | ParquetRoma`  
**Description:** `Sei architetto o interior designer a Roma? ParquetRoma è il tuo partner per cantieri di lusso: posa parquet premium, rispetto dei tempi, documentazione tecnica. Scopri il servizio B2B.`

**Schema aggiuntivo:**
```typescript
const b2bServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Servizio Parquet per Architetti e Interior Designer Roma',
  provider: { '@id': 'https://www.parquetroma.it/#business' },
  audience: { '@type': 'Audience', audienceType: 'Architetti e Interior Designer' },
};
```

**Struttura:**
1. Hero B2B: `eyebrow="Servizio Professionale B2B"` — "Il tuo cantiere consegnato nei tempi. Sempre."
2. "Perché sceglierci per i cantieri" — 6 benefit: scadenze, doc tecnica, assicurazione, certificazioni, referenze, team dedicato
3. Processo B2B — sopralluogo tecnico → computo metrico → coordinamento DL → report fotografico
4. Testimonial "Studio Arch. Bianchi" (da `testimonials.ts`)
5. Portfolio selezione commerciale — EUR studio, Prati attico, Centro Storico studio legale
6. "Materiali certificati per il contract" — campionari, schede tecniche
7. Form dedicato B2B (campo aggiuntivo: "Nome studio/azienda")
8. `TrustBar` + `CtaBand`

### TASK 9–11 — Pagine Essenze Legno

**Pattern comune:**
- Title: `Parquet [Essenza] Roma | Installazione [Essenza] | ParquetRoma`
- Schema: `Product` con `offers`
- Struttura: hero campione, caratteristiche tecniche, varianti disponibili, pattern consigliati, portfolio filtrato, FAQ, CTA

| File | Title | Portfolio da citare |
|------|-------|---------------------|
| `parquet-quercia-roma/index.astro` | `Parquet Quercia Roma \| Installazione Quercia Europea \| ParquetRoma` | testaccio, prati-penthouse, eur-camera |
| `parquet-noce-roma/index.astro` | `Parquet Noce Roma \| Pavimenti in Noce Italiano \| ParquetRoma` | parioli (200mq noce), san-lorenzo |
| `parquet-wenge-roma/index.astro` | `Parquet Wengé Roma \| Pavimenti Africani di Lusso \| ParquetRoma` | centro-storico (studio legale) |

---

## Priorità P3 — Settimana 5–8

| # | Task | File | Effort |
|---|------|------|--------|
| 12 | `/parquet-parioli-roma/` | Nuovo | 2h |
| 13 | `/parquet-trastevere-roma/` | Nuovo | 2h |
| 14 | `/parquet-eur-roma/` | Nuovo | 2h |
| 15 | `/blog/index.astro` hub | Nuovo | 3h |
| 16 | 3 articoli blog iniziali | 3 nuovi file | 6h |
| 17 | Sitemap priority config | `astro.config.mjs` | 30 min |

### TASK 12–14 — Landing Page Quartieri

**Struttura comune:**
1. Hero geolocalizzato — citare anni di presenza nel quartiere
2. "La nostra storia in [quartiere]" — narrazione specifica
3. Progetti realizzati — ProjectCard filtrate per zona
4. Essenze più richieste nel quartiere (con spiegazione culturale/architettonica)
5. Testimonianze locali
6. Area di copertura — quartieri limitrofi
7. Schema `Service` con `areaServed: Place`

| File | Title | Portfolio | Testimonial | Differenziatore |
|------|-------|-----------|-------------|-----------------|
| `parquet-parioli-roma/` | `Parquet Parioli Roma \| Installazione Premium \| ParquetRoma` | parioli, prati-penthouse | Giulia M., Fabrizio C. | Lusso residenziale, ville |
| `parquet-trastevere-roma/` | `Parquet Trastevere Roma \| Restauro e Posa Storici \| ParquetRoma` | trastevere | Anna R. | Palazzi storici → link a restauro |
| `parquet-eur-roma/` | `Parquet EUR Roma \| Uffici e Residenze Premium \| ParquetRoma` | eur-studio, eur-camera | n/a | Mix residenziale/uffici → link B2B |

### TASK 15–16 — Blog

**Hub:** `src/pages/blog/index.astro`
**Title:** `Blog Parquet Roma | Guide, Consigli e Ispirazione | ParquetRoma`

**3 articoli iniziali:**

| Percorso | Title | Keyword target | Schema |
|----------|-------|----------------|--------|
| `blog/spina-di-pesce-o-dritto-guida-alla-scelta.astro` | `Spina di Pesce o Posa Dritta? Guida al Pattern \| ParquetRoma` | parquet spina di pesce guida | Article |
| `blog/quanto-costa-posa-parquet-roma.astro` | `Quanto Costa la Posa del Parquet a Roma? Prezzi 2026 \| ParquetRoma` | costo posa parquet Roma 2026 | Article |
| `blog/come-mantenere-parquet-guida-completa.astro` | `Come Mantenere il Parquet: Guida Completa \| ParquetRoma` | manutenzione parquet Roma | Article |

### TASK 17 — Sitemap Priority (`astro.config.mjs`)

```javascript
sitemap({
  changefreq: 'monthly',
  priority: 0.7,
  serialize(item) {
    if (item.url.includes('/posa-parquet-roma/')) return { ...item, priority: 0.9 };
    if (item.url.includes('/preventivo-parquet-roma/')) return { ...item, priority: 0.9 };
    if (item.url.endsWith('/parquetroma/')) return { ...item, priority: 1.0 };
    if (item.url.includes('/blog/')) return { ...item, priority: 0.6, changefreq: 'weekly' };
    return item;
  },
}),
```

---

## Internal Linking Map

| Pagina sorgente | Testo anchor | Destinazione |
|----------------|--------------|--------------|
| `index.astro` | "Scopri la posa professionale" | `/posa-parquet-roma/` |
| `servizi/index.astro` sezione #parquet | "Scopri tutto sulla posa" | `/posa-parquet-roma/` |
| `servizi/index.astro` sezione #levigatura | "Scopri tutto sulla levigatura" | `/levigatura-parquet-roma/` |
| `portfolio/index.astro` card Parioli | "Posa Parquet Parioli" | `/parquet-parioli-roma/` |
| `portfolio/index.astro` card Trastevere | "Posa Parquet Trastevere" | `/parquet-trastevere-roma/` |
| `/posa-parquet-roma/` | "Richiedi preventivo gratuito" | `/preventivo-parquet-roma/` |
| `/posa-parquet-roma/` sezione quercia | "Scopri il parquet quercia" | `/parquet-quercia-roma/` |
| `chi-siamo/index.astro` | "Lavoriamo per studi di architettura" | `/architetti-interior-designer-roma/` |
| Tutte le pagine servizio | "Richiedi preventivo" in footer section | `/preventivo-parquet-roma/` |

---

## Schema Markup: Gap e Azioni

| Schema | Stato attuale | Azione |
|--------|---------------|--------|
| `LocalBusiness` | ✅ Implementato | Nessuna |
| `AggregateRating` | ✅ Implementato | Nessuna |
| `BreadcrumbList` | ✅ Implementato | Nessuna |
| `WebSite` + `SearchAction` | ✅ Homepage | Nessuna |
| `FAQPage` | ❌ Dati in `faq.ts` ma no schema | **Task 2** — 10 righe |
| `Service` | ❌ Mancante | **Task 3,4,5,6,7,8** |
| `HowTo` | ❌ Mancante | **Task 3, 6** |
| `Article` | ❌ Mancante | **Task 16** |
| `Product` | ❌ Mancante | **Task 9,10,11** |
| `Review` individuale | ❌ Mancante | Opzionale `/testimonianze/` |

---

## Risultato Atteso

Con P1 + P2 implementati (~20h di lavoro):
- **+8–12 nuove keyword** in prima pagina Google entro 3 mesi
- **Copertura completa** delle keyword transazionali principali del settore
- **Vantaggio unico** su B2B e long-tail essenze (zero competitor)
- **Rich snippet** FAQPage e HowTo per aumento CTR organico stimato +15–25%
