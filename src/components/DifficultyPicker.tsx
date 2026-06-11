"use client";

import { DIFFICULTIES, type Difficulty } from "@/data/words";

export type DifficultyChoice = Difficulty | "melange";

const CHOICES: { id: DifficultyChoice; label: string; hint: string }[] = [
  ...DIFFICULTIES,
  { id: "melange", label: "Mélange", hint: "Un peu de tout" },
];

export default function DifficultyPicker({
  value,
  onChange,
}: {
  value: DifficultyChoice;
  onChange: (d: DifficultyChoice) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Difficulté">
      {CHOICES.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.id)}
            className={`rounded-xl border px-3 py-2.5 text-left transition ${
              active
                ? "border-cyan/70 bg-electric/25 shadow-[0_0_16px_-4px_rgba(65,214,255,0.6)]"
                : "border-(--panel-edge) bg-panel/40 hover:bg-panel"
            }`}
          >
            <span className="block font-semibold">{c.label}</span>
            <span className="block text-xs text-dim">{c.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
