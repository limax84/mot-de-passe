"use client";

import { useEffect, useState } from "react";
import { sounds } from "@/lib/sound";

export default function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (n === 0) {
      sounds.go();
      onDone();
      return;
    }
    sounds.tick();
    const id = setTimeout(() => setN((v) => v - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <span
        key={n}
        className="countdown-digit font-display text-9xl text-cyan"
        style={{ textShadow: "0 0 50px rgba(65,214,255,0.8)" }}
      >
        {n}
      </span>
    </div>
  );
}
