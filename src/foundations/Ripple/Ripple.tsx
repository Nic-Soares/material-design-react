/**
 * Derived from Material Web's ripple (ripple/internal/ripple.ts),
 * Copyright 2022 Google LLC, SPDX-License-Identifier: Apache-2.0.
 * Modified: ported to React, separate wave elements, tokens for opacity and
 * easing, no hover state. See THIRD_PARTY_LICENSES.md.
 */
import { useEffect, useRef } from "react";
import styles from "./Ripple.module.css";

// The press grows from the pointer to cover the surface, lasts at least
// MINIMUM_PRESS_MS and fades out on release while it keeps growing. Keyboard
// clicks grow from the center. Each press gets its own wave, so a new click
// never snaps the previous one back. Waves are real elements, not ::after:
// Safari can't animate pseudo-elements with Web Animations.
const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const FADE_IN_MS = 105;
const FADE_OUT_MS = 375;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
// Wait before reacting to touch, so a scroll or swipe doesn't ripple
const TOUCH_DELAY_MS = 150;

type State = "inactive" | "touch-delay" | "holding" | "waiting-for-click";

interface Press {
  wave: HTMLSpanElement;
  start: number;
}

export interface RippleProps {
  /** Stops reacting to presses. */
  disabled?: boolean;
  /** Runs once a released wave has fully faded. */
  onFaded?: () => void;
}

/** Whether the browser can animate the waves (jsdom can't). */
export const canRipple = () =>
  typeof document !== "undefined" &&
  typeof document.documentElement.animate === "function";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The M3 pressed state: a wave in the content color that grows from the
 * pointer. Place it inside an interactive element with
 * `position: relative` and `overflow: hidden`; it listens to the nearest
 * control, so keyboard clicks ripple too.
 *
 * Color and opacity follow `--md-ripple-pressed-color` (the content color by
 * default) and `--md-ripple-pressed-opacity` (the M3 pressed state opacity).
 */
export function Ripple({ disabled = false, onFaded }: RippleProps) {
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const onFadedRef = useRef(onFaded);
  onFadedRef.current = onFaded;

  useEffect(() => {
    const surface = surfaceRef.current;
    if (disabled || !surface) return;
    const control =
      surface.closest<HTMLElement>("button, a, [role='button'], [tabindex]") ??
      surface.parentElement;
    if (!control) return;

    // matchMedia is missing in some environments (jsdom): no reduced motion
    const reduced =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : undefined;
    const animates = canRipple();
    let state: State = "inactive";
    let startEvent: PointerEvent | undefined;
    let current: Press | undefined;

    // Opacity and easing come from the tokens, read when a press starts so a
    // theme change applies to the next press
    const tokens = () => {
      const style = getComputedStyle(surface);
      const opacity = Number.parseFloat(
        style.getPropertyValue("--_pressed-opacity"),
      );
      return {
        opacity: Number.isNaN(opacity) ? 0.1 : opacity,
        easing:
          style.getPropertyValue("--_easing").trim() ||
          "cubic-bezier(0.2, 0, 0, 1)",
      };
    };

    // Marks a held press; the waves carry the visuals
    const setPressed = (pressed: boolean) => {
      if (pressed) surface.dataset.pressed = "";
      else delete surface.dataset.pressed;
    };

    const fadeOut = (wave: HTMLSpanElement, opacity: number) => {
      const done = () => {
        wave.remove();
        onFadedRef.current?.();
      };
      if (!animates) {
        done();
        return;
      }
      wave
        .animate(
          { opacity: [opacity, 0] },
          { duration: FADE_OUT_MS, easing: "linear", fill: "forwards" },
        )
        .finished.catch(() => undefined)
        .then(done);
    };

    let pressOpacity = 0.1;

    const startPress = (event?: PointerEvent) => {
      if (current) fadeOut(current.wave, pressOpacity);
      setPressed(true);
      const wave = document.createElement("span");
      wave.className = styles.wave ?? "";
      surface.append(wave);
      current = { wave, start: performance.now() };
      if (!animates) return;

      const { opacity, easing } = tokens();
      pressOpacity = opacity;
      const { left, top, width, height } = surface.getBoundingClientRect();
      const maxDim = Math.max(width, height);
      const softEdge = Math.max(
        SOFT_EDGE_CONTAINER_RATIO * maxDim,
        SOFT_EDGE_MINIMUM_SIZE,
      );
      const initial = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
      const scale = (Math.hypot(width, height) + PADDING + softEdge) / initial;
      const origin = event
        ? { x: event.clientX - left, y: event.clientY - top }
        : { x: width / 2, y: height / 2 };
      const from = `${origin.x - initial / 2}px, ${origin.y - initial / 2}px`;
      const to = `${(width - initial) / 2}px, ${(height - initial) / 2}px`;
      const end = `translate(${to}) scale(${scale})`;

      wave.style.width = wave.style.height = `${initial}px`;
      wave.animate(
        {
          transform: reduced?.matches
            ? [end, end]
            : [`translate(${from}) scale(1)`, end],
        },
        { duration: PRESS_GROW_MS, easing, fill: "forwards" },
      );
      wave.animate(
        { opacity: [0, opacity] },
        { duration: FADE_IN_MS, easing: "linear", fill: "forwards" },
      );
    };

    const endPress = async () => {
      startEvent = undefined;
      state = "inactive";
      const press = current;
      if (!press) return;
      const elapsed = performance.now() - press.start;
      if (animates && elapsed < MINIMUM_PRESS_MS) {
        await wait(MINIMUM_PRESS_MS - elapsed);
      }
      // A newer press took over; it already faded this wave
      if (current !== press) return;
      current = undefined;
      setPressed(false);
      fadeOut(press.wave, pressOpacity);
    };

    const isTouch = (event: PointerEvent) => event.pointerType === "touch";

    // Primary pointer, the one that started the press, holding the main
    // button (or a touch)
    const reacts = (event: PointerEvent) => {
      if (!event.isPrimary) return false;
      if (startEvent && startEvent.pointerId !== event.pointerId) return false;
      if (event.type === "pointerleave") return !isTouch(event);
      return isTouch(event) || event.buttons === 1;
    };

    const onPointerDown = async (event: PointerEvent) => {
      if (!reacts(event)) return;
      startEvent = event;
      if (!isTouch(event)) {
        state = "waiting-for-click";
        startPress(event);
        return;
      }
      state = "touch-delay";
      await wait(TOUCH_DELAY_MS);
      if (state !== "touch-delay") return;
      state = "holding";
      startPress(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!reacts(event)) return;
      if (state === "holding") {
        state = "waiting-for-click";
      } else if (state === "touch-delay") {
        state = "waiting-for-click";
        startPress(startEvent);
      }
    };

    const onPointerLeave = (event: PointerEvent) => {
      // A mouse or pen press released outside the control
      if (reacts(event) && state !== "inactive") endPress();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (reacts(event)) endPress();
    };

    const onClick = () => {
      if (state === "waiting-for-click") {
        endPress();
      } else if (state === "inactive") {
        // Keyboard (Enter/Space) click: grow from the center
        startPress();
        endPress();
      }
    };

    const onContextMenu = () => endPress();

    const listeners = [
      ["pointerdown", onPointerDown],
      ["pointerup", onPointerUp],
      ["pointerleave", onPointerLeave],
      ["pointercancel", onPointerCancel],
      ["click", onClick],
      ["contextmenu", onContextMenu],
    ] as const;
    for (const [type, listener] of listeners) {
      control.addEventListener(type, listener as EventListener);
    }
    return () => {
      for (const [type, listener] of listeners) {
        control.removeEventListener(type, listener as EventListener);
      }
      surface.replaceChildren();
    };
  }, [disabled]);

  return <span ref={surfaceRef} className={styles.ripple} aria-hidden="true" />;
}
