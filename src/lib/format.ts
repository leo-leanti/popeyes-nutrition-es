import type { Item, Nutrition } from "@/data/menu";

/** Spanish decimal formatting, matching the source sheet. */
export function num(value: number | null, decimals = 1): string {
  if (value === null || Number.isNaN(value)) return "—";
  const rounded = Math.abs(value) < 10 ? value : Math.round(value * 10) / 10;
  return rounded
    .toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
    .replace(/ /g, " ");
}

export function int(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return Math.round(value).toLocaleString("es-ES");
}

/** Fixed decimals, so figure columns line up on the comma. */
export function fixed(value: number | null, decimals = 1): string {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Scale a full-portion figure down to a per-100 g/ml basis. */
export function per100(value: number | null, peso: number | null): number | null {
  if (value === null || peso === null || peso === 0) return null;
  return (value / peso) * 100;
}

export function scaleNutrition(n: Nutrition, basis: Basis): Nutrition {
  if (basis === "total") return n;
  const scale = (v: number | null) => per100(v, n.peso);
  return {
    peso: n.peso === null ? null : 100,
    kj: scale(n.kj),
    kcal: scale(n.kcal),
    grasas: scale(n.grasas),
    saturadas: scale(n.saturadas),
    hidratos: scale(n.hidratos),
    azucares: scale(n.azucares),
    fibra: scale(n.fibra),
    proteinas: scale(n.proteinas),
    sal: scale(n.sal),
    sodio: scale(n.sodio),
  };
}

export type Basis = "total" | "100g";

/** Reference intakes for an average adult (8400 kJ / 2000 kcal), EU Reg. 1169/2011. */
export const REFERENCE_INTAKE = {
  kcal: 2000,
  grasas: 70,
  saturadas: 20,
  hidratos: 260,
  azucares: 90,
  proteinas: 50,
  sal: 6,
} as const;

export function riPercent(
  value: number | null,
  key: keyof typeof REFERENCE_INTAKE,
): number | null {
  if (value === null) return null;
  return (value / REFERENCE_INTAKE[key]) * 100;
}

/** Grams of protein per 100 kcal. Used for the "más proteína" sort. */
export function proteinDensity(item: Item): number {
  const { proteinas, kcal } = item.nutrition;
  if (proteinas === null || !kcal) return -1;
  return (proteinas / kcal) * 100;
}

export function unitFor(item: Item): "g" | "ml" {
  return item.category === "Bebidas" ? "ml" : "g";
}

/**
 * Sanity's CDN resizes on the fly, so ask it for exactly what we render.
 * The source shots are 3:2 with wide white margins; passing a height crops
 * to square around the subject so the food still reads at thumbnail size.
 */
export function imageUrl(url: string, width: number, height?: number): string {
  const params = new URLSearchParams({ w: String(width), auto: "format" });
  if (height !== undefined) {
    params.set("h", String(height));
    params.set("fit", "crop");
    params.set("crop", "center");
  } else {
    params.set("fit", "max");
  }
  return `${url}?${params.toString()}`;
}

/** Accent-insensitive text for search matching. */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Some catalog descriptions just restate the product name ("1 Pieza").
 * Those add nothing, so drop them.
 */
export function usefulDescription(
  description: string | null,
  name: string,
): string | null {
  if (!description) return null;
  const d = fold(description).replace(/[.\s]+$/, "").trim();
  const n = fold(name).trim();
  return d === n ? null : description;
}

/**
 * The published sheet contains a handful of internally impossible rows
 * (saturated fat above total fat, sugars above carbohydrates, kJ and kcal that
 * disagree). We reproduce the official figures rather than invent corrections,
 * so flag the affected rows instead of quietly passing them off as sound.
 */
export function dataWarnings(n: Nutrition): string[] {
  const w: string[] = [];

  if (n.grasas !== null && n.saturadas !== null && n.saturadas > n.grasas) {
    w.push(
      "Las grasas saturadas figuran por encima de las grasas totales, lo que no es posible.",
    );
  }

  if (n.hidratos !== null && n.azucares !== null && n.azucares > n.hidratos) {
    w.push(
      "Los azúcares figuran por encima de los hidratos de carbono, lo que no es posible.",
    );
  }

  if (n.kj !== null && n.kcal) {
    const ratio = n.kj / n.kcal;
    if (ratio < 3.9 || ratio > 4.5) {
      w.push(
        "Los kJ y las kcal no se corresponden entre sí (1 kcal equivale a 4,184 kJ).",
      );
    }
  }

  if (
    n.grasas !== null &&
    n.hidratos !== null &&
    n.proteinas !== null &&
    n.kcal
  ) {
    const derived = 9 * n.grasas + 4 * n.hidratos + 4 * n.proteinas;
    if (Math.abs(derived - n.kcal) / n.kcal > 0.35) {
      w.push(
        `Los macronutrientes suman unas ${Math.round(
          derived,
        )} kcal, lejos de las ${n.kcal} kcal declaradas.`,
      );
    }
  }

  return w;
}
