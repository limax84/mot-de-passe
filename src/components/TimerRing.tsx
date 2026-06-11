"use client";

export default function TimerRing({
  totalTenths,
  tenths,
}: {
  totalTenths: number;
  tenths: number;
}) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const ratio = totalTenths > 0 ? tenths / totalTenths : 0;
  const seconds = Math.ceil(tenths / 10);
  const critical = seconds <= 5;
  const color = critical ? "var(--danger)" : seconds <= 10 ? "var(--gold)" : "var(--cyan)";

  return (
    <div className="relative h-28 w-28" role="timer" aria-label={`${seconds} secondes restantes`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(122,162,255,0.18)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ratio)}
          style={{
            transition: "stroke-dashoffset 120ms linear, stroke 300ms",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <span
        className={`font-display absolute inset-0 flex items-center justify-center text-4xl tabular-nums ${
          critical ? "text-danger" : "text-ink"
        }`}
      >
        {seconds}
      </span>
    </div>
  );
}
