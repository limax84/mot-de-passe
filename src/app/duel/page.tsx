import type { Metadata } from "next";
import GameHeader from "@/components/GameHeader";
import DuelGame from "@/components/duel/DuelGame";

export const metadata: Metadata = {
  title: "Le Duel — Mot de passe",
  description: "Deux équipes s'affrontent en manches chronométrées.",
};

export default function DuelPage() {
  return (
    <>
      <GameHeader title="LE DUEL" />
      <DuelGame />
    </>
  );
}
