import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="contenido"
      className="mx-auto flex max-w-[78rem] flex-col items-start px-5 py-24 sm:px-8"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-flame-deep">
        Error 404
      </p>
      <h1 className="mt-4 max-w-[16ch] font-display text-[2.4rem] font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-[3.2rem]">
        Esto no está en la carta
      </h1>
      <p className="mt-5 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
        La página que buscas no existe, o el producto ya no forma parte de la
        ficha nutricional publicada.
      </p>
      <Link
        href="/"
        className="mt-8 border border-flame-deep px-5 py-2.5 text-sm font-semibold text-flame-deep transition-colors duration-200 hover:bg-flame-deep hover:text-surface"
      >
        Ver la carta completa
      </Link>
    </main>
  );
}
