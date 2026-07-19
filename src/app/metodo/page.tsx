import type { Metadata } from "next";
import Link from "next/link";
import { ALL_ITEMS, CATEGORIES } from "@/data/menu";

export const metadata: Metadata = {
  title: "Fuentes y método",
  description: "De dónde salen los datos de este sitio y qué límites tienen.",
};

export default function MethodPage() {
  const noData = ALL_ITEMS.filter((i) => i.nutrition.kcal === null);

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-5 sm:px-8">
      <nav className="pt-10">
        <Link
          href="/"
          className="text-[0.85rem] font-medium text-ink-faint transition-colors hover:text-ink"
        >
          ← Categorías
        </Link>
      </nav>

      <h1 className="max-w-[16ch] pt-6 text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem]">
        Fuentes y método
      </h1>

      <div className="grid gap-x-14 gap-y-10 pt-12 lg:grid-cols-2">
        <Block title="De dónde salen los números">
          <p>
            Los {ALL_ITEMS.length} productos y sus valores se transcribieron de
            la ficha <Cite>Información Nutricional Ed.02, marzo 2025</Cite> de
            Popeyes España: una hoja A3 con {CATEGORIES.length} bloques de
            producto y once columnas por fila.
          </p>
          <p>
            Las fotografías y las descripciones proceden del catálogo público de
            producto de popeyes.es, el mismo que alimenta su carta online.
          </p>
        </Block>

        <Block title="Cómo se han obtenido los ingredientes">
          <p>
            Popeyes España <strong className="text-ink">no publica</strong> la
            declaración completa de ingredientes de sus productos. Lo que se
            muestra aquí son los componentes principales que aparecen en la
            descripción oficial de cada producto, completados con la base de
            preparación de cada familia (rebozado, aceite, especias) cuando la
            descripción solo nombra los ingredientes visibles.
          </p>
          <p>
            Tómalos como una guía de composición, no como una lista legal. Si
            tienes una alergia o una intolerancia, consulta la información
            oficial en el restaurante.
          </p>
        </Block>

        <Block title="Erratas de la ficha original">
          <p>
            Los valores se reproducen tal cual aparecen publicados, sin
            corregirlos. La ficha contiene varias filas internamente
            imposibles, y cada producto afectado lo avisa en su página.
          </p>
          <p>
            Las seis <Cite>Piezas Picantes</Cite> declaran más grasa saturada
            que grasa total, y sus macronutrientes suman alrededor de un 40 %
            menos de las calorías indicadas. El <Cite>Pop Cream Kit Kat</Cite> y
            el <Cite>Kit Kat Shake</Cite> declaran más azúcares que hidratos de
            carbono. En <Cite>The Chicken Cheese</Cite>, los kJ y las kcal no se
            corresponden.
          </p>
        </Block>

        <Block title="Qué no encontrarás aquí">
          <p>
            <strong className="text-ink">Menús y combos.</strong> La ficha
            oficial solo detalla productos sueltos. Para un menú, suma el
            sandwich, el complemento y la bebida.
          </p>
          {noData.length > 0 ? (
            <p>
              <strong className="text-ink">
                {noData.length}{" "}
                {noData.length === 1 ? "producto" : "productos"} sin datos.
              </strong>{" "}
              La ficha deja la fila en blanco para{" "}
              {noData.map((i, idx) => (
                <span key={i.id}>
                  {idx > 0 ? ", " : ""}
                  <Link
                    href={`/producto/${i.id}`}
                    className="text-flame underline underline-offset-4 hover:text-ember"
                  >
                    {i.name}
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}
          <p>
            <strong className="text-ink">Alérgenos.</strong> Para eso, la fuente
            correcta es la carta de alérgenos oficial, que Popeyes publica y
            actualiza por su cuenta.
          </p>
        </Block>
      </div>
    </main>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[62ch]">
      <h2 className="text-[1.25rem] font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-4 space-y-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

function Cite({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>;
}
