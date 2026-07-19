import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://popeyes-nutrition-es.vercel.app"),
  title: {
    default: "Valores nutricionales · Popeyes España",
    template: "%s · Popeyes España",
  },
  description:
    "Calorías, macronutrientes e ingredientes principales de los 105 productos de la carta de Popeyes España.",
  openGraph: {
    title: "Valores nutricionales · Popeyes España",
    description:
      "Calorías, macronutrientes e ingredientes de toda la carta de Popeyes España.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-flame focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-void"
        >
          Saltar al contenido
        </a>

        <header className="sticky top-0 z-40 border-b border-line/60 bg-void/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="flex items-baseline gap-2.5 text-[0.95rem] font-extrabold tracking-tight"
            >
              <span className="text-flame">Popeyes</span>
              <span className="font-medium text-ink-faint">nutrición</span>
            </Link>
            <Link
              href="/metodo"
              className="text-[0.85rem] font-medium text-ink-faint transition-colors hover:text-ink"
            >
              Fuentes
            </Link>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="mt-28 border-t border-line/60">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <p className="max-w-[62ch] text-[0.85rem] leading-relaxed text-ink-faint">
              Datos de la ficha{" "}
              <span className="text-ink-soft">
                Información Nutricional Ed.02, marzo 2025
              </span>{" "}
              de Popeyes España. Los ingredientes principales proceden de la
              descripción oficial de cada producto.{" "}
              <Link
                href="/metodo"
                className="text-flame underline underline-offset-4 hover:text-ember"
              >
                Cómo se ha hecho
              </Link>
              .
            </p>
            <p className="mt-4 max-w-[62ch] text-[0.8rem] leading-relaxed text-ink-faint/70">
              Proyecto independiente, sin relación con Popeyes ni con Restaurant
              Brands International. Si un dato es crítico para ti, confírmalo en
              el restaurante.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
