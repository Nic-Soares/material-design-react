import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { colorRoles, colorVariable } from "../../src/color/tokens";
import { computed, toHex, useSchemeChanges } from "./useSchemeChanges";

// Storybook-only pages that show every token with the value it resolves to
// under the theme, contrast and motion picked in the toolbar.

const page: CSSProperties = {
  display: "grid",
  gap: 24,
  padding: 24,
  fontFamily: "var(--md-sys-typescale-body-medium-font)",
};

const caption: CSSProperties = {
  font: "var(--md-sys-typescale-label-medium-weight) var(--md-sys-typescale-label-medium-size) / var(--md-sys-typescale-label-medium-line-height) var(--md-sys-typescale-label-medium-font)",
  color: "var(--md-sys-color-on-surface-variant)",
  margin: 0,
};

const code: CSSProperties = { fontFamily: "ui-monospace, monospace" };

function Caption({ children }: { children: ReactNode }) {
  return <p style={caption}>{children}</p>;
}

/* Color */

function ColorSwatch({ role }: { role: (typeof colorRoles)[number] }) {
  useSchemeChanges();
  const swatch = useRef<HTMLDivElement>(null);
  const variable = colorVariable(role);

  return (
    <figure style={{ margin: 0, display: "grid", gap: 6 }}>
      <div
        ref={swatch}
        style={{
          height: 56,
          borderRadius: "var(--md-sys-shape-corner-medium)",
          border: "1px solid var(--md-sys-color-outline-variant)",
          background: `var(${variable})`,
        }}
      />
      <figcaption>
        <Caption>
          <span style={code}>{variable.replace("--md-sys-color-", "")}</span>
          <br />
          <span style={code}>
            {toHex(computed(swatch.current, "background-color"))}
          </span>
        </Caption>
      </figcaption>
    </figure>
  );
}

export function ColorTokens() {
  return (
    <div style={page}>
      <Caption>
        {colorRoles.length} roles as <span style={code}>--md-sys-color-*</span>.
        Switch theme and contrast in the toolbar.
      </Caption>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {colorRoles.map((role) => (
          <ColorSwatch key={role} role={role} />
        ))}
      </div>
    </div>
  );
}

/* Typography */

const typeRoles = ["display", "headline", "title", "body", "label"];
const typeSizes = ["large", "medium", "small"];

function TypeSample({ name }: { name: string }) {
  const prefix = `--md-sys-typescale-${name}`;
  const style: CSSProperties = {
    margin: 0,
    fontFamily: `var(${prefix}-font)`,
    fontWeight: `var(${prefix}-weight)`,
    fontSize: `var(${prefix}-size)`,
    lineHeight: `var(${prefix}-line-height)`,
    letterSpacing: `var(${prefix}-tracking)`,
    color: "var(--md-sys-color-on-surface)",
  };

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <Caption>
        <span style={code}>{name}</span>
      </Caption>
      <p style={style}>The quick brown fox</p>
    </div>
  );
}

export function TypographyTokens() {
  return (
    <div style={page}>
      <Caption>
        <span style={code}>--md-sys-typescale-&lt;style&gt;-font</span>,{" "}
        <span style={code}>-weight</span>, <span style={code}>-size</span>,{" "}
        <span style={code}>-line-height</span>,{" "}
        <span style={code}>-tracking</span>; emphasized styles under{" "}
        <span style={code}>--md-sys-typescale-emphasized-*</span>.
      </Caption>
      {typeRoles.flatMap((role) =>
        typeSizes.map((size) => (
          <div
            key={`${role}-${size}`}
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            <TypeSample name={`${role}-${size}`} />
            <TypeSample name={`emphasized-${role}-${size}`} />
          </div>
        )),
      )}
    </div>
  );
}

/* Shape */

const corners = [
  "none",
  "extra-small",
  "small",
  "medium",
  "large",
  "large-increased",
  "extra-large",
  "extra-large-increased",
  "extra-extra-large",
  "full",
];

export function ShapeTokens() {
  return (
    <div style={page}>
      <Caption>
        <span style={code}>--md-sys-shape-corner-*</span>
      </Caption>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {corners.map((corner) => (
          <figure key={corner} style={{ margin: 0, display: "grid", gap: 6 }}>
            <div
              style={{
                width: 120,
                height: 80,
                background: "var(--md-sys-color-primary-container)",
                borderRadius: `var(--md-sys-shape-corner-${corner})`,
              }}
            />
            <figcaption>
              <Caption>
                <span style={code}>{corner}</span>
              </Caption>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* Elevation */

export function ElevationTokens() {
  return (
    <div style={page}>
      <Caption>
        <span style={code}>--md-sys-elevation-level0</span> to{" "}
        <span style={code}>level5</span>, as box-shadow
      </Caption>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            style={{
              width: 120,
              height: 80,
              display: "grid",
              placeItems: "center",
              background: "var(--md-sys-color-surface-container-low)",
              color: "var(--md-sys-color-on-surface)",
              borderRadius: "var(--md-sys-shape-corner-medium)",
              boxShadow: `var(--md-sys-elevation-level${level})`,
            }}
          >
            <span style={code}>level{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Motion */

const springs = ["fast", "default", "slow"].flatMap((speed) =>
  ["spatial", "effects"].map((kind) => `${speed}-${kind}`),
);

function SpringDemo({ name, moved }: { name: string; moved: boolean }) {
  useSchemeChanges();
  const track = useRef<HTMLDivElement>(null);
  const duration = `--md-sys-motion-spring-${name}-duration`;
  const easing = `--md-sys-motion-spring-${name}-easing`;
  const isSpatial = name.endsWith("spatial");

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Caption>
        <span style={code}>{name}</span> ·{" "}
        <span style={code}>{computed(track.current, duration).trim()}</span>
      </Caption>
      <div
        ref={track}
        style={{
          position: "relative",
          height: 40,
          borderRadius: "var(--md-sys-shape-corner-full)",
          background: "var(--md-sys-color-surface-container-high)",
        }}
      >
        <div
          style={{
            position: "absolute",
            insetBlock: 4,
            insetInlineStart: 4,
            width: 32,
            borderRadius: "var(--md-sys-shape-corner-full)",
            background:
              !isSpatial && moved
                ? "var(--md-sys-color-tertiary)"
                : "var(--md-sys-color-primary)",
            transform: isSpatial && moved ? "translateX(240px)" : "none",
            transition: `${isSpatial ? "transform" : "background-color"} var(${duration}) var(${easing})`,
          }}
        />
      </div>
    </div>
  );
}

export function MotionTokens() {
  const [moved, setMoved] = useState(false);

  return (
    <div style={page}>
      <Caption>
        Springs as <span style={code}>-easing</span> and{" "}
        <span style={code}>-duration</span> pairs. Spatial springs move the dot
        and may overshoot; effects springs change its color. Switch the motion
        scheme in the toolbar.
      </Caption>
      <button
        type="button"
        onClick={() => setMoved((value) => !value)}
        style={{ justifySelf: "start", ...code }}
      >
        Play
      </button>
      <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
        {springs.map((name) => (
          <SpringDemo key={name} name={name} moved={moved} />
        ))}
      </div>
    </div>
  );
}
