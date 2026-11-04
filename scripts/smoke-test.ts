// Installs the packed library in a clean Vite app and builds it, the way a
// consumer would (roadmap EP-06): the package must resolve from its
// exports, its stylesheet must load with the tokens and component styles,
// and tree-shaking must drop the components the app doesn't use.
//
// Usage: npm run build && node scripts/smoke-test.ts
import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const work = mkdtempSync(join(tmpdir(), "mdr-smoke-"));
const app = join(work, "app");

const run = (cwd: string, command: string, args: string[]) =>
  execFileSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" });

try {
  const [{ filename }] = JSON.parse(
    run(root, "npm", ["pack", "--json", "--pack-destination", work]),
  ) as [{ filename: string }];
  cpSync(join(root, "scripts/smoke-app"), app, { recursive: true });
  run(app, "npm", ["install", "--no-audit", "--no-fund", join(work, filename)]);
  run(app, "npm", ["run", "build"]);

  const assets = join(app, "dist/assets");
  const read = (extension: string) =>
    readdirSync(assets)
      .filter((file) => file.endsWith(extension))
      .map((file) => readFileSync(join(assets, file), "utf8"))
      .join("\n");
  const css = read(".css");
  const js = read(".js");

  const checks: [string, boolean][] = [
    [
      "the stylesheet has the color tokens",
      css.includes("--md-sys-color-primary"),
    ],
    [
      "the stylesheet has the typography tokens",
      css.includes("--md-sys-typescale-label-large-size"),
    ],
    ["the stylesheet has the button styles", /_button\b/.test(css)],
    ["the app bundles the Button", js.includes("aria-pressed")],
    ["the color helper is bundled", js.includes("--md-sys-color-")],
    ["unused components are tree-shaken (Menu)", !js.includes("menuitemradio")],
    [
      "unused components are tree-shaken (TopAppBar)",
      !js.includes("data-scrolled"),
    ],
  ];

  for (const [name, passed] of checks) {
    console.log(`${passed ? "✓" : "✗"} ${name}`);
  }
  if (checks.some(([, passed]) => !passed)) process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
