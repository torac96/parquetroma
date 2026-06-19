# SPEC_BLOG — Specifiche Dettagliate: Blog Page

> Riferimento principale: `parquetroma/src/pages/blog/index.astro`  
> Articoli: `parquetroma/src/pages/blog/*.astro`

---

## BUG U1 — Chip Categoria Quasi Invisibile (CRITICO 🟠)

### Sintomo
I "chip" delle categorie (Tutti / Prezzi & Preventivi / Guide & Consigli / Manutenzione / ecc.) sono bianchi con testo chiaro su sfondo chiaro. In light mode sono quasi invisibili; in dark mode la situazione è imprevedibile.

### Diagnosi Tecnica

Codice attuale in `blog/index.astro` riga 71:
```js
style={`padding:0.4rem 1rem;border-radius:99px;font-size:0.85rem;cursor:pointer;
  background:${i===0?'var(--color-accent)':'transparent'};
  color:${i===0?'#fff':'var(--color-text-secondary)'};
  border:1px solid ${i===0?'var(--color-accent)':'var(--color-border)'}`}
```

**Problemi specifici**:
1. **Chip inattivi** (`i > 0`): `background: transparent` + `color: var(--color-text-secondary)` + `border: 1px solid var(--color-border)`. In light mode `--color-text-secondary` è probabilmente un grigio mediochre su sfondo bianco/crema. Il contrasto potrebbe essere < 4.5:1 (WCAG AA). In dark mode il background è scuro ma il testo secondario potrebbe essere troppo chiaro.
2. **Chip attivo** (`i === 0`): `background: var(--color-accent)` + `color: #fff` — funziona, ma l'accent color è gold (`#C4922A`). White su gold = contrasto ~2.5:1, **insufficiente per WCAG AA** (minimo 4.5:1 per testo small).
3. **Stile inline** iniettato tramite template literal JS invece di classi CSS — impossibile da sovrascrivere con temi o responsive styles, nessuna transizione animata sul :hover state.

### Soluzione

**Creare una classe CSS dedicata** `.chip` invece di usare stili inline:

```css
/* In global.css o component style */
.chip {
    padding: 0.35rem 1rem;
    border-radius: 99px;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    border: 1.5px solid var(--color-border-ui);
    background: transparent;
    color: var(--color-text);          /* non text-secondary: contrasto pieno */
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
}
.chip:hover {
    border-color: var(--color-gold);
    color: var(--color-gold-dark);
    background: var(--color-gold-pale);
}
.chip--active {
    background: var(--color-gold-dark);   /* più scuro di #C4922A per contrasto */
    border-color: var(--color-gold-dark);
    color: var(--color-white);
    /* gold-dark (#9E7420 o simile): bianco su questo = ~5:1 contrasto ✅ */
}
```

**Aggiornare il JSX/template**:
```astro
{categories.map((cat, i) => (
    <button
        class={`chip ${i === 0 ? 'chip--active' : ''}`}
        data-category={cat}
        aria-pressed={i === 0}
    >{cat}</button>
))}
```
Usare `<button>` invece di `<span>` per accessibilità (keyboard navigable).

### File da Modificare
- `parquetroma/src/pages/blog/index.astro`
- `parquetroma/src/styles/global.css` (aggiungere classe `.chip`)

---

## BUG U2 — Card Articolo Occupa Più di 1 Viewport (CRITICO 🟠)

### Sintomo
Una singola card articolo nel blog è così grande (verticalmente) che l'utente deve scrollare un intero viewport solo per vedere la card per intero. La sezione blog richiede scroll eccessivo per esplorare i 3 articoli.

### Diagnosi Tecnica

La card articolo in `blog/index.astro` riga 78:
```html
<article style="background:...; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; ...">
    <a href="..." style="display:block; overflow:hidden; aspect-ratio:3/2">
        <img ...>
    </a>
    <!-- testo card -->
</article>
```

**Problemi**:
1. `aspect-ratio: 3/2` sull'immagine è corretto, ma la larghezza della card dipende dalla griglia. Con `grid--3` (3 colonne), ogni card è ~33vw. A 33vw, un aspect-ratio 3:2 = altezza ~22vw. Con padding interno e testo, la card supera i 50vh facilmente.
2. Il tag `<img>` dentro l'`<a>` non ha `height` specifico → rispetta `aspect-ratio` del parent (3/2) invece di essere limitato.
3. Il CSS della griglia `grid--3` non applica `max-height` alle card o alle immagini.
4. Con soli 3 articoli in `grid--3`, ogni card è molto larga → l'immagine diventa enorme.

**Effetto percepito**: Su un 1440px monitor, ogni card è ~440px wide. `aspect-ratio: 3/2` → immagine alta ~293px. Con testo (categoria + titolo + excerpt + date + readtime) → card totale ~500-600px. Su viewport 900px, la singola card copre >50% della viewport height.

### Soluzione

**A. Limitare l'altezza immagine**:
```css
.blog-card__image {
    aspect-ratio: 16/9;   /* meno alto di 3/2 */
    max-height: 200px;    /* tetto assoluto */
    overflow: hidden;
}
.blog-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

**B. Ridurre il padding verticale della sezione**:
```css
/* La sezione blog non ha bisogno degli stessi padding di hero sections */
.section--blog { padding-block: 4rem; } /* vs i tipici 6-8rem */
```

**C. Layout alternativo per 3 articoli**: Se ci sono solo 3 articoli, considerare un layout orizzontale:
- 1 articolo featured grande a sinistra (2/3 della larghezza)
- 2 articoli piccoli impilati a destra (1/3 della larghezza)
- Questo usa meglio lo spazio orizzontale e riduce la scrollabilità verticale

**D. Ridurre font-size del testo in card**:
Il `<h2>` del titolo articolo e l'excerpt non hanno font-size capping. Su card di grandi dimensioni, crescono troppo.

### File da Modificare
- `parquetroma/src/pages/blog/index.astro`
- `parquetroma/src/styles/global.css` (aggiungere regole card blog)

---

## MIGLIORIA U3 — Blog Hub: Featured Article e Navigazione (🟡)

### Task
- Aggiungere un articolo "featured" in evidenza prima della griglia (ocupa la full width, immagine + testo side by side)
- Rendere i chip categoria funzionanti via JS (filtro client-side)
- Aggiungere conteggio articoli per categoria `("3 articoli")`
- Newsletter CTA → verificare che il form abbia `action` reale o sia sostituito da un CTA telefono/WhatsApp più appropriato per un artigiano

### File da Modificare
- `parquetroma/src/pages/blog/index.astro`

---

## Pagine Articoli — Problemi Comuni

I tre articoli blog (`quanto-costa-posa-parquet-roma.astro`, `spina-di-pesce-o-dritto.astro`, `come-mantenere-parquet.astro`) condividono probabilmente lo stesso layout e devono essere verificati per:

| Check | Stato |
|-------|-------|
| `<h1>` unico per pagina | Da verificare |
| Breadcrumb schema corretto | Da verificare |
| `datePublished` in ISO 8601 nel JSON-LD | Da verificare |
| `author` schema: Person con nome artigiano | Da verificare |
| Tag `<time datetime="...">` per date | Da verificare |
| Tabelle prezzi: `<caption>` per accessibilità | Da verificare |
| Immagini con `alt` descrittivo (non picsum) | Da fare (cliente) |
| Stima lettura visibile `readTime` | Da verificare |
| Link interni a servizi correlati (posa, levigatura) | Da aggiungere |
| CTA di conversione (telefono/preventivo) al fondo | Da verificare |

---

## Note SEO per il Blog

- Ogni articolo deve avere schema `Article` con `@type: "HowTo"` o `"Article"` appropriato
- Il hub `/blog/` deve avere schema `Blog` con `blogPost` array
- I breadcrumb degli articoli devono essere: `Home > Blog > Titolo Articolo`
- Canonical URL deve essere assoluto (`https://www.parquetroma.it/blog/articolo/`)
- `og:image` deve essere la hero image dell'articolo (non picsum)
- Aggiungere `robots: index, follow` esplicito su tutte le pagine blog
- Considerare `hreflang` se in futuro si aggiunge versione in inglese
