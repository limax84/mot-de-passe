"use client";

export default function WordCard({ word }: { word: string }) {
  return (
    <div className="screen flex min-h-32 w-full items-center justify-center px-4 py-6">
      <span
        key={word}
        data-testid="mot-mystere"
        className="font-display text-center text-4xl uppercase leading-tight tracking-wider text-ink sm:text-5xl"
        style={{ textShadow: "0 0 24px rgba(65,214,255,0.6)" }}
      >
        {word.split("").map((ch, i) => (
          <span
            key={`${word}-${i}`}
            className="word-letter"
            style={{ animationDelay: `${i * 28}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </div>
  );
}
