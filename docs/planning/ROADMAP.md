# Development Roadmap — Material Design React

**Repository:** `material-design-react` — a React component library that implements Material Design 3 (including M3 Expressive), published to npm as `@nic-soares/material-design-react`
**Consumers:** [`benefits-transactions-analytics`](https://github.com/Nic-Soares/benefits-transactions-analytics) (its `EP-05` depends on this roadmap), [`my-portfolio`](https://github.com/Nic-Soares/my-portfolio)
**Last updated:** 2026-11-03

---

## 0. Status board

| Epic | Status | Where the work lives |
|---|---|---|
| `EP-01` Repository baseline | ✅ Done 2026-11-03 — npm scope still to confirm (`ST-01.3`) | repo root, `.github/`, `docs/` |
| `EP-02` Docs and test infrastructure | ⬜ Not started | `.storybook/`, test config |
| `EP-03` Design tokens | ⬜ Not started | `src/tokens/` |
| `EP-04` Foundations | ⬜ Not started | `src/foundations/` |
| `EP-05` Components from the portfolio | ⬜ Not started | `src/components/` (source: `my-portfolio`) |
| `EP-06` Release `0.1.0` | ⬜ Not started | npm, GitHub Releases |
| `EP-07` New components for the dashboard | ⬜ Not started | `src/components/` |
| `EP-08` Release `0.2.0` | ⬜ Not started | npm, GitHub Releases |
| `EP-09` Portfolio consumes the library | ⬜ Not started | **`my-portfolio`** |

### Git workflow

- GitHub Flow: `main` + short-lived branches, merged by pull request
  (squash). No `develop`.
- Before `ST-01.6` added CI and the `main` ruleset, commits went straight to
  `main`; since then, every change goes through a pull request.
- Branch names: `ep-XX-<slug>` or `st-XX.Y-<slug>`.
- Commits: one-line imperative header, a body that explains why, no trailers.
  The commits before this roadmap used Conventional Commits; from here on
  they don't.
- Versions come from Changesets, not from commit messages: every pull request
  that changes the published package adds a changeset.

---

## 1. Assumptions

1. **Material Design 3 is the specification.** Components follow the M3 and
   M3 Expressive guidelines and token names (`md.sys.*`). Where the library
   departs from the spec, the component's docs say so and why.
2. **The component base already exists — in `my-portfolio`.** Seventeen
   components and a token set were built there for the site. They are
   extracted, not rewritten: the visual behaviour stays, the API and the
   coupling change (`EP-05`).
3. **A library, not an app.** No component imports routing, i18n, app hooks,
   app state or content. Text comes in through props; navigation through
   `href` or a render prop; icons as `ReactNode`.
4. **The consumer owns the theme.** Components read only `--md-sys-*` CSS
   variables. The library ships default values; a consumer replaces them by
   setting the same variables — no JavaScript theme provider.
5. **Native first.** Each component renders the right HTML element, forwards
   its native props and `ref` (React 19), and uses native `aria-*`
   attributes.
6. **Accessible by default.** Keyboard, focus, roles and contrast are part of
   a component's definition of done, checked by tests (`EP-02`).
7. **One package, ESM only**, React 19 as a peer dependency, `0.x` while the
   API settles.

### Decisions (settled 2026-11-03)

| Topic | Decision |
|---|---|
| Repository shape | One package at the root (`src/`); no Turborepo, no workspaces |
| Runtime / package manager | Node 26 (LTS), npm |
| Language | TypeScript 7, strict |
| Build | Vite library mode (CSS Modules, Lightning CSS) + `tsc` for declarations |
| Output | ESM; `exports`: `.` and `./styles.css`; `sideEffects: ["**/*.css"]` |
| Styling | CSS Modules + CSS variables; no CSS-in-JS, no Sass |
| Docs | Storybook 10 (`@storybook/react-vite`) with the accessibility addon |
| Tests | Vitest + Testing Library (jsdom) + axe |
| Lint / format | Biome |
| Versioning / release | Changesets; publish to npm with provenance from CI |
| Icons | `ReactNode` slots; the docs show how to use Material Symbols |
| Theme switch | Light on `:root`, dark on `[data-theme="dark"]` and `prefers-color-scheme: dark` |
| Breakpoints | The five M3 window size classes: 600 / 840 / 1200 / 1600 |
| License | MIT |

Removed from the starter: Turborepo, the two Next.js apps (`apps/docs`,
`apps/web`), the `eslint-config` and `typescript-config` packages, ESLint,
Prettier, tsup (in maintenance mode since August 2025), CommonJS output, the
`"use client"` directive.

---

## 2. Execution order

```
EP-01 Baseline ──► EP-02 Docs/tests ──► EP-03 Tokens ──► EP-04 Foundations
                                                              │
                                                              ▼
                                         EP-05 Components from the portfolio
                                                              │
                                                              ▼
                                                     EP-06 Release 0.1.0
                                                              │
                                     ┌────────────────────────┴───────────┐
                                     ▼                                    ▼
                    EP-07 New components for the dashboard     EP-09 Portfolio migration
                                     │                          (needs EP-05 + EP-06;
                                     ▼                           TabbedNavigation and
                            EP-08 Release 0.2.0                  layout pieces after EP-07)
```

- `0.1.0` is the first version `benefits-transactions-analytics` can install:
  it unblocks that project's web foundation (`EP-07` there).
- `0.2.0` completes what the dashboard pages need (`EP-09` there).

---

## EP-01 — Repository baseline

**Dependencies:** none. **Size:** M.

### ST-01.1 — Single-package layout

- [x] Remove `turbo.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `apps/`,
      `packages/eslint-config`, `packages/typescript-config`
- [x] Move the package to the root: `src/`, `package.json`
- [x] `src/index.ts` as the public entry point (no `"use client"`)

### ST-01.2 — Toolchain

- [x] `.nvmrc` (26), npm, `package-lock.json`
- [x] `tsconfig.json` (strict, `jsx: react-jsx`, declarations)
- [x] `biome.json`
- [x] `vite.config.ts` in library mode: ESM, React and React DOM external,
      CSS Modules, Lightning CSS (custom media)
- [x] `tsc` emits declarations to `dist/`

### ST-01.3 — Package manifest

- [x] `name: "@nic-soares/material-design-react"`, `version: "0.0.0"`,
      `license: "MIT"`, `type: "module"`
- [x] `exports`: `.` (types + import) and `./styles.css`
- [x] `sideEffects: ["**/*.css"]`, `files: ["dist"]`
- [x] `peerDependencies`: React 19
- [x] Scripts: `build`, `typecheck`, `lint`, `format`, `check`, `changeset`,
      `version`, `release` — `dev` (Storybook) and `test` come with `EP-02`
- [ ] Confirm the npm account and the `@nic-soares` scope

### ST-01.4 — Repository files

- [x] `LICENSE` (MIT), `CHANGELOG.md` (managed by Changesets),
      `.gitattributes`, `.gitignore`
- [x] README: what the library is, install, theming, usage, links — and
      only links to documents that exist
- [x] `docs/adr/`: `001` single package, `002` Vite library mode, `003`
      tokens and theming contract, `004` native-first component API,
      `005` icons as slots
- [x] `docs/runbooks/`: `releases.md`, `local-setup.md`,
      `dependency-upgrades.md`
- [x] `CONTRIBUTING.md`: component definition of done (`§3`), branches,
      commits, changesets

### ST-01.5 — Versioning

- [x] Changesets configured (`.changeset/config.json`), public access

### ST-01.6 — CI and GitHub

- [x] `ci.yml`: `npm ci`, Biome, typecheck, build, package contents — on pull
      requests and pushes to `main` (tests and the Storybook build join in
      `EP-02`)
- [x] Repository: description, topics; Wiki and Projects off; squash merge
      only, with the pull request title and description as the commit
      message; delete head branches — homepage set to the Storybook URL in
      `EP-02`
- [x] Ruleset `main`: require PR, passing CI, signed commits; block force push
      and deletion
- [x] Secret scanning and push protection on

---

## EP-02 — Docs and test infrastructure

**Dependencies:** `EP-01`. **Size:** S.

### ST-02.1 — Storybook

- [ ] Storybook 10 with `@storybook/react-vite`
- [ ] Accessibility addon
- [ ] Toolbar to switch light and dark themes
- [ ] An introduction page: install, theming, icons

### ST-02.2 — Tests

- [ ] Vitest + Testing Library + jsdom
- [ ] An axe helper every component test uses
- [ ] Coverage report in CI

### ST-02.3 — Published docs

- [ ] Storybook deployed on every push to `main` (Cloudflare, like the
      consumers)

---

## EP-03 — Design tokens

**Dependencies:** `EP-01`. **Size:** M. **Source:** `my-portfolio`
`client/src/styles/`.

All tokens use the M3 names as CSS variables (`--md-sys-<group>-<name>`).

### ST-03.1 — Color

- [ ] Light and dark schemes with every M3 color role (taken from the
      portfolio's `themes/light.css` and `themes/dark.css`)
- [ ] Light on `:root`; dark on `[data-theme="dark"]` and
      `@media (prefers-color-scheme: dark)` when no theme is set

### ST-03.2 — State

- [ ] Opacity tokens: `--md-sys-state-hover-state-layer-opacity` (0.08),
      focus (0.10), pressed (0.10), dragged (0.16)
- [ ] State layers computed with `color-mix()` from the color role and the
      opacity — replacing the portfolio's ~30 precomputed
      `--md-state-layers-light-*` variables per theme, which break when a
      consumer changes colors

### ST-03.3 — Typography

- [ ] Type scale renamed to `--md-sys-typescale-<role>-<size>-<property>`
      (display, headline, title, body, label × large, medium, small), plus
      the emphasized weights
- [ ] Roboto as the default font family, overridable; the docs show how to
      self-host it (the library does not ship the font files)

### ST-03.4 — Shape, elevation, motion

- [ ] Shape: the portfolio's corner scale (including M3 Expressive
      `*-increased` values)
- [ ] Elevation renamed to `--md-sys-elevation-level0`…`level5`, one set
      that adapts to the theme
- [ ] Motion (new): easing and duration tokens

### ST-03.5 — Window size classes

- [ ] Custom media for the five M3 classes: compact (< 600), medium
      (600–839), expanded (840–1199), large (1200–1599), extra-large (≥ 1600)
      — the portfolio merges medium and expanded
- [ ] Compiled at build time, so consumers need no CSS tooling

### ST-03.6 — Delivery

- [ ] `styles.css` carries the tokens and a minimal base (no global reset
      beyond what components need)
- [ ] Storybook page listing every token with its value in both themes
- [ ] ADR `003` documents the theming contract consumers rely on

---

## EP-04 — Foundations

**Dependencies:** `EP-03`. **Size:** S. **Source:** `my-portfolio` `Ripple`,
state layer styles, `useReducedMotion`.

- [ ] Ripple (pressed state), with tests (from the portfolio)
- [ ] State layer and focus ring styles shared by every interactive
      component
- [ ] Internal `useReducedMotion`
- [ ] Icon slot convention: size and color from the component, content from
      the consumer

---

## EP-05 — Components from the portfolio

**Dependencies:** `EP-04`. **Size:** L. **Source:** `my-portfolio`
`client/src/components/`.

Every story follows the definition of done (`§3`).

### ST-05.1 — Buttons

- [ ] Button: `variant` (filled, tonal, outlined, text, elevated), `size`
      (xsmall…xlarge), `shape` (round, square), toggle; label in a `<span>`,
      not a `<p>`; no default icon
- [ ] Icon button
- [ ] Connected button group (single and multiple selection)

### ST-05.2 — Selection and input

- [ ] Chip: assist, filter, input (with remove), suggestion — text from props,
      no i18n
- [ ] Search bar — labels from props, no i18n

### ST-05.3 — Menus and feedback

- [ ] Menu: generic placement, keyboard navigation (already there)
- [ ] Linear progress — label from props
- [ ] Skeleton

### ST-05.4 — App structure

- [ ] Top app bar: slots for leading, title and trailing content (no logo,
      no app actions)
- [ ] Navigation rail and navigation bar: items take `href` or a render prop
      for the consumer's router (no `react-router` import)

### Stays in the portfolio

CodeBlock, CompanyLogo, Diagram, Markdown, FitLines, ImageViewer, `decor/*`,
Footer, StateLayout, TabbedNavigation (replaced by Tabs in `EP-07`), the
portfolio's `navigation/` content.

---

## EP-06 — Release `0.1.0`

**Dependencies:** `EP-05`. **Size:** S.

- [ ] Publish workflow: on a version pull request merged by Changesets, build
      and `npm publish --provenance`
- [ ] `0.1.0` on npm and a GitHub Release
- [ ] Installed in a clean Vite app as a smoke test (styles load, tree-shaking
      keeps CSS)

---

## EP-07 — New components for the dashboard

**Dependencies:** `EP-06`. **Size:** L.

Foundation (unblocks `benefits-transactions-analytics` `EP-07`, together
with `0.1.0`):

- [ ] Card (elevated, filled, outlined)
- [ ] Divider
- [ ] Navigation drawer (modal, for compact windows)
- [ ] Circular progress

Interaction (needed by `benefits-transactions-analytics` `EP-09`):

- [ ] Tabs (primary, secondary)
- [ ] Select (menu-based)
- [ ] Tooltip (plain, rich)
- [ ] Dialog (basic, full-screen)
- [ ] Date range picker (docked and modal) — the largest item

---

## EP-08 — Release `0.2.0`

**Dependencies:** `EP-07`. **Size:** S.

- [ ] `0.2.0` on npm with the `EP-07` components

---

## EP-09 — Portfolio consumes the library *(in `my-portfolio`)*

**Dependencies:** `EP-06` (components from `EP-05`), `EP-08` (Tabs and the
rest). **Size:** M.

- [ ] Install the package; replace the portfolio's tokens with the library's
      `styles.css` plus the portfolio's color values
- [ ] Replace each extracted component with the library's, adapting to the
      new API (`variant`/`size`/`shape`, native props)
- [ ] Delete the portfolio's copies
- [ ] Replace TabbedNavigation with Tabs where it fits

---

## 3. Component definition of done

The definition of done lives in
[`CONTRIBUTING.md`](../../CONTRIBUTING.md#component-definition-of-done), so
there is one copy to keep up to date. Every component story in `EP-05` and
`EP-07` closes against it.
