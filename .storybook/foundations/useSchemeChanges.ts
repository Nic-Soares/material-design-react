import { useEffect, useState } from "react";

/**
 * Re-renders when the theme, contrast or motion attributes on <html> change,
 * so token pages can show the values those settings resolve to.
 */
export function useSchemeChanges(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-contrast", "data-motion"],
    });
    return () => observer.disconnect();
  }, []);

  return version;
}

/** A computed CSS property of an element, as the browser resolves it. */
export function computed(element: Element | null, property: string): string {
  return element ? getComputedStyle(element).getPropertyValue(property) : "";
}

/** `rgb(101, 85, 143)` → `#65558f`; anything else is returned as is. */
export function toHex(color: string): string {
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return color;
  return `#${match
    .slice(1, 4)
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}
