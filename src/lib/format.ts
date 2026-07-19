import type { Item, Nutrition } from "@/data/menu";

/** Fixed decimals, so figures line up on the comma. */
export function fixed(value: number | null, decimals = 1): string {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function int(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return Math.round(value).toLocaleString("es-ES");
}

/** Scale a portion figure to a per-100 g/ml basis. */
export function per100(
  value: number | null,
  peso: number | null,
): number | null {
  if (value === null || peso === null || peso === 0) return null;
  return (value / peso) * 100;
}

/** Reference intakes for an average adult, EU Reg. 1169/2011. */
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

export function unitFor(item: Item): "g" | "ml" {
  return item.category === "Bebidas" ? "ml" : "g";
}

/**
 * Sanity's CDN resizes on the fly. The shots are transparent cut-outs, so keep
 * the alpha channel and never crop into the subject.
 */
export function imageUrl(url: string, width: number): string {
  return `${url}?w=${width}&fit=max&auto=format`;
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
