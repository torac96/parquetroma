# SPEC_PAGES_GENERIC — Specifiche: Pagine Quartieri, SEO, e Legali

> Scope: Tutte le pagine create nei PR #1 e #2 (P2 + P3 SEO)  
> + Pagine legali mancanti (Privacy Policy, Cookie Policy)

---

## Mappa Pagine Interessate

| Pagina | URL | Tipo | PR |
|--------|-----|------|----|
| Levigatura Parquet Roma | `/levigatura-parquet-roma/` | Servizio esteso | P2 |
| Restauro Parquet Roma | `/restauro-parquet-roma/` | Servizio esteso | P2 |
| Architetti & Interior Designer | `/architetti-interior-designer-roma/` | B2B | P2 |
| Parquet Quercia Roma | `/parquet-quercia-roma/` | Essenza/Prodotto | P2 |
| Parquet Noce Roma | `/parquet-noce-roma/` | Essenza/Prodotto | P2 |
| Parquet Wengé Roma | `/parquet-wenge-roma/` | Essenza/Prodotto | P2 |
| Parquet Parioli Roma | `/parquet-parioli-roma/` | Quartiere | P3 |
| Parquet Trastevere Roma | `/parquet-trastevere-roma/` | Quartiere | P3 |
| Parquet EUR Roma | `/parquet-eur-roma/` | Quartiere | P3 |
| Blog Hub | `/blog/` | Blog | P3 |
| Blog: Costo Parquet | `/blog/quanto-costa-posa-parquet-roma/` | Articolo | P3 |
| Blog: Spina di Pesce | `/blog/spina-di-pesce-o-dritto.../` | Articolo | P3 |
| Blog: Manutenzione | `/blog/come-mantenere-parquet.../` | Articolo | P3 |
| **Privacy Policy** | `/privacy-policy/` | Legale | Mancante |
| **Cookie Policy** | `/cookie-policy/` | Legale | Mancante |

---

## BUG U4/U5 — Layout Grezzo e Spaziature Errate (CRITICO 🟠)

### Sintomo
Tutte le pagine create nelle PR SEO soffrono di spaziature eccessive, sezioni che occupano troppo viewport, e un aspetto visivo "grezzo" rispetto alle pagine principali del sito.

### Diagnosi Tecnica

**Causa principale**: Le pagine SEO sono state create in modo efficiente (velocità di implementazione) ma usando perlopiù **stili inline** (`style="..."`) invece delle classi del design system già disponibile in `global.css`.

**Problemi specifici ricorrenti**:

1. **Padding Section eccessivo**: Le sezioni nelle pagine nuove ereditano `.section { padding-block: 6rem }` (o simile dal design system). Non tutte le sezioni in queste pagine giustificano 6rem di respiro verticale. Una pagina quartiere con 8 sezioni × 6rem = 48rem di solo padding. Le pagine principali bilanciano questo con sezioni visivamente dense.

2. **Mancanza di Alternanza Cromatica**: Le pagine principali alternano `.section` (crema) e `.section--alt` (crema alternata, leggera differenza). Le nuove pagine usano perlopiù sfondi uniformi, creando un effetto monotono.

3. **Griglia a colonne non responsive**: Alcune sezioni usano `display:grid;grid-template-columns:1fr 1fr` inline senza breakpoint mobile → su mobile appaiono schiacciate.

4. **Font size non scaled**: Titoli con `font-size:clamp(3rem,6vw,5rem)` applicati localmente ma senza la classe `.section__title` del design system → mancano le animazioni di reveal + le proprietà tipografiche precise.

5. **Immagini senza `aspect-ratio`**: Alcune immagini mancano del contenitore con `aspect-ratio` esplicito → il layout shifta mentre l'immagine carica (CLS elevato).

6. **CTA inconsistenti**: Alcune pagine usano varianti `.btn` non standard (colori inline) invece delle varianti ufficiali `btn--primary`, `btn--secondary`, `btn--ghost`.

### Soluzione: Checklist di Refactoring per ogni Pagina

Per ogni pagina in scope, applicare il seguente checklist:

#### Struttura Sezione
```astro
<!-- ✅ CORRETTO — usa il design system -->
<section class="section section--alt" aria-labelledby="sez-id">
    <div class="container">
        <div class="section__header reveal-up">
            <p class="section__eyebrow">Label</p>
            <h2 class="section__title" id="sez-id">Titolo <em>Enfatizzato</em></h2>
            <p class="section__subtitle">Sottotitolo descrittivo.</p>
        </div>
        <!-- contenuto -->
    </div>
</section>

<!-- ❌ SBAGLIATO — stile inline, no classe section -->
<section style="padding:6rem 0;background:#f5f3ef">
    <div class="container">
        <h2 style="font-size:2rem">Titolo</h2>
```

#### Griglia Responsiva
```astro
<!-- ✅ USA classi globali -->
<div class="grid grid--2">   <!-- oppure grid--3, grid--4 -->
    ...
</div>

<!-- ✅ O usa stagger-grid per animazione automatica -->
<div class="grid grid--3 stagger-grid">
    ...
</div>
```

#### CTA Buttons
```astro
<!-- ✅ Varianti standard -->
<a href="..." class="btn btn--primary btn--lg">Preventivo Gratuito</a>
<a href="..." class="btn btn--secondary">Scopri di Più</a>
<a href="..." class="btn btn--ghost">Vedi Portfolio</a>

<!-- ❌ Non usare -->
<a href="..." style="background:#C4922A;color:white;padding:...">...</a>
```

---

## BUG B5 — Pagine Legali Mancanti (CRITICO 🟠)

### Sintomo
Footer attuale (`Footer.astro`) ha link "Privacy Policy" e "Cookie Policy" che puntano a `href="#"` — link morti. Non esiste nessuna delle due pagine. Questo è:
1. **Problema legale**: GDPR richiede PP e CP accessibili e linkate
2. **Problema UX**: I link morti danneggiano la fiducia dell'utente e Google li penalizza
3. **Problema SEO**: Google Search Console può segnalare errori 404 sui link del footer

### Soluzione B5a — Creare `privacy-policy.astro`

**Posizione**: `parquetroma/src/pages/privacy-policy/index.astro`

**Struttura pagina**:
```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import PageHero from '../../components/sections/PageHero.astro';
---
<PageLayout
    title="Privacy Policy | ParquetRoma"
    description="Informativa sulla privacy di ParquetRoma. Come trattiamo i tuoi dati personali in conformità al GDPR."
    noindex={true}
>
    <PageHero
        eyebrow="Informativa Legale"
        title="Privacy<br><em>Policy</em>"
        subtitle="Come proteggiamo i tuoi dati personali"
        image="..."
    />
    <section class="section">
        <div class="container" style="max-width:800px">
            <!-- Contenuto PP -->
        </div>
    </section>
</PageLayout>
```

**Contenuto minimo richiesto (GDPR Art. 13)**:
- Titolare del Trattamento: Nome/ragione sociale, indirizzo, email
- Tipologie di dati raccolti: (nome, email, telefono dal form contatti)
- Finalità del trattamento: Risposta a richieste, preventivi
- Base giuridica: Consenso (Art. 6.1.a GDPR)
- Conservazione dei dati: Specificare periodo
- Diritti dell'interessato: Accesso, rettifica, cancellazione, portabilità
- Eventuali trasferimenti a paesi terzi
- Cookie utilizzati (rimandare a Cookie Policy)

**Nota**: Il testo legale deve essere redatto dal cliente (o da un consulente legale). Il nostro compito è la struttura e il collegamento.

### Soluzione B5b — Creare `cookie-policy.astro`

**Posizione**: `parquetroma/src/pages/cookie-policy/index.astro`

**Struttura**: Identica alla PP ma con:
- Lista cookie tecnici (nessuno da sito statico + CDN GSAP)
- Lista cookie analytics (se si usa Google Analytics o simili)
- Cookie di terze parti (picsum.photos → rimuovere in prod, Google Maps embed)
- Istruzioni per disabilitare i cookie per browser
- Link a Google Analytics opt-out (se applicabile)

### Soluzione B5c — Aggiornare `Footer.astro`

**Posizione**: `parquetroma/src/components/global/Footer.astro`

**Modifica**:
```astro
<!-- ❌ ATTUALE -->
<a href="#" class="footer__legal-link">Privacy Policy</a>
<a href="#" class="footer__legal-link">Cookie Policy</a>

<!-- ✅ CORRETTO -->
<a href={url('/privacy-policy/')} class="footer__legal-link">Privacy Policy</a>
<a href={url('/cookie-policy/')} class="footer__legal-link">Cookie Policy</a>
```

### Cookie Banner (Opzionale ma Raccomandato)
Se il sito usa Google Analytics o altri tracker, serve un cookie banner conforme. Se il sito è puramente statico senza analytics, non è strettamente necessario ma è best practice. Valutare con il cliente.

---

## SEO Audit — Pagine Quartieri

### Check per ogni Pagina Quartiere (Parioli, Trastevere, EUR)

| Check | Parioli | Trastevere | EUR |
|-------|---------|------------|-----|
| `<h1>` unico e diverso dal `<title>` | ❓ | ❓ | ❓ |
| LocalService schema con `areaServed` corretto | ✅ | ❓ | ❓ |
| BreadcrumbList schema | ❓ | ❓ | ❓ |
| `canonical` assoluto | ❓ | ❓ | ❓ |
| Testo non duplicato (no copy-paste tra quartieri) | ❓ | ❓ | ❓ |
| Link interni a pagine servizi correlate | ❓ | ❓ | ❓ |
| Chip "quartieri vicini" linkati correttamente | ❓ | ❓ | ❓ |
| Form preventivo con `subject` pre-compilato | ❓ | ❓ | ❓ |

### Pattern Contenuto Consigliato per Pagine Quartiere
1. **PageHero**: "Parquet [Quartiere] Roma — dal 2003"
2. **Sezione locale**: 2-3 paragrafi specifici del quartiere (architettura tipica, tipo clienti, materiali più richiesti)
3. **Essenze consigliate**: 3 card con materiali tipici di quel quartiere
4. **Portfolio locale**: 2-3 progetti nel quartiere (o limitrofi)
5. **Testimonianze locali**: 1-2 recensioni di clienti del quartiere
6. **Mappa quartieri vicini**: chip con link a quartieri contigui
7. **TrustBar**: statistiche generali
8. **CTA Band**: preventivo gratuito

---

## SEO Audit — Pagine Essenze e Servizi Estesi

### Check per ogni Pagina Essenza (Quercia, Noce, Wengé)

| Check | Quercia | Noce | Wengé |
|-------|---------|------|-------|
| Product schema con `name`, `description`, `offers` | ❓ | ❓ | ❓ |
| Sezione "Domande Frequenti" con FAQPage schema | ❓ | ❓ | ❓ |
| Sezione confronto essenze (tabella) | ❓ | ❓ | ❓ |
| Link interni a pagine quartieri dove è popolare | ❓ | ❓ | ❓ |
| Specifiche tecniche: durezza Janka, classi di reazione | ❓ | ❓ | ❓ |

### Check per Servizi Estesi (Levigatura, Restauro, Architetti)

| Check | Levigatura | Restauro | Architetti |
|-------|------------|----------|------------|
| HowTo schema con steps | ❓ | ❓ | ✅ (diverso) |
| Prima/Dopo gallery | ❓ | ❓ | ❓ |
| Sezione prezzi con range | ❓ | ❓ | ❓ |
| Form con campo specifico (es. mq, tipo legno) | ❓ | ❓ | ✅ (ha campo studio) |
| Link a portfolio filtrato per tipo intervento | ❓ | ❓ | ❓ |

---

## Note Generali per Tutte le Nuove Pagine

### Regola Critica: Un Solo `<h1>` per Pagina
Il `PageHero.astro` genera un `<h1>` con il titolo. Le pagine NON devono avere un secondo `<h1>` nel body. Tutti i titoli successivi devono essere `<h2>`, `<h3>`, ecc. Verificare su tutte le pagine.

### Gerarchia Titoli Consigliata
```
<h1> — Titolo pagina nel PageHero (es. "Parquet Parioli Roma")
  <h2> — Sezione principale (es. "Essenze per i Parioli", "Il Nostro Processo")
    <h3> — Sottosezione o card title (es. "Noce Americano", "Sopralluogo Gratuito")
      <h4> — Se necessario, dettaglio tecnico
```

### `<meta name="robots">` sulle Pagine Legali
Le pagine Privacy Policy e Cookie Policy devono avere `noindex, nofollow` per non sprecare crawl budget su pagine senza valore SEO. Usare il prop `noindex={true}` nel `BaseLayout`.

### Sitemap Priority
Il file `astro.config.mjs` ha già una funzione `serialize()` per le priorità:
- Homepage: 1.0
- Servizi core (posa parquet, porte, consulenza): 0.9
- Pagine quartieri: 0.8
- Pagine essenze: 0.75
- Servizi estesi (levigatura, restauro): 0.75
- Blog hub: 0.6 (weekly)
- Articoli blog: 0.5
- Pagine legali: NON includere in sitemap (o 0.1 con `changefreq: 'yearly'`)

### AI-Readiness (ChatGPT Search, Perplexity)
Per massimizzare la visibilità nei motori AI:
1. **`llms.txt`**: Creare in `public/llms.txt` con descrizione del sito e permessi per AI crawlers
2. **Contenuto strutturato**: Preferire liste `<ul>/<ol>` e tabelle `<table>` a paragrafi lunghi — gli LLM le parsano meglio
3. **FAQ section**: Ogni pagina servizio/quartiere dovrebbe avere una sezione FAQ con domande reali (ottimizzate per intent search degli AI)
4. **Entità locali**: Menzionare esplicitamente rioni, piazze, strade iconiche nei testi — gli AI hanno una conoscenza geografica specifica e la usano per attribuire autorevolezza locale
