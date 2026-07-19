import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_ITEMS, getCategory, getItem, type Item } from "@/data/menu";
import {
  dataWarnings,
  fixed,
  imageUrl,
  int,
  per100,
  REFERENCE_INTAKE,
  riPercent,
  unitFor,
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

  const { kcal, proteinas, grasas } = item.nutrition;
  return {
    title: item.name,
    description: kcal
      ? `${item.name} (${item.category}): ${kcal} kcal, ${fixed(
          proteinas,
        )} g de proteína y ${fixed(grasas)} g de grasa por ración.`
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

  const n = item.nutrition;
  const unit = unitFor(item);
  const hasData = n.kcal !== null;
  const warnings = dataWarnings(n);
  const siblings =
    getCategory(item.categorySlug)?.items.filter((i) => i.id !== item.id) ?? [];

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-5 sm:px-8">
      <nav className="pt-10">
        <Link
          href={`/categoria/${item.categorySlug}`}
          className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-ink-faint transition-colors hover:text-ink"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" />
          </svg>
          {item.category}
        </Link>
      </nav>

      <div className="grid gap-10 pt-6 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface">
            <div className="bloom" />
            {item.image ? (
              <Image
                src={imageUrl(item.image, 1000)}
                alt={item.name}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-ink-faint">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[3rem]">
            {item.name}
          </h1>

          {item.description ? (
            <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-ink-soft">
              {item.description}
            </p>
          ) : null}

          {hasData ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat value={int(n.kcal)} unit="kcal" label="Energía" hero />
              <Stat value={fixed(n.proteinas)} unit="g" label="Proteína" />
              <Stat value={fixed(n.grasas)} unit="g" label="Grasas" />
              <Stat value={int(n.peso)} unit={unit} label="Ración" />
            </div>
          ) : null}

          <Ingredients item={item} />

          {hasData ? <NutritionTable item={item} unit={unit} /> : null}

          {warnings.length > 0 ? (
            <section className="mt-8 rounded-[var(--radius-card)] border border-flame/35 bg-flame/8 p-5">
              <h2 className="text-[0.95rem] font-bold text-flame">
                Ojo con estas cifras
              </h2>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
                La ficha oficial es inconsistente en esta fila:
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {warnings.map((w) => (
                  <li
                    key={w}
                    className="text-[0.88rem] leading-relaxed text-ink-soft"
                  >
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-faint">
                Se muestran los valores publicados, sin corregir.
              </p>
            </section>
          ) : null}

          {!hasData ? (
            <p className="mt-8 rounded-[var(--radius-card)] border border-line/70 bg-surface p-5 text-[0.9rem] leading-relaxed text-ink-soft">
              Popeyes no publica valores nutricionales para este producto en la
              ficha Ed.02 de marzo de 2025.
            </p>
          ) : null}
        </div>
      </div>

      {siblings.length > 0 ? (
        <section className="mt-24">
          <h2 className="text-[1.4rem] font-extrabold tracking-[-0.02em]">
            Más en {item.category}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {siblings.slice(0, 8).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/producto/${s.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line/70 bg-surface p-4 transition-all duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-flame/45 hover:bg-raised"
                >
                  <div className="relative mx-auto aspect-square w-full max-w-[7rem]">
                    <div className="bloom opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
                    {s.image ? (
                      <Image
                        src={imageUrl(s.image, 260)}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                  <p className="relative mt-3 text-[0.85rem] font-semibold leading-snug transition-colors group-hover:text-flame">
                    {s.name}
                  </p>
                  <p className="tnum mt-1 text-[0.78rem] text-ink-faint">
                    {s.nutrition.kcal === null
                      ? "—"
                      : `${int(s.nutrition.kcal)} kcal`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function Stat({
  value,
  unit,
  label,
  hero = false,
}: {
  value: string;
  unit: string;
  label: string;
  hero?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        hero ? "border-flame/40 bg-flame/8" : "border-line/70 bg-surface"
      }`}
    >
      <p
        className={`tnum text-[1.55rem] font-extrabold leading-none tracking-[-0.02em] ${
          hero ? "text-flame" : "text-ink"
        }`}
      >
        {value}
        <span className="ml-1 text-[0.78rem] font-semibold text-ink-faint">
          {unit}
        </span>
      </p>
      <p className="mt-2 text-[0.75rem] font-medium text-ink-faint">{label}</p>
    </div>
  );
}

function Ingredients({ item }: { item: Item }) {
  return (
    <section className="mt-10">
      <h2 className="text-[1.05rem] font-bold tracking-[-0.01em]">
        Ingredientes principales
      </h2>
      {item.ingredients.length === 0 ? (
        <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
          La ficha oficial no detalla la composición de este producto.
        </p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.ingredients.map((ingredient) => (
            <li
              key={ingredient}
              className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.85rem] text-ink-soft"
            >
              {ingredient}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 max-w-[54ch] text-[0.78rem] leading-relaxed text-ink-faint">
        Componentes principales según la descripción oficial del producto.
        Popeyes España no publica la declaración completa de ingredientes.
      </p>
    </section>
  );
}

const ROWS: {
  key: keyof Item["nutrition"];
  label: string;
  unit: string;
  sub?: boolean;
}[] = [
  { key: "kj", label: "Valor energético", unit: "kJ" },
  { key: "kcal", label: "Valor energético", unit: "kcal" },
  { key: "grasas", label: "Grasas", unit: "g" },
  { key: "saturadas", label: "de las cuales saturadas", unit: "g", sub: true },
  { key: "hidratos", label: "Hidratos de carbono", unit: "g" },
  { key: "azucares", label: "de los cuales azúcares", unit: "g", sub: true },
  { key: "fibra", label: "Fibra alimentaria", unit: "g" },
  { key: "proteinas", label: "Proteínas", unit: "g" },
  { key: "sal", label: "Sal", unit: "g" },
  { key: "sodio", label: "Sodio", unit: "mg" },
];

function NutritionTable({ item, unit }: { item: Item; unit: "g" | "ml" }) {
  const n = item.nutrition;

  return (
    <section className="mt-10">
      <h2 className="text-[1.05rem] font-bold tracking-[-0.01em]">
        Información nutricional
      </h2>

      <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface">
        <table className="w-full text-left">
          <caption className="sr-only">
            Valores nutricionales de {item.name}
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint"
              >
                Nutriente
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint"
              >
                Ración
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint"
              >
                100 {unit}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-[0.72rem] font-semibold uppercase tracking-wider text-ink-faint"
              >
                %IR
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const total = n[row.key];
              const hundred = per100(total, n.peso);
              const isCount =
                row.key === "kj" || row.key === "kcal" || row.key === "sodio";
              const ri =
                row.key in REFERENCE_INTAKE
                  ? riPercent(total, row.key as keyof typeof REFERENCE_INTAKE)
                  : null;

              return (
                <tr
                  key={`${row.key}-${row.unit}`}
                  className="border-b border-line/50 last:border-0"
                >
                  <th
                    scope="row"
                    className={`px-4 py-2.5 text-[0.88rem] font-normal ${
                      row.sub ? "pl-8 text-ink-faint" : "text-ink-soft"
                    }`}
                  >
                    {row.label}
                  </th>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-[0.88rem] font-semibold">
                    {isCount ? int(total) : fixed(total)}
                    <span className="ml-1 text-[0.75rem] font-normal text-ink-faint">
                      {row.unit}
                    </span>
                  </td>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-[0.88rem] text-ink-soft">
                    {isCount ? int(hundred) : fixed(hundred)}
                  </td>
                  <td className="tnum whitespace-nowrap px-4 py-2.5 text-right text-[0.88rem] text-ink-faint">
                    {ri === null ? "—" : `${Math.round(ri)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 max-w-[54ch] text-[0.78rem] leading-relaxed text-ink-faint">
        %IR: porcentaje de la ingesta de referencia de un adulto medio (
        {REFERENCE_INTAKE.kcal} kcal), según el Reglamento (UE) 1169/2011.
      </p>
    </section>
  );
}
