import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-5 py-12 text-center">
      <header className="rise flex flex-col items-center gap-5">
        <Logo />
        <p className="max-w-md text-balance text-dim">
          Faites deviner le mot mystère à votre partenaire, un indice à la
          fois. Comme à la télé&nbsp;!
        </p>
      </header>

      <nav className="grid w-full max-w-md gap-4">
        <Link
          href="/duel"
          className="panel rise rise-1 group flex items-center gap-5 p-5 text-left transition hover:border-cyan/60"
        >
          <span className="screen flex h-16 w-16 shrink-0 items-center justify-center font-display text-3xl text-cyan">
            VS
          </span>
          <span className="flex-1">
            <span className="font-display block text-2xl tracking-wide">LE DUEL</span>
            <span className="text-sm text-dim">
              Deux équipes, des manches chrono. La plus rapide l&apos;emporte.
            </span>
          </span>
          <span className="text-2xl text-cyan transition group-hover:translate-x-1">›</span>
        </Link>

        <Link
          href="/finale"
          className="panel rise rise-2 group flex items-center gap-5 p-5 text-left transition hover:border-gold/60"
        >
          <span className="screen flex h-16 w-16 shrink-0 items-center justify-center font-display text-xl text-gold">
            3000€
          </span>
          <span className="flex-1">
            <span className="font-display block text-2xl tracking-wide">LA FINALE</span>
            <span className="text-sm text-dim">
              5 mots, 90 secondes, 3 indices par mot. Doublez la mise&nbsp;!
            </span>
          </span>
          <span className="text-2xl text-gold transition group-hover:translate-x-1">›</span>
        </Link>

        <Link
          href="/regles"
          className="btn btn-ghost rise rise-3 mx-auto mt-2 px-6 py-2.5 text-sm"
        >
          Règles du jeu
        </Link>
      </nav>

      <footer className="rise rise-4 text-xs text-dim/70">
        Inspiré du jeu télévisé «&nbsp;Mot de passe&nbsp;» · Jouez à deux ou plus,
        sur un seul téléphone
      </footer>
    </main>
  );
}
