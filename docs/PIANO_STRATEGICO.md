# Piano Strategico & Tecnico — ParquetRoma

> Sito tecnicamente completo (24 pagine, bug risolti, schema.org solido, GSAP premium).
> Obiettivo: trasformarlo in uno strumento che porta preventivi e lavori reali.

---

## LIVELLO 0 — Dati reali *(blocca tutto il resto)*

Prima di qualsiasi altra cosa — il sito è inutilizzabile con dati placeholder.

| Cosa | File | Stato |
|------|------|-------|
| Telefono reale | `src/data/config.ts` | `+39-06-1234-5678` → da sostituire |
| Email reale | `src/data/config.ts` | `info@parquetroma.it` → da confermare |
| Indirizzo reale | `src/data/config.ts` | `Via del Parquet, 12` → da sostituire |
| Social link reali | `src/data/config.ts` | facebook/instagram/google → da sostituire |
| Immagini vere | tutte le pagine | picsum.photos → fotografie reali del cliente |
| Google Maps embed | `contatti/index.astro` | embed con indirizzo reale |
| og:image reale | ogni pagina | placeholder → foto hero reale |

**Le fotografie sono la cosa più importante per la conversione di un artigiano. Senza foto vere, il sito non convince.**

---

## LIVELLO 1 — Form funzionante *(zero lead senza questo)*

Il form contatti valida ma **non invia nulla**. Soluzione consigliata:

### Opzione A — Netlify Forms (se si deploya su Netlify, gratis)
```astro
<form method="POST" netlify data-netlify="true" name="contatti">
  <input type="hidden" name="form-name" value="contatti" />
  <!-- campi esistenti invariati -->
</form>
```
Netlify intercetta, manda email al cliente, zero backend.

### Opzione B — Formspree
```html
<form action="https://formspree.io/f/XXXXX" method="POST">
```
Gratuito fino a 50 submission/mese.

**File da aggiornare:** `src/pages/contatti/index.astro` + `src/pages/preventivo-parquet-roma/index.astro`

---

## LIVELLO 2 — Deploy produzione *(senza dominio, zero indicizzazione)*

### Modifica `astro.config.mjs`
```js
// Ora (GitHub Pages):
site: 'https://torac96.github.io',
base: '/parquetroma',

// Produzione:
site: 'https://www.parquetroma.it',
// rimuovere "base" completamente
```

### Hosting consigliato
- **Netlify** — gratuito per siti statici, Forms inclusi, deploy da Git, HTTPS automatico
- **Vercel** — ottimo per Astro, CDN globale
- **cPanel** — se il cliente ha già hosting (upload manuale di `dist/`)

### Post-deploy obbligatorio
- Verificare redirect www ↔ non-www (consistente con canonical)
- HTTPS attivo
- Testare sitemap: `https://www.parquetroma.it/sitemap-index.xml`

---

## LIVELLO 3 — Google Business Profile *(la leva più potente per un artigiano locale)*

Per chi cerca "parquettista Roma", Google mostra **prima la mappa** (Local Pack), poi i siti. GBP è più immediato del SEO organico.

**Passi:**
1. Creare/rivendicare profilo su [business.google.com](https://business.google.com)
2. Compilare tutto: orari, servizi, area servita, descrizione
3. Collegare al sito parquetroma.it
4. Caricare foto reali (prima/dopo, cantieri, materiali, titolare)
5. Abilitare messaggi e richiesta preventivo da GBP
6. Rispondere a tutte le 127 recensioni esistenti
7. Chiedere attivamente nuove recensioni ai clienti soddisfatti

**Impatto atteso:** comparsa nel Local Pack (le 3 schede con mappa), traffico diretto da Google Maps, click-to-call da mobile.

---

## LIVELLO 4 — Analytics & tracking *(senza dati non si ottimizza)*

Attualmente: **zero analytics**.

### Setup consigliato

**A. Google Search Console** (priorità assoluta, gratuito)
- Registrare il dominio
- Inviare `sitemap-index.xml`
- Monitorare keyword, copertura, Core Web Vitals

**B. Google Analytics 4** (gratuito)
- Aggiungere snippet in `src/layouts/BaseLayout.astro` (nell'`<head>`)
- Tracciare: form submission, click telefono, click WhatsApp, conversioni

**C. Microsoft Clarity** (gratuito, complementare a GA4)
- Heatmap + session recording
- Capire dove gli utenti si bloccano nel form
- Non richiede cookie banner per funzionalità base

### Cookie banner (obbligatorio se si usa GA4)
- **Iubenda** o **CookieYes** — plugin italiani conformi GDPR
- In alternativa: GA4 in Consent Mode v2 (cookieless)

### Google Tag Manager (consigliato)
Gestisce tutti i tag da un'unica interfaccia senza toccare il codice:
- 1 snippet GTM in `BaseLayout.astro`
- Dal pannello GTM: GA4, Clarity, eventi, pixel futuri

### Eventi chiave da tracciare
- Click numero telefono → `phone_call`
- Click WhatsApp → `whatsapp_click`
- Form submission → `lead` (conversione principale)
- Scroll >75% pagina → `engaged_visit`

---

## LIVELLO 5 — SEO programmatica espansa *(più traffico organico)*

Il sito ha 3 pagine quartiere. Roma ha 22 quartieri principali. Ogni pagina = un ranking potenziale su "parquet [quartiere] Roma".

### Quartieri da aggiungere (priorità per popolazione/reddito)
**Zona 1** (alta priorità): Flaminio, Prati, Testaccio, Ostiense, Garbatella
**Zona 2**: Appio Latino, Cinecittà, Montesacro, Trieste, Balduina
**Zona 3**: Ostia, Casal Bertone, Torpignattara, Tor Vergata

Il pattern di ogni pagina è già definito in `SPEC_PAGES_GENERIC.md`. Si può usare AI (Claude) per generare il testo localizzato, inserirlo nel componente Astro. ~30 min/pagina.

### Blog: frequenza = traffico a lungo termine
Keyword gap suggerite:
- "quanto dura parquet" — guida durata e manutenzione
- "parquet in bagno Roma" — articolo specializzato
- "costo levigatura parquet Roma" — guida prezzi
- "differenza parquet massiccio prefinito multistrato" — confronto
- "parquet spina di pesce prezzi Roma" — articolo orientamento prezzi

Obiettivo minimo: **1 articolo/mese**. Usare AI per bozze in italiano, revisione manuale.

---

## LIVELLO 6 — Conversione avanzata *(future iterazioni)*

### WhatsApp Business
- Già presente il link. Passaggio successivo: profilo WhatsApp Business
- Messaggio automatico di risposta fuori orario
- Catalogo servizi nel profilo
- Chatbot semplice: "Vuoi un preventivo? Dimmi metratura e quartiere"

### Click-to-call mobile
Verificare che il numero in header e CTA sia `<a href="tel:+39...">` — critico per conversioni mobile.

### Calcolatore preventivo interattivo *(upgrade futuro)*
Nella pagina `preventivo-parquet-roma/`:
- Input: metratura (slider), tipo servizio, essenza
- Output: stima indicativa in tempo reale ("~€X.XXX – €Y.YYY")
- Effetto: qualifica il lead, aumenta engagement

### Google Ads *(se il cliente ha budget)*
- Local Services Ads per "posa parquet Roma" — appare sopra i risultati organici
- Avviare mentre il SEO matura (SEO organico richiede 3-6 mesi)
- Budget consigliato iniziale: €300-500/mese

---

## LIVELLO 7 — Verifica tecnica pre-lancio

### Schema.org
- [ ] Eseguire le 24 URL su **Google Rich Results Test** (search.google.com/test/rich-results)
- [ ] Verificare LocalBusiness con dati reali (non placeholder)

### Performance (Core Web Vitals)
- [ ] **LCP** < 2.5s → già predisposto con `fetchpriority="high"` ✅
- [ ] **CLS** < 0.1 → font preload già fatto ✅
- [ ] **INP** < 200ms → testare su mobile reale (GSAP è pesante)
- [ ] Lighthouse su pagine principali
- [ ] Testare su 3G simulato (Chrome DevTools)

### Mobile
- [ ] Form su iPhone e Android (testare submission reale)
- [ ] Click-to-call sul numero di telefono
- [ ] Slider portfolio su touch
- [ ] Sticky CTA visibile e funzionante
- [ ] Menu hamburger

### Accessibilità
- [ ] Navigazione completa da tastiera
- [ ] Skip link funzionante ✅
- [ ] `prefers-reduced-motion` rispettato ✅

### Contenuto
- [ ] Nessun testo "Lorem ipsum" o placeholder visibile
- [ ] Nessun link `href="#"` rimasto ✅ (privacy/cookie fixati)
- [ ] Tutte le immagini con `alt` descrittivi (non "image1.jpg")

---

## Roadmap priorità

| Priorità | Cosa | Impatto |
|----------|------|---------|
| 🔴 1 | Dati reali in `config.ts` | Blocca tutto |
| 🔴 2 | Fotografie vere del cliente | Blocca conversione |
| 🔴 3 | Form backend (Netlify Forms) | Zero lead senza |
| 🔴 4 | Deploy su parquetroma.it + aggiornare `astro.config.mjs` | Zero indicizzazione senza |
| 🟠 5 | Google Business Profile completo | Lavori reali, impatto immediato |
| 🟠 6 | Google Search Console + sitemap | Monitorare indicizzazione |
| 🟠 7 | GA4 + Microsoft Clarity | Capire il traffico |
| 🟡 8 | Rich Results Test su tutte le pagine | Verificare schema con dati reali |
| 🟡 9 | 5-10 nuove pagine quartiere | Espandere SEO locale |
| 🟡 10 | Blog 1 articolo/mese | Traffico a lungo termine |
| 🟢 11 | Calcolatore preventivo | Upgrade futuro |
| 🟢 12 | Google Ads | Se il cliente vuole accelerare |

---

## Note architettura

- `src/data/config.ts` è l'unico file con i dati aziendali — si propagano automaticamente su tutte le 24 pagine
- `src/layouts/BaseLayout.astro` è dove aggiungere GA4/GTM
- Schema.org è già solido — basta aggiornare i valori placeholder
- `astro.config.mjs`: solo `site` e rimozione `base` per andare in produzione
