"use client";

// Petits sons de plateau générés en WebAudio — aucun fichier à charger.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, at: number, dur: number, type: OscillatorType, gain: number) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + at;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sounds = {
  /** Bip de compte à rebours */
  tick: () => tone(660, 0, 0.12, "square", 0.06),
  /** Top départ */
  go: () => tone(990, 0, 0.3, "square", 0.08),
  /** Mot trouvé */
  found: () => {
    tone(523, 0, 0.12, "sine", 0.12);
    tone(784, 0.09, 0.2, "sine", 0.12);
  },
  /** Mot passé */
  pass: () => tone(220, 0, 0.18, "sawtooth", 0.05),
  /** Fin de manche */
  buzz: () => {
    tone(140, 0, 0.45, "sawtooth", 0.1);
    tone(110, 0, 0.45, "square", 0.08);
  },
  /** Victoire */
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.28, "triangle", 0.12));
  },
};

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* non supporté */
    }
  }
}
