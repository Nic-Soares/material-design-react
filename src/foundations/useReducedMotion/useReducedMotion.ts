import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const query = () =>
  typeof window === "undefined" || typeof window.matchMedia !== "function"
    ? undefined
    : window.matchMedia(QUERY);

/**
 * Whether the user asked for less motion, for animations CSS can't turn off
 * by itself (Web Animations, SMIL). False where matchMedia is missing (the
 * server, jsdom).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => query()?.matches ?? false);

  useEffect(() => {
    const list = query();
    if (!list) return;
    const update = () => setReduced(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, []);

  return reduced;
}
