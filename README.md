# Etymology Explorer

A **linguistic web app** that traces English words back to their **Proto-Indo-European (PIE)** roots and shows how the same root appears across languages and geography. Search any word to see its etymology chain, definitions, cognates, and an interactive globe where you can hover over countries to see the equivalent word there.

---

## Features

- **Word search**  
  Search any English word to trace its etymology. The app uses **Wiktionary** (wikitext etymology) and the **Free Dictionary API** for definitions, plus a built-in **PIE roots dataset** for well-known roots (e.g. *night*, *father*, *water*, *star*, *heart*).

- **Etymology chain**  
  A clear timeline from the oldest form (often PIE) through intermediate stages (e.g. Proto-Germanic, Old English, Middle English) to modern English. Each step shows language, approximate date, and form.

- **Word card**  
  Definition, phonetic, part of speech, and PIE root badge when available. You can expand/collapse the word details panel.

- **Language descent tree**  
  A tree view of Indo-European branches (Germanic, Italic, Hellenic, Indo-Iranian, Celtic, Slavic, Baltic, Armenian, Albanian). Click a family to highlight it on the globe and in the tree. Cognates and chain entries are highlighted so you can see which languages have a form of the word.

- **Interactive globe (geographic spread)**  
  - **Scalable**: Drag to rotate the globe; **scroll to zoom** in and out. The globe scales correctly so it stays usable at different zoom levels.  
  - **Country hover**: Hover over a **country** to see:
    - Country name  
    - Primary language for that country (when mapped)  
    - **Equivalent word** in that language when you have searched a word that has a cognate or chain entry for that language (e.g. hover Germany after searching “night” to see *Nacht*).  
  - If no word has been searched yet, the tooltip still shows the country and a hint to search a word to see equivalents.  
  - Migration arrows from PIE to each major branch, and clickable language-family nodes with labels and words when available.

- **Accurate data sources**  
  - **Wiktionary API** (no API key): English Wiktionary etymology wikitext, parsed for inheritance/derivation/borrowing templates.  
  - **Free Dictionary API** (no API key): Definitions and phonetics.  
  - **Static PIE dataset** (`pieRoots.json`): Curated PIE roots, chains, and cognates for many common words so the app works even when Wiktionary lacks a full etymology.  
  - **Country–language mapping**: A mapping from world map countries (Natural Earth / world-atlas TopoJSON) to language codes so the globe can show “equivalent word” per country on hover.

- **Ideas / extensions panel**  
  A modal with future feature ideas and extension concepts.

---

## Tools & tech used to build it

| Category        | Tool / resource |
|----------------|-----------------|
| **Framework**  | React 19 + Vite 8 |
| **Globe / maps** | D3.js (d3-geo, geoOrthographic projection), TopoJSON (topojson-client), [world-atlas](https://www.npmjs.com/package/world-atlas) countries-110m |
| **Data / APIs** | Wiktionary API (en.wiktionary.org), [Free Dictionary API](https://dictionaryapi.dev/) (no API key), local `pieRoots.json` and `countryToLang.js` |
| **Styling**     | CSS (custom theme, glassmorphism-style panels, tooltips) |
| **Fonts**       | Google Fonts (Inter, Playfair Display) |
| **Build / dev** | Vite, ESLint |

No API keys are required: both Wiktionary and the Free Dictionary API are used without authentication.

---

## Running the app

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. `http://localhost:5173`).

- **Build**: `npm run build`  
- **Preview production build**: `npm run preview`  
- **Lint**: `npm run lint`

---

## Suggested words to try

- **night** · **father** · **water** · **star** · **heart**  
- **solar** · **marine** · **three** · **mother** · **brother**

These have rich PIE roots and cognates so you can see the full chain, tree, and country hover (e.g. Germany → *Nacht*, France → *nuit*, Russia → *ночь*) on the globe.
