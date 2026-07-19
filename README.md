# Valores nutricionales · Popeyes España

A browsable nutrition reference for the full Popeyes España menu: 105 products
across 13 categories, with calories, macros, salt and allergens for each one.

The source data lives in a single A3 PDF that is essentially unreadable on a
phone. This turns it into something you can search, sort and compare.

## What it does

- **Search** across product names, categories and descriptions (accent-insensitive).
- **Filter** by category.
- **Sort** by calories, protein, or protein per calorie.
- **Switch basis** between the actual portion and a per-100 g normalisation, so
  products of very different sizes can be compared honestly.
- **Per-product detail** with the full nutrition panel (portion, per 100 g, and
  % of EU reference intake), declared allergens, and the official photo.

## Data sources

| What | Source |
| --- | --- |
| Nutrition values | `sources/nutricional-ed02-marzo-2025.pdf` — Popeyes España, Información Nutricional Ed.02, March 2025 |
| Allergens | `sources/alergenos-ed02-junio-2023.pdf` — Popeyes España, Información de Alérgenos Ed.02, June 2023 |
| Photos & descriptions | Public product catalog behind popeyes.es |

Values are reproduced exactly as published, including a few evident errata in
the original sheet, which are documented on the `/metodo` page rather than
silently corrected.

Popeyes España does not publish full ingredient lists per product, so the
allergen declaration is the most granular composition data that exists. The
`/metodo` page is explicit about this.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Every page is
statically generated; there is no database and no runtime data fetching.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

The generated dataset lives in `src/data/menu.ts`.

## Disclaimer

Independent, non-commercial project. Not affiliated with, endorsed by, or
connected to Popeyes or Restaurant Brands International. Trademarks and imagery
belong to their respective owners. If a value matters to you medically, confirm
it in the restaurant.
