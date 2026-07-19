import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ALLERGENS,
  ALL_ITEMS,
  CATEGORIES,
  getItem,
  type AllergenKey,
  type Item,
} from "@/data/menu";
import {
  dataWarnings,
  fixed,
  imageUrl,
  int,
  REFERENCE_INTAKE,
  riPercent,
  scaleNutrition,
  unitFor,
  usefulDescription,
} from "@/lib/format";

export function generateStaticParams() {
  return ALL_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getItem(id);
  if (!item) return { title: "Producto no encontrado" };

  const kcal = item.nutrition.kcal;
  return {
    title: item.name,
    description: kcal
      ? `${item.name} (${item.category}): ${kcal} kcal, ${fixed(
          item.nutrition.proteinas,
        )} g de proteína, ${fixed(item.nutrition.grasas)} g de grasa.`
      : `${item.name}, en la carta de Popeyes España.`,
    openGraph: item.image
      ? { images: [{ url: imageUrl(item.image, 1200) }] }
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();

  const unit = unitFor(item);
  const total = item.nutrition;
  const hasData = total.kcal !== null;
  const description = usefulDescription(item.description, item.name);
  const warnings = dataWarnings(total);

  const siblings =
    CATEGORIES.find((c) => c.slug === item.categorySlug)?.items.filter(
      (i) => i.id !== item.id,
    ) ?? [];

  const declared = (Object.keys(ALLERGENS) as AllergenKey[]).filter(
    (k) => item.allergens[k],
  );

  return (
    <main id="contenido" className="mx-auto max-w-[78rem] px-5 py-8 sm:px-8">
      <Link
        href={`/#${item.categorySlug}`}
        className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-ink-soft transition-colors hover:text-flame-deep"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" />
        </svg>
        {item.category}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <div className="relative aspect-4/3 overflow-hidden bg-paper-deep">
            {item.image ? (
              <Image
                src={imageUrl(item.image, 1000)}
                alt={item.name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-ink-faint">
                Sin imagen
              </div>
            )}
          </div>

          <h1 className="mt-6 font-display text-[2rem] font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-[2.75rem]">
            {item.name}
          </h1>

          {description ? (
            <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
              {description}
            </p>
          ) : null}

          {hasData ? (
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-rule pt-6">
              <Headline label="Energía" value={int(total.kcal)} unit="kcal" />
              <Headline
                label="Proteína"
                value={fixed(total.proteinas)}
                unit="g"
              />
              <Headline label="Grasas" value={fixed(total.grasas)} unit="g" />
              <Headline
                label="Ración"
                value={int(total.peso)}
                unit={unit}
              />
            </div>
          ) : null}
        </div>

        <div>
          {hasData ? (
            <NutritionPanel item={item} unit={unit} />
          ) : (
            <p className="border border-rule-strong bg-surface p-6 text-sm leading-relaxed text-ink-soft">
              Popeyes no publica valores nutricionales para este producto en la
              ficha Ed.02 de marzo de 2025.
            </p>
          )}

          {warnings.length > 0 ? (
            <section className="mt-6 border border-ink bg-flame-wash p-4">
              <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-flame-deep">
                Ojo con estas cifras
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-ink">
                La ficha oficial es inconsistente en esta fila:
              </p>
              <ul className="mt-2 space-y-1.5">
                {warnings.map((w) => (
                  <li
                    key={w}
                    className="text-[0.85rem] leading-relaxed text-ink-soft"
                  >
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
                Se muestran los valores publicados, sin corregir. Tómalos como
                orientativos.
              </p>
            </section>
          ) : null}

          <section className="mt-10">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Alérgenos declarados
            </h2>
            {declared.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">
                Sin alérgenos declarados de los 14 de obligada mención.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {declared.map((key) => {
                  const level = item.allergens[key];
                  const contains = level === "contiene";
                  return (
                    <li
                      key={key}
                      className={`border px-3 py-1.5 text-[0.8rem] font-medium ${
                        contains
                          ? "border-flame-deep bg-flame-wash text-flame-deep"
                          : "border-rule-strong bg-surface text-ink-soft"
                      }`}
                    >
                      {ALLERGENS[key]}
                      {!contains ? (
                        <span className="ml-1.5 text-[0.7rem] text-ink-faint">
                          puede contener
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 max-w-[56ch] text-[0.78rem] leading-relaxed text-ink-faint">
              Según la carta de alérgenos Ed.02 de junio de 2023. Puede haber
              trazas por manipulación en cocina. Consulta siempre en el
              restaurante si tienes una alergia.
            </p>
          </section>

          {hasData ? (
            <p className="mt-8 border-t border-rule pt-4 text-[0.78rem] leading-relaxed text-ink-faint">
              Los porcentajes se refieren a la ingesta de referencia de un adulto
              medio ({REFERENCE_INTAKE.kcal} kcal / 8 400 kJ), según el
              Reglamento (UE) 1169/2011.
            </p>
          ) : null}
        </div>
      </div>

      {siblings.length > 0 ? (
        <section className="mt-20 border-t border-rule-strong pt-10">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
            Más en {item.category}
          </h2>
          <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <li key={s.id} className="border-b border-rule">
                <Link
                  href={`/producto/${s.id}`}
                  className="group flex items-center justify-between gap-4 py-2.5"
                >
                  <span className="truncate text-[0.9rem] text-ink-soft group-hover:text-flame-deep">
                    {s.name}
                  </span>
                  <span className="figure shrink-0 text-[0.8rem] text-ink-faint">
                    {s.nutrition.kcal === null
                      ? "—"
                      : `${int(s.nutrition.kcal)} kcal`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function Headline({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </p>
      <p className="figure mt-1 text-[1.75rem] font-semibold leading-none text-ink">
        {value}
        <span className="ml-1 text-[0.9rem] font-normal text-ink-soft">
          {unit}
        </span>
      </p>
    </div>
  );
}

const ROWS: {
  key: keyof typeof REFERENCE_INTAKE | "kj" | "fibra" | "sodio";
  label: string;
  unit: string;
  indent?: boolean;
  decimals?: number;
}[] = [
  { key: "kj", label: "Valor energético", unit: "kJ" },
  { key: "kcal", label: "Valor energético", unit: "kcal" },
  { key: "grasas", label: "Grasas", unit: "g" },
  { key: "saturadas", label: "de las cuales saturadas", unit: "g", indent: true },
  { key: "hidratos", label: "Hidratos de carbono", unit: "g" },
  { key: "azucares", label: "de los cuales azúcares", unit: "g", indent: true },
  { key: "fibra", label: "Fibra alimentaria", unit: "g" },
  { key: "proteinas", label: "Proteínas", unit: "g" },
  { key: "sal", label: "Sal", unit: "g" },
  { key: "sodio", label: "Sodio", unit: "mg" },
];

function NutritionPanel({ item, unit }: { item: Item; unit: "g" | "ml" }) {
  const total = item.nutrition;
  const hundred = scaleNutrition(total, "100g");

  return (
    <section>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        Información nutricional
      </h2>

      <table className="mt-3 w-full border-collapse border-2 border-ink bg-surface text-left">
        <caption className="sr-only">
          Valores nutricionales de {item.name}
        </caption>
        <thead>
          <tr className="border-b-2 border-ink">
            <th
              scope="col"
              className="px-2 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              Por ración
              {total.peso !== null ? (
                <span className="ml-1 font-normal text-ink-faint">
                  {int(total.peso)} {unit}
                </span>
              ) : null}
            </th>
            <th
              scope="col"
              className="px-2 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              Ración
            </th>
            <th
              scope="col"
              className="px-2 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              100 {unit}
            </th>
            <th
              scope="col"
              className="px-2 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              %IR
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const t = total[row.key];
            const h = hundred[row.key];
            const ri =
              row.key in REFERENCE_INTAKE
                ? riPercent(t, row.key as keyof typeof REFERENCE_INTAKE)
                : null;
            const d = row.decimals ?? 1;
            const isEnergy = row.key === "kcal" || row.key === "kj";
            const isCount =
              row.key === "kj" || row.key === "kcal" || row.key === "sodio";

            return (
              <tr key={`${row.key}-${row.unit}`} className="border-b border-rule">
                <th
                  scope="row"
                  className={`px-2 py-2 text-[0.85rem] font-normal text-ink ${
                    row.indent ? "pl-5 text-ink-soft" : ""
                  } ${isEnergy ? "font-medium" : ""}`}
                >
                  {row.label}
                </th>
                <td
                  className={`figure whitespace-nowrap px-2 py-2 text-right text-[0.85rem] ${
                    isEnergy ? "font-semibold text-ink" : "text-ink"
                  }`}
                >
                  {isCount ? int(t) : fixed(t, d)}
                  <span className="ml-1 text-ink-faint">{row.unit}</span>
                </td>
                <td className="figure whitespace-nowrap px-2 py-2 text-right text-[0.85rem] text-ink-soft">
                  {isCount ? int(h) : fixed(h, d)}
                </td>
                <td className="figure whitespace-nowrap px-2 py-2 text-right text-[0.85rem] text-ink-soft">
                  {ri === null ? "—" : `${Math.round(ri)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
