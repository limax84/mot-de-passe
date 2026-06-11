"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import DifficultyPicker, { type DifficultyChoice } from "@/components/DifficultyPicker";
import TimerRing from "@/components/TimerRing";
import WordCard from "@/components/WordCard";
import { drawWords } from "@/data/words";
import { sounds, vibrate } from "@/lib/sound";
import { useCountdown } from "@/lib/useCountdown";

const WORDS_PER_ROUND = 5;

type Phase = "setup" | "handoff" | "countdown" | "play" | "roundEnd" | "results";

type RoundWord = { word: string; found: boolean };

const TEAM_COLORS = ["text-cyan", "text-gold"] as const;

export default function DuelGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [teams, setTeams] = useState(["Équipe Bleue", "Équipe Or"]);
  const [difficulty, setDifficulty] = useState<DifficultyChoice>("facile");
  const [roundsPerTeam, setRoundsPerTeam] = useState(2);
  const [roundSeconds, setRoundSeconds] = useState(30);

  const [round, setRound] = useState(0); // index global de manche
  const [scores, setScores] = useState([0, 0]);
  const [roundWords, setRoundWords] = useState<RoundWord[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const usedWords = useRef(new Set<string>());

  const totalRounds = roundsPerTeam * 2;
  const team = round % 2;

  const timer = useCountdown(() => {
    sounds.buzz();
    vibrate([120, 60, 120]);
    setPhase("roundEnd");
  });

  function startGame() {
    usedWords.current = new Set();
    setScores([0, 0]);
    setRound(0);
    setPhase("handoff");
  }

  function startRound() {
    const words = drawWords(difficulty, WORDS_PER_ROUND, usedWords.current);
    words.forEach((w) => usedWords.current.add(w));
    setRoundWords(words.map((word) => ({ word, found: false })));
    setWordIndex(0);
    setPhase("countdown");
  }

  function onCountdownDone() {
    setPhase("play");
    timer.start(roundSeconds);
  }

  function advance(found: boolean) {
    if (found) {
      sounds.found();
      vibrate(40);
      setScores((s) => s.map((v, i) => (i === team ? v + 1 : v)));
      setRoundWords((ws) => ws.map((w, i) => (i === wordIndex ? { ...w, found: true } : w)));
    } else {
      sounds.pass();
    }
    if (wordIndex + 1 >= roundWords.length) {
      timer.stop();
      setPhase("roundEnd");
    } else {
      setWordIndex((i) => i + 1);
    }
  }

  function nextRound() {
    if (round + 1 >= totalRounds) {
      sounds.win();
      setPhase("results");
    } else {
      setRound((r) => r + 1);
      setPhase("handoff");
    }
  }

  /* ————— Écrans ————— */

  if (phase === "setup") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6">
        <section className="panel rise flex flex-col gap-3 p-5">
          <h2 className="font-display text-lg tracking-wide text-cyan">LES ÉQUIPES</h2>
          {teams.map((name, i) => (
            <label key={i} className="flex items-center gap-3">
              <span className={`font-display w-6 text-xl ${TEAM_COLORS[i]}`}>{i + 1}</span>
              <input
                value={name}
                maxLength={20}
                aria-label={`Nom de l'équipe ${i + 1}`}
                onChange={(e) =>
                  setTeams((t) => t.map((v, j) => (j === i ? e.target.value : v)))
                }
                className="screen w-full px-4 py-2.5 font-semibold outline-none focus:border-cyan/70"
              />
            </label>
          ))}
        </section>

        <section className="panel rise rise-1 flex flex-col gap-3 p-5">
          <h2 className="font-display text-lg tracking-wide text-cyan">DIFFICULTÉ</h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </section>

        <section className="panel rise rise-2 flex flex-col gap-4 p-5">
          <h2 className="font-display text-lg tracking-wide text-cyan">LA PARTIE</h2>
          <Setting label="Manches par équipe">
            {[1, 2, 3].map((n) => (
              <Chip key={n} active={roundsPerTeam === n} onClick={() => setRoundsPerTeam(n)}>
                {n}
              </Chip>
            ))}
          </Setting>
          <Setting label="Durée d'une manche">
            {[30, 45, 60].map((n) => (
              <Chip key={n} active={roundSeconds === n} onClick={() => setRoundSeconds(n)}>
                {n}s
              </Chip>
            ))}
          </Setting>
        </section>

        <button
          type="button"
          onClick={startGame}
          className="btn btn-primary rise rise-3 mt-auto px-8 py-4 text-lg"
        >
          Lancer le duel
        </button>
      </div>
    );
  }

  if (phase === "handoff") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="text-dim">
          Manche {round + 1}&nbsp;/&nbsp;{totalRounds}
        </p>
        <h2 className={`font-display pop text-5xl ${TEAM_COLORS[team]}`}>{teams[team]}</h2>
        <div className="panel max-w-sm space-y-2 p-5 text-sm text-dim">
          <p>
            📱 Donnez le téléphone au <strong className="text-ink">donneur d&apos;indices</strong>.
          </p>
          <p>
            Son partenaire ne doit <strong className="text-ink">pas voir l&apos;écran</strong> et
            devine à voix haute.
          </p>
          <p>
            Interdits&nbsp;: mots de la même famille, traductions, gestes&nbsp;!
          </p>
        </div>
        <ScoreStrip teams={teams} scores={scores} />
        <button type="button" onClick={startRound} className="btn btn-gold px-10 py-4 text-lg">
          C&apos;est parti !
        </button>
      </div>
    );
  }

  if (phase === "countdown") {
    return <Countdown onDone={onCountdownDone} />;
  }

  if (phase === "play") {
    const current = roundWords[wordIndex];
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-5 py-4">
        <div className="flex w-full items-center justify-between">
          <span className={`font-display text-lg ${TEAM_COLORS[team]}`}>{teams[team]}</span>
          <span className="text-sm text-dim">
            Mot {wordIndex + 1}&nbsp;/&nbsp;{roundWords.length}
          </span>
        </div>
        <TimerRing totalTenths={roundSeconds * 10} tenths={timer.tenths} />
        <WordCard word={current.word} />
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

  if (phase === "roundEnd") {
    const foundCount = roundWords.filter((w) => w.found).length;
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-5 py-8">
        <h2 className="font-display text-3xl">FIN DE MANCHE</h2>
        <p className={`font-display text-xl ${TEAM_COLORS[team]}`}>
          {teams[team]} · +{foundCount} point{foundCount > 1 ? "s" : ""}
        </p>
        <ul className="panel w-full divide-y divide-(--panel-edge) overflow-hidden p-0">
          {roundWords.map((w, i) => (
            <li key={i} className="flex items-center justify-between px-5 py-3">
              <span className="font-semibold uppercase tracking-wide">{w.word}</span>
              <span className={w.found ? "text-ok" : "text-danger"}>
                {w.found ? "✓ trouvé" : "✗ manqué"}
              </span>
            </li>
          ))}
        </ul>
        <ScoreStrip teams={teams} scores={scores} />
        <button
          type="button"
          onClick={nextRound}
          className="btn btn-primary mt-auto px-10 py-4 text-lg"
        >
          {round + 1 >= totalRounds ? "Voir le résultat" : "Manche suivante"}
        </button>
      </div>
    );
  }

  // results
  const winner = scores[0] === scores[1] ? -1 : scores[0] > scores[1] ? 0 : 1;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      {winner === -1 ? (
        <h2 className="font-display pop text-5xl">ÉGALITÉ !</h2>
      ) : (
        <>
          <p className="text-dim">Vainqueur du duel</p>
          <h2 className={`font-display pop text-5xl ${TEAM_COLORS[winner]}`}>
            🏆 {teams[winner]}
          </h2>
        </>
      )}
      <ScoreStrip teams={teams} scores={scores} big />
      <div className="flex flex-col gap-3">
        <button type="button" onClick={startGame} className="btn btn-primary px-10 py-4 text-lg">
          Rejouer
        </button>
        <Link href="/finale" className="btn btn-gold px-10 py-3">
          Tenter la finale à 3 000 €
        </Link>
        <Link href="/" className="btn btn-ghost px-10 py-3">
          Accueil
        </Link>
      </div>
    </div>
  );
}

function ScoreStrip({
  teams,
  scores,
  big = false,
}: {
  teams: string[];
  scores: number[];
  big?: boolean;
}) {
  return (
    <div className="screen flex w-full max-w-sm items-stretch justify-between gap-2 px-6 py-3">
      {teams.map((t, i) => (
        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 1 ? "order-3" : ""}`}>
          <span className="max-w-28 truncate text-xs text-dim">{t}</span>
          <span
            className={`font-display tabular-nums ${TEAM_COLORS[i]} ${big ? "text-5xl" : "text-3xl"}`}
            data-testid={`score-${i}`}
          >
            {scores[i]}
          </span>
        </div>
      ))}
      <span className="order-2 self-center font-display text-dim">—</span>
    </div>
  );
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-dim">{label}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-11 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-cyan/70 bg-electric/30 text-ink shadow-[0_0_14px_-4px_rgba(65,214,255,0.7)]"
          : "border-(--panel-edge) text-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
