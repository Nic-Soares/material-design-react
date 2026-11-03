import axe, { type Result, type RunOptions } from "axe-core";

/**
 * Runs axe on a rendered element and fails with a readable list of
 * violations. Every component test calls it, in light and dark.
 *
 * `color-contrast` is off: jsdom has no layout or painting, so axe can't
 * measure contrast here. Contrast is checked in Storybook's accessibility
 * panel, which runs axe in a real browser.
 */
export async function expectNoA11yViolations(
  container: Element,
  options: RunOptions = {},
): Promise<void> {
  const results = await axe.run(container, {
    ...options,
    rules: { "color-contrast": { enabled: false }, ...options.rules },
  });

  if (results.violations.length > 0) {
    throw new Error(
      `Accessibility violations:\n\n${results.violations.map(format).join("\n\n")}`,
    );
  }
}

function format(violation: Result): string {
  const nodes = violation.nodes
    .map((node) => `    ${node.target.join(" ")}`)
    .join("\n");
  return `  ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${nodes}`;
}
