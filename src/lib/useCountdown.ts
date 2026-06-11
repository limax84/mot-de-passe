"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Compte à rebours en dixièmes de seconde, basé sur l'horloge réelle
 * (résiste aux throttlings de setInterval sur mobile).
 */
export function useCountdown(onExpire: () => void) {
  const [tenths, setTenths] = useState(0);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const start = useCallback((seconds: number) => {
    endAt.current = Date.now() + seconds * 1000;
    expired.current = false;
    setTenths(seconds * 10);
    setRunning(true);
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 100));
      setTenths(left);
      if (left <= 0 && !expired.current) {
        expired.current = true;
        setRunning(false);
        onExpireRef.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  return { tenths, seconds: Math.ceil(tenths / 10), running, start, stop };
}
