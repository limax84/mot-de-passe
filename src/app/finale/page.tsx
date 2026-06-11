import type { Metadata } from "next";
import GameHeader from "@/components/GameHeader";
import FinaleGame from "@/components/finale/FinaleGame";

export const metadata: Metadata = {
  title: "La Finale — Mot de passe",
  description: "5 mots, 90 secondes, jusqu'à 3 000 € à la clé.",
};

export default function FinalePage() {
  return (
    <>
      <GameHeader title="LA FINALE" />
      <FinaleGame />
    </>
  );
}
