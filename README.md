# Valores nutricionales · Popeyes España

A browsable nutrition reference for the full Popeyes España menu: 105 products
across 13 categories, with calories, macros, salt and allergens for each one.

The source data lives in a single A3 PDF that is essentially unreadable on a
phone. This turns it into something you can search, sort and compare.

## Structure

Three levels, no filters:

```
/                      13 categories
/categoria/[slug]      products in that category
/producto/[id]         photo, main ingredients, full nutrition
```

Each product page shows the portion figures, the same values per 100 g, and the
% of EU reference intake, alongside the main ingredients and the official photo.

## Data sources

| What | Source |
| --- | --- |
| Nutrition values | `sources/nutricional-ed02-marzo-2025.pdf` — Popeyes España, Información Nutricional Ed.02, March 2025 |
| Photos & descriptions | Public product catalog behind popeyes.es |
| Main ingredients | Derived from each product's official description |

Values are reproduced exactly as published, including a few evident errata in
the original sheet, which are documented on the `/metodo` page rather than
silently corrected.

Popeyes España does not publish full ingredient declarations. The ingredient
lists here are the main components named in each product's official description,
completed with the base preparation of its family (batter, oil, spices) where
the description only names the visible toppings. The `/metodo` page is explicit
about this, and the one product whose composition is not stated anywhere
official is shown as such rather than guessed at.

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
