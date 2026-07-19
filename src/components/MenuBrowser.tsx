"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category, type Item } from "@/data/menu";
import {
  type Basis,
  dataWarnings,
  fixed,
  fold,
  imageUrl,
  int,
  proteinDensity,
  scaleNutrition,
  unitFor,
  usefulDescription,
} from "@/lib/format";

type Sort = "carta" | "kcal-asc" | "kcal-desc" | "proteina" | "densidad";

const SORTS: { value: Sort; label: string }[] = [
  { value: "carta", label: "Orden de carta" },
  { value: "kcal-asc", label: "Menos calorías" },
  { value: "kcal-desc", label: "Más calorías" },
  { value: "proteina", label: "Más proteína" },
  { value: "densidad", label: "Proteína por caloría" },
];

export default function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("carta");
  const [basis, setBasis] = useState<Basis>("total");

  const groups = useMemo(() => {
    const q = fold(query.trim());

    const matches = (item: Item) =>
      !q ||
      fold(item.name).includes(q) ||
      fold(item.category).includes(q) ||
      fold(item.description ?? "").includes(q);

    const sortItems = (items: Item[]) => {
      if (sort === "carta") return items;
      const copy = [...items];
      const kcal = (i: Item) =>
        basis === "total"
          ? i.nutrition.kcal
          : scaleNutrition(i.nutrition, basis).kcal;
      const prot = (i: Item) =>
        basis === "total"
          ? i.nutrition.proteinas
          : scaleNutrition(i.nutrition, basis).proteinas;

      copy.sort((a, b) => {
        switch (sort) {
          case "kcal-asc":
            return (kcal(a) ?? Infinity) - (kcal(b) ?? Infinity);
          case "kcal-desc":
            return (kcal(b) ?? -Infinity) - (kcal(a) ?? -Infinity);
          case "proteina":
            return (prot(b) ?? -Infinity) - (prot(a) ?? -Infinity);
          case "densidad":
            return proteinDensity(b) - proteinDensity(a);
          default:
            return 0;
        }
      });
      return copy;
    };

    return CATEGORIES.map((c) => ({
      ...c,
      items: sortItems(c.items.filter(matches)),
    })).filter(
      (c) => c.items.length > 0 && (active === null || c.slug === active),
    );
  }, [query, active, sort, basis]);

  const shown = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      <Controls
        query={query}
        setQuery={setQuery}
        active={active}
        setActive={setActive}
        sort={sort}
        setSort={setSort}
        basis={basis}
        setBasis={setBasis}
        shown={shown}
      />

      <div id="contenido" className="mx-auto max-w-[78rem] px-5 sm:px-8">
        {groups.length === 0 ? (
          <EmptyState
            query={query}
            onReset={() => {
              setQuery("");
              setActive(null);
            }}
          />
        ) : (
          <div className="divide-y divide-rule-strong">
            {groups.map((group) => (
              <CategorySection key={group.slug} group={group} basis={basis} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Controls({
  query,
  setQuery,
  active,
  setActive,
  sort,
  setSort,
  basis,
  setBasis,
  shown,
}: {
  query: string;
  setQuery: (v: string) => void;
  active: string | null;
  setActive: (v: string | null) => void;
  sort: Sort;
  setSort: (v: Sort) => void;
  basis: Basis;
  setBasis: (v: Basis) => void;
  shown: number;
}) {
  return (
    <div className="sticky top-0 z-30 border-y border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:gap-5">
          <div className="relative flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 14 14" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: tiras, wrap, sin gluten…"
              aria-label="Buscar en la carta"
              className="w-full border border-rule-strong bg-surface py-2 pl-9 pr-3 text-[0.9rem] text-ink placeholder:text-ink-faint focus:border-flame focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              label="Base de cálculo"
              value={basis}
              onChange={(v) => setBasis(v as Basis)}
              options={[
                { value: "total", label: "Ración" },
                { value: "100g", label: "por 100 g" },
              ]}
            />

            <label className="flex items-center gap-2 text-[0.8rem] text-ink-soft">
              <span className="hidden sm:inline">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Ordenar la carta"
                className="border border-rule-strong bg-surface px-2 py-2 text-[0.85rem] text-ink focus:border-flame focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <span
              aria-live="polite"
              className="figure hidden text-[0.75rem] text-ink-faint sm:inline"
            >
              {shown} {shown === 1 ? "producto" : "productos"}
            </span>
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
          <div className="flex gap-1.5">
            <Chip
              active={active === null}
              onClick={() => setActive(null)}
              label="Todo"
            />
            {CATEGORIES.map((c) => (
              <Chip
                key={c.slug}
                active={active === c.slug}
                onClick={() => setActive(active === c.slug ? null : c.slug)}
                label={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap border px-3 py-1.5 text-[0.78rem] font-medium transition-colors duration-200 ${
        active
          ? "border-flame-deep bg-flame-deep text-surface"
          : "border-rule-strong bg-surface text-ink-soft hover:border-flame hover:text-flame-deep"
      }`}
    >
      {label}
    </button>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex border border-rule-strong bg-surface"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`px-3 py-2 text-[0.78rem] font-medium transition-colors duration-200 ${
            value === o.value
              ? "bg-ink text-surface"
              : "text-ink-soft hover:text-flame-deep"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CategorySection({ group, basis }: { group: Category; basis: Basis }) {
  return (
    <section id={group.slug} className="scroll-mt-32 py-10 sm:py-14">
      <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-[1.75rem]">
          {group.name}
        </h2>
        <span className="figure text-[0.75rem] text-ink-faint">
          {group.items.length}
        </span>
        <p className="w-full max-w-[60ch] text-[0.9rem] text-ink-soft">
          {group.blurb}
        </p>
      </header>

      <ColumnHeadings />

      <ul className="border-t border-rule">
        {group.items.map((item) => (
          <ItemRow key={item.id} item={item} basis={basis} />
        ))}
      </ul>
    </section>
  );
}

function ColumnHeadings() {
  return (
    <div className="hidden items-center gap-4 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-faint md:flex">
      <div className="w-14 shrink-0" />
      <div className="flex-1">Producto</div>
      <div className="w-16 shrink-0 text-right">Peso</div>
      <div className="w-16 shrink-0 text-right">kcal</div>
      <div className="w-16 shrink-0 text-right">Prot.</div>
      <div className="w-16 shrink-0 text-right">Grasas</div>
      <div className="w-16 shrink-0 text-right">Sal</div>
      <div className="w-5 shrink-0" />
    </div>
  );
}

function ItemRow({ item, basis }: { item: Item; basis: Basis }) {
  const n = scaleNutrition(item.nutrition, basis);
  const unit = unitFor(item);
  const hasData = n.kcal !== null;
  const description = usefulDescription(item.description, item.name);
  const flagged = dataWarnings(item.nutrition).length > 0;

  return (
    <li className="border-b border-rule">
      <Link
        href={`/producto/${item.id}`}
        className="group flex items-center gap-4 py-2.5 transition-colors duration-200 hover:bg-flame-wash"
      >
        <div className="relative size-16 shrink-0 overflow-hidden bg-paper-deep sm:size-[4.5rem]">
          {item.image ? (
            <Image
              src={imageUrl(item.image, 220, 220)}
              alt=""
              fill
              sizes="(min-width: 640px) 72px, 64px"
              className="object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.07]"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[0.95rem] font-semibold text-ink group-hover:text-flame-deep">
            {item.name}
            {flagged ? (
              <span
                title="La ficha oficial es inconsistente en esta fila"
                aria-label="Datos inconsistentes en la ficha oficial"
                className="figure shrink-0 border border-rule-strong px-1 text-[0.6rem] font-medium text-ink-faint"
              >
                ?
              </span>
            ) : null}
          </p>
          {description ? (
            <p className="truncate text-[0.78rem] text-ink-faint">
              {description}
            </p>
          ) : null}
          {/* Compact figures for narrow screens. */}
          <p className="figure mt-0.5 flex gap-3 text-[0.72rem] text-ink-soft md:hidden">
            {hasData ? (
              <>
                <span>
                  <strong className="font-semibold text-ink">
                    {int(n.kcal)}
                  </strong>{" "}
                  kcal
                </span>
                <span>{fixed(n.proteinas)} g prot.</span>
                <span>{fixed(n.grasas)} g grasa</span>
              </>
            ) : (
              <span>Sin datos publicados</span>
            )}
          </p>
        </div>

        <Cell>
          {n.peso === null ? "—" : `${int(n.peso)} ${unit}`}
        </Cell>
        <Cell emphasis>{int(n.kcal)}</Cell>
        <Cell>{fixed(n.proteinas)}</Cell>
        <Cell>{fixed(n.grasas)}</Cell>
        <Cell>{fixed(n.sal, 1)}</Cell>

        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="hidden size-5 shrink-0 text-ink-faint transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 group-hover:text-flame md:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" />
        </svg>
      </Link>
    </li>
  );
}

function Cell({
  children,
  emphasis = false,
}: {
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`figure hidden w-16 shrink-0 text-right text-[0.85rem] md:block ${
        emphasis ? "font-semibold text-ink" : "text-ink-soft"
      }`}
    >
      {children}
    </div>
  );
}

function EmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-xl font-bold text-ink">
        Nada coincide con «{query}»
      </p>
      <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-soft">
        Prueba con el nombre del producto, una categoría o un ingrediente.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 border border-flame-deep px-4 py-2 text-sm font-semibold text-flame-deep transition-colors duration-200 hover:bg-flame-deep hover:text-surface"
      >
        Ver la carta completa
      </button>
    </div>
  );
}
