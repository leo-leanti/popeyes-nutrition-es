import type { Metadata } from "next";
import Link from "next/link";
import { ALL_ITEMS, CATEGORIES } from "@/data/menu";

export const metadata: Metadata = {
  title: "Método y fuentes",
  description:
    "De dónde salen los datos de este sitio y qué limitaciones tienen.",
};

export default function MethodPage() {
  const noData = ALL_ITEMS.filter((i) => i.nutrition.kcal === null);

  return (
    <main id="contenido" className="mx-auto max-w-[78rem] px-5 py-10 sm:px-8">
      <Link
        href="/"
        className="text-[0.8rem] font-medium text-ink-soft transition-colors hover:text-flame-deep"
      >
        ← Carta completa
      </Link>

      <h1 className="mt-6 max-w-[14ch] font-display text-[2.4rem] font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-[3.4rem]">
        Método y fuentes
      </h1>

      <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-2">
        <section className="max-w-[68ch] space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
          <H2>De dónde salen los números</H2>
          <p>
            Los {ALL_ITEMS.length} productos y sus valores se transcribieron de
            la ficha <Cite>Información Nutricional Ed.02, marzo 2025</Cite> de
            Popeyes España: una única hoja A3 con {CATEGORIES.length} bloques de
            producto y once columnas por fila.
          </p>
          <p>
            Los alérgenos vienen de la{" "}
            <Cite>Carta de alérgenos Ed.02, junio 2023</Cite>, publicada por
            Popeyes España. Es una edición anterior, y algunos nombres de
            producto han cambiado desde entonces; cuando un producto actual no
            aparecía con su nombre exacto, se le asignó el perfil de su familia
            (por ejemplo, todos los sandwiches comparten base de pan brioche,
            huevo y gluten).
          </p>
          <p>
            Las fotografías y las descripciones proceden del catálogo público de
            producto de popeyes.es, el mismo que alimenta su carta online.
          </p>
        </section>

        <section className="max-w-[68ch] space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
          <H2>Qué no encontrarás aquí</H2>
          <p>
            <strong className="font-semibold text-ink">
              Listas de ingredientes completas.
            </strong>{" "}
            Popeyes España no las publica producto a producto. Lo más cercano
            que existe es la declaración de alérgenos, y eso es lo que se
            muestra.
          </p>
          <p>
            <strong className="font-semibold text-ink">Menús y combos.</strong>{" "}
            La ficha oficial solo detalla productos sueltos. Para un menú, suma
            el sandwich, el complemento y la bebida.
          </p>
          {noData.length > 0 ? (
            <p>
              <strong className="font-semibold text-ink">
                {noData.length}{" "}
                {noData.length === 1 ? "producto" : "productos"} sin datos.
              </strong>{" "}
              La ficha deja la fila en blanco para{" "}
              {noData.map((i, idx) => (
                <span key={i.id}>
                  {idx > 0 ? ", " : ""}
                  <Link
                    href={`/producto/${i.id}`}
                    className="text-flame-deep underline underline-offset-2"
                  >
                    {i.name}
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}
        </section>

        <section className="max-w-[68ch] space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
          <H2>Erratas de la ficha original</H2>
          <p>
            Los valores se reproducen tal cual aparecen publicados, sin
            corregirlos. Conviene saber que la ficha contiene algunas
            inconsistencias evidentes: en las tiras crujientes de 2 y 3 piezas
            el sodio figura como 0,6 y 0,9 mg, cuando el patrón de la tabla
            apunta a gramos mal etiquetados; y en el Kit Kat Shake las grasas
            (2,5 g) son menores que las saturadas (12,9 g), lo que es
            imposible.
          </p>
          <p>
            Se ha preferido mostrar el dato original antes que inventar una
            corrección. Ante una duda que te importe, pregunta en el
            restaurante.
          </p>
        </section>

        <section className="max-w-[68ch] space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
          <H2>Cómo se calculan las columnas</H2>
          <p>
            <Cite>100 g</Cite> divide el valor de la ración entre su peso y lo
            multiplica por cien. Sirve para comparar productos de tamaños muy
            distintos.
          </p>
          <p>
            <Cite>%IR</Cite> es el porcentaje sobre la ingesta de referencia de
            un adulto medio: 2 000 kcal, 70 g de grasas, 20 g de saturadas, 260
            g de hidratos, 90 g de azúcares, 50 g de proteínas y 6 g de sal,
            según el Reglamento (UE) 1169/2011.
          </p>
          <p>
            <Cite>Proteína por caloría</Cite> ordena por gramos de proteína cada
            100 kcal.
          </p>
        </section>
      </div>

      <p className="mt-14 max-w-[68ch] border-t border-rule pt-6 text-[0.85rem] leading-relaxed text-ink-faint">
        Este es un proyecto independiente y sin ánimo de lucro, sin relación con
        Popeyes ni con Restaurant Brands International. Las marcas y las
        imágenes pertenecen a sus titulares. Si detectas un error de
        transcripción, la fuente manda: la ficha oficial de Popeyes España.
      </p>
    </main>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[1.35rem] font-extrabold uppercase tracking-tight text-ink">
      {children}
    </h2>
  );
}

function Cite({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-ink">{children}</span>;
}
