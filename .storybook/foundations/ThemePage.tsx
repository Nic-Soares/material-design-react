import { type CSSProperties, useId, useState } from "react";
import {
  type ContrastLevel,
  createScheme,
  type SchemeOptions,
  type SpecVersion,
  schemeCss,
  type Variant,
} from "../../src/color";

// A Storybook-only page to build a color scheme from a source color with the
// /color entry point, see it in light and dark, and copy its CSS.

const variants: Variant[] = [
  "tonal-spot",
  "neutral",
  "vibrant",
  "expressive",
  "fidelity",
  "content",
  "monochrome",
  "rainbow",
  "fruit-salad",
];
const contrasts: ContrastLevel[] = ["standard", "medium", "high"];
const specs: SpecVersion[] = ["2021", "2025"];

const label: CSSProperties = {
  display: "grid",
  gap: 4,
  font: "var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) / var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font)",
  color: "var(--md-sys-color-on-surface)",
};

const code: CSSProperties = { fontFamily: "ui-monospace, monospace" };

function Select<T extends string>({
  text,
  value,
  options,
  onChange,
}: {
  text: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <span style={label}>
      <label htmlFor={id}>{text}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
  );
}

const roleSamples: [string, string][] = [
  ["primary", "on-primary"],
  ["primary-container", "on-primary-container"],
  ["secondary", "on-secondary"],
  ["secondary-container", "on-secondary-container"],
  ["tertiary", "on-tertiary"],
  ["tertiary-container", "on-tertiary-container"],
  ["error", "on-error"],
  ["error-container", "on-error-container"],
];

const surfaces = [
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
];

/** One theme rendered with the scheme's variables. */
function Preview({
  theme,
  scheme,
}: {
  theme: "light" | "dark";
  scheme: Record<string, string>;
}) {
  return (
    <section
      data-theme={theme}
      style={{
        ...scheme,
        display: "grid",
        gap: 12,
        padding: 16,
        borderRadius: "var(--md-sys-shape-corner-large)",
        background: "var(--md-sys-color-surface)",
        color: "var(--md-sys-color-on-surface)",
        border: "1px solid var(--md-sys-color-outline-variant)",
      }}
    >
      <h3
        style={{
          margin: 0,
          font: "var(--md-sys-typescale-title-medium-weight) var(--md-sys-typescale-title-medium-size) / var(--md-sys-typescale-title-medium-line-height) var(--md-sys-typescale-title-medium-font)",
        }}
      >
        {theme === "light" ? "Light" : "Dark"}
      </h3>
      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {roleSamples.map(([background, foreground]) => (
          <div
            key={background}
            style={{
              ...code,
              fontSize: 12,
              padding: "12px 10px",
              borderRadius: "var(--md-sys-shape-corner-medium)",
              background: `var(--md-sys-color-${background})`,
              color: `var(--md-sys-color-${foreground})`,
            }}
          >
            {background}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {surfaces.map((surface) => (
          <div
            key={surface}
            title={surface}
            style={{
              flex: 1,
              height: 32,
              borderRadius: "var(--md-sys-shape-corner-small)",
              background: `var(--md-sys-color-${surface})`,
              border: "1px solid var(--md-sys-color-outline-variant)",
            }}
          />
        ))}
      </div>
      <p
        style={{
          margin: 0,
          color: "var(--md-sys-color-on-surface-variant)",
          font: "var(--md-sys-typescale-body-medium-weight) var(--md-sys-typescale-body-medium-size) / var(--md-sys-typescale-body-medium-line-height) var(--md-sys-typescale-body-medium-font)",
        }}
      >
        Body text on the surface, in on-surface-variant.
      </p>
    </section>
  );
}

export function ThemePage() {
  const [sourceColor, setSourceColor] = useState("#6750A4");
  const [variant, setVariant] = useState<Variant>("tonal-spot");
  const [contrast, setContrast] = useState<ContrastLevel>("standard");
  const [spec, setSpec] = useState<SpecVersion>("2021");
  const [copied, setCopied] = useState(false);
  const cssId = useId();

  const options: SchemeOptions = { sourceColor, variant, spec };
  const scheme = createScheme({ ...options, contrast });
  const css = schemeCss(options);

  const copy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      <p style={{ ...label, margin: 0, fontWeight: 400 }}>
        Build a scheme from any color with the <span style={code}>/color</span>{" "}
        entry point — the same algorithm as Material Theme Builder with spec
        2021.
      </p>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          alignItems: "end",
        }}
      >
        <fieldset style={{ ...label, border: 0, margin: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>Source color</legend>
          <span style={{ display: "flex", gap: 8 }}>
            <input
              type="color"
              value={sourceColor}
              aria-label="Pick the source color"
              onChange={(event) => setSourceColor(event.target.value)}
            />
            <input
              type="text"
              value={sourceColor}
              aria-label="Source color as hex"
              pattern="#[0-9a-fA-F]{6}"
              style={{ ...code, width: "8ch" }}
              onChange={(event) => {
                if (/^#[0-9a-f]{6}$/i.test(event.target.value)) {
                  setSourceColor(event.target.value);
                }
              }}
            />
          </span>
        </fieldset>
        <Select
          text="Variant"
          value={variant}
          options={variants}
          onChange={setVariant}
        />
        <Select
          text="Contrast (preview)"
          value={contrast}
          options={contrasts}
          onChange={setContrast}
        />
        <Select text="Spec" value={spec} options={specs} onChange={setSpec} />
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <Preview theme="light" scheme={scheme} />
        <Preview theme="dark" scheme={scheme} />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label htmlFor={cssId} style={label}>
            CSS — every theme and contrast level, ready to paste
          </label>
          <button type="button" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </span>
        <textarea
          id={cssId}
          readOnly
          value={css}
          rows={12}
          style={{ ...code, fontSize: 12, width: "100%" }}
        />
      </div>
    </div>
  );
}
