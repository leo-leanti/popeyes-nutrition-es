import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-6xl flex-col items-start px-5 py-28 sm:px-8"
    >
      <p className="text-[0.8rem] font-semibold uppercase tracking-wider text-flame">
        Error 404
      </p>
      <h1 className="mt-4 max-w-[16ch] text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem]">
        Esto no está en la carta
      </h1>
      <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-ink-soft">
        La página que buscas no existe, o el producto ya no forma parte de la
        ficha nutricional publicada.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-flame px-6 py-3 text-[0.9rem] font-bold text-void transition-transform duration-300 ease-[var(--ease-out-quint)] hover:scale-[1.03]"
      >
        Ver las categorías
      </Link>
    </main>
  );
}
