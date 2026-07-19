import Image from "next/image";
import Link from "next/link";
import { ALL_ITEMS, CATEGORIES } from "@/data/menu";
import { imageUrl, int, kcalRange } from "@/lib/format";

export default function Home() {
  return (
    <main id="contenido" className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="pb-14 pt-16 sm:pb-20 sm:pt-24">
        <h1 className="max-w-[14ch] text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem]">
          Toda la carta,
          <br />
          <span className="text-flame">con sus números.</span>
        </h1>
        <p className="mt-7 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-soft sm:text-[1.15rem]">
          Calorías, macronutrientes e ingredientes principales de los{" "}
          {ALL_ITEMS.length} productos de Popeyes España. Elige una categoría
          para empezar.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 pb-8 sm:gap-4 lg:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const range = kcalRange(category.items);
          return (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface p-4 transition-all sm:p-6 duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-flame/45 hover:bg-raised"
            >
              <div className="relative mx-auto mb-4 aspect-square w-full max-w-[13rem] sm:mb-5">
                <div className="bloom opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                {category.image ? (
                  <Image
                    src={imageUrl(category.image, 520)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 210px, 42vw"
                    priority={index < 3}
                    className="object-contain transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.06]"
                  />
                ) : null}
              </div>

              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-[0.98rem] font-bold leading-tight tracking-[-0.01em] transition-colors group-hover:text-flame sm:text-[1.2rem]">
                    {category.name}
                  </h2>
                  <p className="mt-1.5 text-[0.78rem] leading-snug text-ink-faint sm:text-[0.85rem]">
                    {category.items.length} productos
                    {range ? (
                      <>
                        {" · "}
                        <span className="tnum">
                          {int(range[0])}–{int(range[1])}
                        </span>{" "}
                        kcal
                      </>
                    ) : null}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="mb-0.5 hidden size-9 shrink-0 place-items-center rounded-full border border-line text-ink-faint sm:grid transition-all duration-400 ease-[var(--ease-out-quint)] group-hover:border-flame group-hover:bg-flame group-hover:text-void"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
