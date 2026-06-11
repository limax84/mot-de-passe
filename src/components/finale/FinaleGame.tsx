"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import DifficultyPicker, { type DifficultyChoice } from "@/components/DifficultyPicker";
import TimerRing from "@/components/TimerRing";
import WordCard from "@/components/WordCard";
import { drawWords } from "@/data/words";
import { sounds, vibrate } from "@/lib/sound";
import { useCountdown } from "@/lib/useCountdown";

const TOTAL_SECONDS = 90;
const WORD_COUNT = 5;
const MAX_CLUES = 3;
const STAKES = [500, 1000, 1500];

type Phase = "setup" | "handoff" | "countdown" | "play" | "results";

type FinaleWord = { word: string; found: boolean; clues: number };

export default function FinaleGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [stake, setStake] = useState(1000);
  const [difficulty, setDifficulty] = useState<DifficultyChoice>("moyen");
  const [words, setWords] = useState<FinaleWord[]>([]);
  const [index, setIndex] = useState(0);
  const usedWords = useRef(new Set<string>());

  const foundCount = words.filter((w) => w.found).length;
  const gain = foundCount === WORD_COUNT ? stake * 2 : foundCount >= 3 ? stake : 0;

  useEffect(() => {
    if (phase === "results" && gain > 0) sounds.win();
  }, [phase, gain]);

  const timer = useCountdown(() => {
    sounds.buzz();
    vibrate([150, 80, 150]);
    setPhase("results");
  });

  function prepare() {
    const drawn = drawWords(difficulty, WORD_COUNT, usedWords.current);
    drawn.forEach((w) => usedWords.current.add(w));
    setWords(drawn.map((word) => ({ word, found: false, clues: 0 })));
    setIndex(0);
    setPhase("handoff");
  }

  function onCountdownDone() {
    setPhase("play");
    timer.start(TOTAL_SECONDS);
  }

  function giveClue() {
    sounds.tick();
    setWords((ws) => ws.map((w, i) => (i === index ? { ...w, clues: w.clues + 1 } : w)));
  }

  function advance(found: boolean) {
    if (found) {
      sounds.found();
      vibrate(40);
      setWords((ws) => ws.map((w, i) => (i === index ? { ...w, found: true } : w)));
    } else {
      sounds.pass();
    }
    if (index + 1 >= words.length) {
      timer.stop();
      setPhase("results");
    } else {
      setIndex((i) => i + 1);
    }
  }

  /* ————— Écrans ————— */

  if (phase === "setup") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6">
        <section className="panel rise space-y-2 p-5 text-sm text-dim">
          <p>
            <strong className="text-ink">{WORD_COUNT} mots</strong> à faire deviner en{" "}
            <strong className="text-ink">{TOTAL_SECONDS} secondes</strong>, avec{" "}
            <strong className="text-ink">{MAX_CLUES} indices maximum</strong> par mot.
          </p>
          <p>
            5 mots trouvés&nbsp;: <strong className="text-gold">mise doublée</strong>. 3 ou
            4&nbsp;: mise remportée. Moins&nbsp;: tout est perdu&nbsp;!
          </p>
        </section>

        <section className="panel rise rise-1 flex flex-col gap-3 p-5">
          <h2 className="font-display text-lg tracking-wide text-gold">VOTRE MISE</h2>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Mise">
            {STAKES.map((s) => {
              const active = stake === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStake(s)}
                  className={`rounded-xl border px-2 py-3 text-center transition ${
                    active
                      ? "border-gold/80 bg-gold/15 shadow-[0_0_18px_-4px_rgba(255,200,67,0.7)]"
                      : "border-(--panel-edge) bg-panel/40 hover:bg-panel"
                  }`}
                >
                  <span className="font-display block text-xl text-gold">{s}€</span>
                  <span className="block text-xs text-dim">→ {s * 2}€</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel rise rise-2 flex flex-col gap-3 p-5">
          <h2 className="font-display text-lg tracking-wide text-gold">DIFFICULTÉ</h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </section>

        <button
          type="button"
          onClick={prepare}
          className="btn btn-gold rise rise-3 mt-auto px-8 py-4 text-lg"
        >
          Jouer la finale
        </button>
      </div>
    );
  }

  if (phase === "handoff") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <h2 className="font-display pop text-4xl">
          <span className="gold-shine">{stake * 2}€</span> EN JEU
        </h2>
        <div className="panel max-w-sm space-y-2 p-5 text-sm text-dim">
          <p>
            📱 Le <strong className="text-ink">donneur d&apos;indices</strong> prend le téléphone.
          </p>
          <p>
            À chaque indice prononcé, appuyez sur{" "}
            <strong className="text-ink">«&nbsp;Indice donné&nbsp;»</strong>. Au bout de{" "}
            {MAX_CLUES}, il faut trouver… ou passer.
          </p>
        </div>
        <button type="button" onClick={() => setPhase("countdown")} className="btn btn-gold px-10 py-4 text-lg">
          C&apos;est parti !
        </button>
      </div>
    );
  }

  if (phase === "countdown") {
    return <Countdown onDone={onCountdownDone} />;
  }

  if (phase === "play") {
    const current = words[index];
    const cluesLeft = MAX_CLUES - current.clues;
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-5 px-5 py-4">
        <div className="flex w-full items-center justify-between">
          <span className="font-display text-lg text-gold">{stake * 2}€</span>
          <span className="text-sm text-dim">
            Mot {index + 1}&nbsp;/&nbsp;{words.length}
          </span>
        </div>
        <TimerRing totalTenths={TOTAL_SECONDS * 10} tenths={timer.tenths} />
        <WordCard word={current.word} />

        <div className="flex items-center gap-2" aria-label={`${cluesLeft} indices restants`}>
          {Array.from({ length: MAX_CLUES }, (_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full transition ${
                i < current.clues
                  ? "bg-danger shadow-[0_0_8px_rgba(255,84,112,0.8)]"
                  : "bg-cyan shadow-[0_0_8px_rgba(65,214,255,0.8)]"
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-dim">
            {cluesLeft > 0
              ? `${cluesLeft} indice${cluesLeft > 1 ? "s" : ""} restant${cluesLeft > 1 ? "s" : ""}`
              : "Plus d'indices !"}
          </span>
        </div>

        <button
          type="button"
          onClick={giveClue}
          disabled={cluesLeft === 0}
          className="btn btn-primary w-full py-3.5"
        >
          Indice donné
        </button>
        <div className="mt-auto grid w-full grid-cols-2 gap-3 pb-4">
          <button
            type="button"
            onClick={() => advance(false)}
            className="btn btn-danger-soft py-4 text-lg"
          >
            Passer
          </button>
          <button type="button" onClick={() => advance(true)} className="btn btn-ok py-4 text-lg">
            Trouvé !
          </button>
        </div>
      </div>
    );
  }

  // results
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-5 py-8 text-center">
      <p className="text-dim">
        {foundCount}&nbsp;/&nbsp;{WORD_COUNT} mots trouvés
      </p>
      {gain > 0 ? (
        <h2 className="font-display pop text-6xl">
          <span className="gold-shine" data-testid="gain">{gain}€</span>
        </h2>
      ) : (
        <h2 className="font-display pop text-4xl text-danger" data-testid="gain">
          PERDU…
        </h2>
      )}
      <p className="max-w-xs text-sm text-dim">
        {gain === stake * 2
          ? "Sans faute ! La mise est doublée, comme à la télé."
          : gain > 0
            ? "La mise est sauvée. Il en fallait 5 pour doubler !"
            : "Il fallait au moins 3 mots pour repartir avec la mise."}
      </p>
      <ul className="panel w-full divide-y divide-(--panel-edge) overflow-hidden p-0">
        {words.map((w, i) => (
          <li key={i} className="flex items-center justify-between px-5 py-3">
            <span className="font-semibold uppercase tracking-wide">{w.word}</span>
            <span className={w.found ? "text-ok" : "text-danger"}>
              {w.found ? `✓ ${w.clues} indice${w.clues > 1 ? "s" : ""}` : "✗ manqué"}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3">
        <button type="button" onClick={() => setPhase("setup")} className="btn btn-gold px-10 py-4 text-lg">
          Rejouer la finale
        </button>
        <Link href="/" className="btn btn-ghost px-10 py-3">
          Accueil
        </Link>
      </div>
    </div>
  );
}
