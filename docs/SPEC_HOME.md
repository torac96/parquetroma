# SPEC_HOME — Specifiche Dettagliate: Home Page

> Riferimento principale: `parquetroma/src/pages/index.astro`  
> Layout/animazioni: `PageLayout.astro`, `heroAnimations.ts`, `horizontalScroll.ts`, `scrollReveal.ts`

---

## BUG B1 — Loader Bloccato su Navigazione (BLOCCANTE 🔴)

### Sintomo
Quando l'utente clicca su un link e naviga tra le pagine del sito, appare una schermata bianca con icona di caricamento animata che non scompare mai. Per vedere la pagina di destinazione è necessario fare F5.

### Diagnosi Tecnica (Root Cause)
Il problema è una race condition tra il ciclo di vita di Astro ViewTransitions e il modo in cui `Loader.astro` si auto-distrugge.

**Flusso prima visita (funziona ✅)**:
1. Browser carica la pagina da zero → `window.load` si attiva
2. `Loader.astro` ha `window.addEventListener('load', hideLoader, { once: true })`
3. `hideLoader()` → loader scompare → dispatcha `loader:complete`
4. `PageLayout.astro` ascolta `loader:complete` → chiama `initAllAnimations()`

**Flusso navigazione ViewTransitions (rotto ❌)**:
1. `astro:before-swap` → il vecchio `#loader` viene nascosto (ok)
2. Astro fa lo swap dell'HTML → **il nuovo `<div id="loader">` è nel DOM con CSS `display: flex`** (visibile!)
3. Lo script `Loader.astro` del nuovo componente gira → registra `window.addEventListener('load', hideLoader)`
4. **`window.load` non sparerà mai di nuovo** (si attiva una sola volta nella vita della sessione browser)
5. Il nuovo loader resta bloccato a `display: flex`, coprendo l'intera pagina per sempre

**Evidenza nel codice**:
- `Loader.astro` righe 58: `window.addEventListener('load', hideLoader, { once: true })` — event handler che su ViewTransitions non si attiva mai
- `Loader.astro` righe 61-66: `astro:before-swap` nasconde il **vecchio** loader, non il nuovo che arriva dopo lo swap
- `PageLayout.astro` righe 81-91: L'handler `astro:before-swap` usa `import('gsap')` asincrono — al momento della risoluzione, il DOM potrebbe già aver swappato, rendendo il riferimento `loader` stale

### Soluzione

**1. In `Loader.astro`**: Aggiungere un handler `astro:after-swap` che nasconde immediatamente il nuovo loader:
```js
// DOPO lo swap, il nuovo loader è nel DOM ma window.load non sparerà
document.addEventListener('astro:after-swap', () => {
    const newLoader = document.getElementById('loader') as HTMLElement | null;
    if (newLoader) {
        newLoader.style.display = 'none';
        newLoader.style.opacity = '0';
    }
}, { once: true }); // 'once: true' evita accumulo di listener
```

**2. In `Loader.astro`**: Aggiungere fallback `readyState` nel caso `window.load` già sparato:
```js
if (document.readyState === 'complete') {
    hideLoader(); // Già caricato, nascondi subito
} else {
    window.addEventListener('load', hideLoader, { once: true });
}
```

**3. In `PageLayout.astro`**: `astro:after-swap` deve aspettare che il loader sia nascosto prima di chiamare `initAllAnimations()`. Coordinare con `loader:complete` event o chiamare `initAllAnimations()` direttamente dopo aver verificato che il loader non è visible.

**4. Rimuovere il codice duplicato**: `PageLayout.astro` righe 81-91 e `Loader.astro` righe 61-66 fanno la stessa cosa su `astro:before-swap`. Tenerlo solo in `Loader.astro`.

### File da Modificare
- `parquetroma/src/components/global/Loader.astro`
- `parquetroma/src/layouts/PageLayout.astro`

---

## BUG B2 — Testo Hero Scompare Dopo Pochi Secondi (BLOCCANTE 🔴)

### Sintomo
Nelle pagine interne (navigazione via link), il primo blocco di testo bianco nell'Hero (eyebrow, titolo) appare brevemente visibile e poi scompare per qualche secondo prima di riapparire con l'animazione.

### Diagnosi Tecnica (Root Cause)
**FOUC (Flash Of Unanimated Content)** causato dall'ordine di esecuzione su ViewTransitions.

**Flusso (rotto ❌)**:
1. `astro:after-swap` → nuovo HTML è nel DOM, hero text è visibile a schermo (opacità normale, no transform)
2. `initAllAnimations()` → `initHeroAnimations()` viene chiamata **immediatamente**
3. `heroAnimations.ts` riga 33-38: l'eyebrow viene riscritto con `opacity:0` su ogni `<span>` → **flash: il testo scompare**
4. `heroAnimations.ts` riga 57: i `.word` vengono animati da `translateY(115%)` → **flash: il titolo sparisce sotto**
5. GSAP timeline li riporta a visibility normale con animazione

**Evidenza nel codice**:
- `heroAnimations.ts` riga 34: `opacity:0;transform:translateY(10px)` impostati via innerHTML.replace → eseguiti su elemento già visibile
- `PageLayout.astro` riga 96: `initAllAnimations()` chiamata senza delay in `astro:after-swap`

### Soluzione

**Opzione A (raccomandata)**: Usare `gsap.set()` immediatamente al mount, PRIMA che `astro:after-swap` renda visibili i contenuti. Aggiungere in `PageLayout.astro` un handler `astro:before-swap` che pre-setta gli stati iniziali:

```js
document.addEventListener('astro:before-swap', (e) => {
    // Pre-set initial states on incoming page elements
    const newDoc = (e as any).newDocument;
    if (newDoc) {
        const eyebrow = newDoc.querySelector('.hero__eyebrow, .page-hero__eyebrow');
        // set opacity:0 inline prima che il DOM sia swappato
    }
});
```

**Opzione B (più semplice)**: Nascondere gli elementi animabili tramite CSS *prima* che lo script giri:
```css
/* In Hero.astro style */
.hero__eyebrow,
.hero__title .word,
.hero__subtitle,
.hero__actions,
.hero__badges .hero__badge {
    opacity: 0;
    transform: translateY(15px);
}
```
Poi GSAP anima da questo stato invece di impostarlo a runtime.

**Opzione C**: Aggiungere `transition:animate` di Astro sull'Hero per gestire l'entrata in modo dichiarativo.

### File da Modificare
- `parquetroma/src/scripts/animations/heroAnimations.ts`
- `parquetroma/src/components/sections/Hero.astro`
- `parquetroma/src/layouts/PageLayout.astro`

---

## BUG B3 — Scroll Orizzontale: 3 Anomalie (BLOCCANTE 🔴)

### Sintomo A: Quarta Slide Bianca
La slide 04/04 ("Il Tuo Risultato") ha sfondo `var(--cream)` ma il testo risulta invisibile (bianco su bianco o colore indefinito).

### Diagnosi (Slide Bianca)
Nel prototipo statico (`index.html` riga 325), Panel 4 usa:
- `background: var(--cream)` (crema chiaro) ✓
- `color: var(--border)` per il numero decorativo "04"
- `color: var(--text)` per il titolo (dovrebbe essere scuro)

Il problema nel build Astro: i CSS custom properties `--border` e `--text` potrebbero non risolvere nel contesto del pannello dark. Il Panel 4 non ha una classe esplicita (`section--light` o simile) che overrida il tema visivo delle sezioni precedenti (tutte dark). Se il layout Astro applica un `color: white` globale alla sezione `#hscroll` o al suo contenitore, `var(--text)` eredita white anche nel panel chiaro.

**Verificare**: `var(--color-text)` nel design token Astro — il valore nel dark mode è bianco. Se il Panel 4 non ha una override esplicita del colore testo, il tema dark potrebbe "inquinare" il panel chiaro.

### Diagnosi (Sezione Marrone Vuota)
Dopo che l'utente scolla oltre il pannello 4, compare una sezione marrone vuota. Questo è il `#hscroll` container stesso che, durante il pin di ScrollTrigger, lascia visibile il proprio background. La sezione `#hscroll` ha `height: 400vh` ma nessun `background` esplicito — eredita quello del body/parent. Se il body ha `background: var(--dark)` (marrone scuro), questa area viene esposta durante il pin.

**Evidenza**: `index.html` riga 259: `<section id="hscroll" style="height:400vh">` — nessun background

### Diagnosi (Content Fade-in non funziona)
In `horizontalScroll.ts` / `main.js` riga 423:
```js
containerAnimation: gsap.globalTimeline,
```
**Questo è sbagliato.** `containerAnimation` dovrebbe essere il tween che muove i pannelli (`gsap.to(hPanels, { xPercent: ... })`), non `gsap.globalTimeline`. Usando `globalTimeline`, ScrollTrigger non può agganciare i trigger al progresso dello scroll orizzontale. I contenuti dei panel 2, 3, 4 rimangono a `opacity:0` per sempre.

### Soluzioni

**Per la slide bianca**: 
```js
// Nel panel 4, forzare colori espliciti che non dipendano da CSS vars del tema
<div style="color:#2C1810;..."> // colore scuro esplicito, non var()
```
O aggiungere una classe `is-light-panel` al Panel 4 con override CSS specifico.

**Per la sezione marrone**:
```html
<!-- Aggiungere background esplicito al container #hscroll -->
<section id="hscroll" style="height:400vh;background:var(--color-surface)">
```

**Per il content fade-in (fix principale)**:
```js
// Salvare il tween principale dell'hscroll
const hScrollTween = gsap.to(hPanels, { xPercent: -100*(n-1), ease:'none',
    scrollTrigger: { trigger:hSection, pin:true, scrub:1, ... }
});

// Usare il tween corretto come containerAnimation
hPanels.forEach((panel, i) => {
    if (i === 0) return;
    const content = panel.querySelector('.h-panel__content');
    gsap.fromTo(content, { opacity:0, y:40 }, {
        opacity:1, y:0, duration:0.6,
        scrollTrigger: {
            trigger: panel,
            containerAnimation: hScrollTween, // ← tween corretto
            start: 'left 85%',
            end: 'left 40%',
            once: true,
        }
    });
});
```

### File da Modificare
- `parquetroma/src/scripts/animations/horizontalScroll.ts`
- `parquetroma/src/pages/index.astro` (sezione #hscroll, Panel 4 colors, bg on container)

---

## BUG B4 — Sezione "Il Nostro Processo": Step 2 e 3 Collassati (BLOCCANTE 🔴)

### Sintomo
Gli step 2 e 3 della sezione "Come Lavoriamo / Il Nostro Processo" appaiono con larghezza o altezza quasi zero. Solo il primo step è visibile correttamente.

### Diagnosi Tecnica

**Ipotesi A — CSS Overflow + Transform**: `gsap.fromTo(step, { opacity:0, x:-40 }, ...)` imposta `transform: translateX(-40px)` sugli step 2 e 3. Se il container `.processo__steps` ha `overflow: hidden` implicito (o il suo parent), gli step traslati in negativo sull'asse X vengono clippati e sembrano "collassati".

**Ipotesi B — `.processo__line-bar` (position:absolute)**:
La barra animata `.processo__line-bar` ha `position: absolute; inset: 0` all'interno del `<div style="position:relative">`. Se la sua `transform: scaleY(0)` viene interpretata in modo diverso in certe versioni del browser (Edge, Safari), può "comprimere" visualmente l'area dell'elemento fratello.

**Ipotesi C — `flex-shrink` mancante sull'icona**:
In CSS: `.processo__step-icon { flex-shrink: 0 }` è corretto, ma `.processo__step-content` non ha `flex: 1` o `min-width: 0`. In un flex container, se la content area non ha `min-width: 0`, può collassare quando i sibling hanno larghezze fisse. (Classico bug flexbox con text overflow).

**Ipotesi D — GSAP ScrollTrigger con `trigger: step`**: Se lo step 2 è fuori viewport al momento del setup (raro ma possibile con pannelli pinned scroll che modificano la geometria della pagina), il trigger potrebbe non attivarsi mai.

### Soluzione

**Fix CSS immediato** (elimina tutte le ipotesi B e C):
```css
.processo__step-content {
    flex: 1;
    min-width: 0;    /* Fix classico del flexbox collapse */
    min-height: 0;   /* Sicurezza aggiuntiva */
}
```

**Fix GSAP** (elimina ipotesi A):
- Rimuovere `x: -40` dall'animazione degli step, usare solo `opacity: 0 → 1` + `y: 30 → 0` (la traslazione X negativa è quella che causa il clipping)
- Oppure assicurarsi che `.processo__steps` o nessun antenato abbia `overflow: hidden`

**Verifica**: Aprire DevTools → Inspect su `.processo__step:nth-child(2)` e controllare computed `width`. Se è < 100px, è il collapse flexbox. Se è normale ma l'elemento è a X negativo, è il clipping.

### File da Modificare
- `parquetroma/src/styles/global.css` o il component che renderizza il processo
- `parquetroma/src/scripts/animations/scrollReveal.ts`

---

## Note Trasversali (Home)

### Scroll Progress Bar
Verificare che `#scroll-progress` sia agganciato correttamente dopo ViewTransitions re-init. `ScrollTrigger.refresh()` viene già chiamato in `astro:after-swap` ma con `requestAnimationFrame` — potrebbero esserci layout shift che invalidano i trigger.

### Animazioni Counter (Trust Bar)
I `data-count` counter animano su `once:true` ScrollTrigger. Dopo ViewTransitions, se i counter sono già nel viewport, il trigger non si riattiverà (è `once`). Valutare se resettare i counter o lasciarli statici.

### Magnetic Buttons
Dopo re-init, gli event listener magnetici vengono aggiunti di nuovo agli stessi elementi. Verificare che non si accumulino listener duplicati (mouse tracking multiplo → comportamento "frenetico" del bottone).
