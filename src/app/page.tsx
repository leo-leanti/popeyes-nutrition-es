import MenuBrowser from "@/components/MenuBrowser";
import { ALL_ITEMS, CATEGORIES } from "@/data/menu";

export default function Home() {
  // Drinks and dips would win on calories alone and tell you nothing useful.
  const meals = ALL_ITEMS.filter(
    (i) =>
      i.nutrition.kcal !== null &&
      !["Bebidas", "Salsas"].includes(i.category),
  );
  const lightest = meals.reduce((a, b) =>
    (a.nutrition.kcal ?? 0) < (b.nutrition.kcal ?? 0) ? a : b,
  );
  const heaviest = meals.reduce((a, b) =>
    (a.nutrition.kcal ?? 0) > (b.nutrition.kcal ?? 0) ? a : b,
  );

  return (
    <main>
      <header className="border-b border-rule-strong">
        <div className="mx-auto max-w-[78rem] px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-flame-deep">
            Popeyes España · Ficha Ed.02, marzo 2025
          </p>

          <h1 className="mt-4 max-w-[16ch] font-display text-[2.6rem] font-extrabold uppercase leading-[0.92] tracking-tight text-ink sm:text-[4.2rem]">
            Qué llevas
            <br />
            en la bandeja
          </h1>

          <p className="mt-6 max-w-[58ch] text-[1.05rem] leading-relaxed text-ink-soft">
            Calorías, macros, sal y alérgenos de los {ALL_ITEMS.length}{" "}
            productos de la carta. Los mismos números de la ficha oficial, que
            aquí se pueden buscar, ordenar y comparar en vez de leerlos en un PDF
            a tamaño A3.
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-rule pt-6">
            <Stat label="Productos" value={String(ALL_ITEMS.length)} />
            <Stat label="Categorías" value={String(CATEGORIES.length)} />
            <Stat
              label="Plato más ligero"
              value={`${lightest.nutrition.kcal} kcal`}
              detail={lightest.name}
            />
            <Stat
              label="Plato más contundente"
              value={`${heaviest.nutrition.kcal} kcal`}
              detail={`${heaviest.name} · ${heaviest.category}`}
            />
          </dl>
        </div>
      </header>

      <MenuBrowser />
    </main>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </dt>
      <dd className="figure mt-1 text-[1.6rem] font-semibold leading-none text-ink">
        {value}
      </dd>
      {detail ? (
        <dd className="mt-1 text-[0.78rem] text-ink-soft">{detail}</dd>
      ) : null}
    </div>
  );
}
