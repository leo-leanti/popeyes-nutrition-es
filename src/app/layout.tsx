import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Valores nutricionales · Popeyes España",
    template: "%s · Valores nutricionales Popeyes",
  },
  description:
    "Calorías, macros, sal y alérgenos de los 105 productos de la carta de Popeyes España. Datos de la ficha oficial Ed.02, marzo 2025.",
  openGraph: {
    title: "Valores nutricionales · Popeyes España",
    description:
      "Calorías, macros y alérgenos de toda la carta de Popeyes España.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-surface"
        >
          Saltar al contenido
        </a>
        <div className="flex-1">{children}</div>
        <footer className="mt-24 border-t border-rule">
          <div className="mx-auto max-w-[78rem] px-5 py-10 sm:px-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-[52ch] space-y-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  Sobre estos datos
                </p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Valores tomados de la ficha{" "}
                  <span className="font-medium text-ink">
                    Información Nutricional Ed.02, marzo 2025
                  </span>{" "}
                  y de la{" "}
                  <span className="font-medium text-ink">
                    Carta de alérgenos Ed.02, junio 2023
                  </span>{" "}
                  de Popeyes España. Imágenes y descripciones, del catálogo
                  público de popeyes.es.
                </p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Proyecto independiente, sin relación con Popeyes ni con
                  Restaurant Brands International. Si un dato es crítico para ti,
                  confírmalo en el restaurante.
                </p>
              </div>
              <nav className="flex flex-col gap-2 text-sm">
                <Link
                  href="/"
                  className="text-ink-soft transition-colors hover:text-flame-deep"
                >
                  Carta completa
                </Link>
                <Link
                  href="/metodo"
                  className="text-ink-soft transition-colors hover:text-flame-deep"
                >
                  Método y fuentes
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
