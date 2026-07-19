import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory, type Item } from "@/data/menu";
import { fixed, imageUrl, int } from "@/lib/format";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: category.name,
    description: `${category.blurb} ${category.items.length} productos con sus valores nutricionales.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-5 sm:px-8">
      <nav className="pt-10">
        <Link
          href="/"
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
          Categorías
        </Link>
      </nav>

      <header className="pb-10 pt-6 sm:pb-12">
        <h1 className="text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem]">
          {category.name}
        </h1>
        <p className="mt-4 max-w-[54ch] text-[1rem] leading-relaxed text-ink-soft">
          {category.blurb}
        </p>
        <p className="mt-3 text-[0.85rem] text-ink-faint">
          {category.items.length} productos
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 pb-8 sm:gap-4 lg:grid-cols-3">
        {category.items.map((item, index) => (
          <ItemCard key={item.id} item={item} priority={index < 4} />
        ))}
      </ul>
    </main>
  );
}

function ItemCard({ item, priority }: { item: Item; priority: boolean }) {
  const { kcal, proteinas, grasas } = item.nutrition;

  return (
    <li>
      <Link
        href={`/producto/${item.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface p-4 transition-all duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-flame/45 hover:bg-raised sm:p-5"
      >
        <div className="relative mx-auto aspect-square w-full max-w-[11rem]">
          <div className="bloom opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
          {item.image ? (
            <Image
              src={imageUrl(item.image, 440)}
              alt=""
              fill
              sizes="(min-width: 1024px) 180px, 42vw"
              priority={priority}
              className="object-contain transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.07]"
            />
          ) : null}
        </div>

        <h2 className="relative mt-4 text-[0.98rem] font-bold leading-snug tracking-[-0.01em] transition-colors group-hover:text-flame">
          {item.name}
        </h2>

        {kcal !== null ? (
          <>
            <p className="tnum mt-2 text-[1.6rem] font-extrabold leading-none tracking-[-0.02em]">
              {int(kcal)}
              <span className="ml-1 text-[0.8rem] font-semibold text-ink-faint">
                kcal
              </span>
            </p>
            <p className="tnum mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-ink-faint">
              <span>{fixed(proteinas)} g proteína</span>
              <span>{fixed(grasas)} g grasa</span>
            </p>
          </>
        ) : (
          <p className="mt-2 text-[0.82rem] text-ink-faint">
            Sin datos publicados
          </p>
        )}
      </Link>
    </li>
  );
}
