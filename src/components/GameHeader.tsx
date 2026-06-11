import Link from "next/link";

export default function GameHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-5">
      <Link href="/" className="btn btn-ghost px-4 py-1.5 text-sm" aria-label="Retour à l'accueil">
        ‹ Accueil
      </Link>
      <h1 className="font-display text-xl tracking-wide text-ink">{title}</h1>
      <span className="dots text-[0.5rem]" aria-hidden>
        <i /><i /><i />
      </span>
    </header>
  );
}
