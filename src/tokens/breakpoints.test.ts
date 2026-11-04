import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { bundle } from "lightningcss";
import { describe, expect, it } from "vitest";
import { cssTransformTargets } from "../../vite.config";

// Compile a module that uses the window size classes as the library build
// does: Lightning CSS with custom media and the library's browser targets
// (without targets, Lightning CSS leaves @custom-media as written)
function compile(query: string): string {
  const dir = mkdtempSync(join(tmpdir(), "breakpoints-"));
  const file = join(dir, "module.css");
  writeFileSync(
    file,
    `@import "${resolve("src/tokens/breakpoints.css")}";\n@media (${query}) { .a { color: red; } }\n`,
  );
  const { code } = bundle({
    filename: file,
    targets: cssTransformTargets,
    drafts: { customMedia: true },
  });
  return code.toString();
}

describe("window size classes", () => {
  it.each([
    ["--compact", "(width < 600px)"],
    ["--medium", "(600px <= width < 840px)"],
    ["--expanded", "(840px <= width < 1200px)"],
    ["--large", "(1200px <= width < 1600px)"],
    ["--extra-large", "(width >= 1600px)"],
  ])("compiles %s to %s", (name, query) => {
    const css = compile(name);

    expect(css).toContain(`@media ${query}`);
    expect(css).not.toContain("@custom-media");
  });
});
