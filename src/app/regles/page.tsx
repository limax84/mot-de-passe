import type { Metadata } from "next";
import Link from "next/link";
import GameHeader from "@/components/GameHeader";

export const metadata: Metadata = {
  title: "Règles — Mot de passe",
  description: "Les règles du jeu Mot de passe : indices, interdits, duel et finale.",
};

const FORBIDDEN = [
  "Dire le mot de passe lui-même, ou un mot qui le contient",
  "Un mot de la même famille (« hélice » pour HÉLICOPTÈRE)",
  "Une traduction en langue étrangère",
  "Un homophone (même prononciation, autre orthographe)",
  "Les gestes, les mimes et les bruitages",
];

export default function ReglesPage() {
  return (
    <>
      <GameHeader title="RÈGLES" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-4 pb-10">
        <section className="panel rise space-y-2 p-5">
          <h2 className="font-display text-lg tracking-wide text-cyan">LE PRINCIPE</h2>
          <p className="text-sm text-dim">
            Un joueur voit le <strong className="text-ink">mot de passe</strong> à l&apos;écran et
            le fait deviner à son partenaire en donnant des{" "}
            <strong className="text-ink">indices d&apos;un seul mot</strong>. Le partenaire propose
            des réponses à voix haute, sans regarder l&apos;écran.
          </p>
        </section>

        <section className="panel rise rise-1 space-y-2 p-5">
          <h2 className="font-display text-lg tracking-wide text-danger">LES INTERDITS</h2>
          <ul className="space-y-1.5 text-sm text-dim">
            {FORBIDDEN.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-danger">✗</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-dim/70">
            Un interdit commis = le mot est perdu, passez au suivant !
          </p>
        </section>

        <section className="panel rise rise-2 space-y-2 p-5">
          <h2 className="font-display text-lg tracking-wide text-cyan">LE DUEL</h2>
          <p className="text-sm text-dim">
            Deux équipes de deux s&apos;affrontent en manches chronométrées (30 secondes par
            défaut). À chaque manche, jusqu&apos;à{" "}
            <strong className="text-ink">5 mots à faire deviner</strong> : chaque mot trouvé
            rapporte <strong className="text-ink">1 point</strong>. L&apos;équipe avec le plus de
            points remporte le duel.
          </p>
        </section>

        <section className="panel rise rise-3 space-y-2 p-5">
          <h2 className="font-display text-lg tracking-wide text-gold">LA FINALE</h2>
          <p className="text-sm text-dim">
            Choisissez votre mise (500, 1 000 ou 1 500 €) puis faites deviner{" "}
            <strong className="text-ink">5 mots en 90 secondes</strong>, avec{" "}
            <strong className="text-ink">3 indices maximum</strong> par mot.
          </p>
          <ul className="space-y-1 text-sm text-dim">
            <li>🏆 5 mots trouvés : la mise est <strong className="text-gold">doublée</strong> (jusqu&apos;à 3 000 €)</li>
            <li>✓ 3 ou 4 mots : la mise est remportée</li>
            <li>✗ Moins de 3 : tout est perdu</li>
          </ul>
        </section>

        <Link href="/" className="btn btn-primary rise rise-4 mx-auto mt-2 px-8 py-3">
          Jouer
        </Link>
      </main>
    </>
  );
}
