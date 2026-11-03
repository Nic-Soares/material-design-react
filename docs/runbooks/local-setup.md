# Runbook — Local setup

## 1. Requirements

- [Node.js](https://nodejs.org) — the version in `.nvmrc`. With Homebrew:
  `brew install node`; with a version manager: `nvm use` or `fnm use`.
- npm — comes with Node.js.
- Git, with commit signing set up: the `main` ruleset (roadmap `EP-01`)
  accepts only signed commits.

## 2. Install

```sh
git clone git@github.com:Nic-Soares/material-design-react.git
cd material-design-react
npm install
```

## 3. Check that everything works

```sh
npm run check       # Biome: lint and format, applying fixes
npm run typecheck   # TypeScript
npm test            # Vitest: unit and accessibility tests
npm run build       # dist/: index.js, styles.css, type declarations
```

## 4. Docs

```sh
npm run dev         # Storybook on http://localhost:6006
```

Stories live next to their component (`src/**/*.stories.tsx`); the
introduction page, which belongs to no component, is
`.storybook/Introduction.mdx`.

## 5. Editor

Biome formats and lints; install its extension for your editor and make it
the default formatter for TypeScript, JSON and CSS. Editor settings are not
versioned.

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `tsc` reports options it doesn't know | An older TypeScript on the `PATH` | Run through npm (`npm run typecheck`), which uses the project's version |
| `npm install` warns about install scripts (`esbuild`, `fsevents`, `workerd`) | npm 11 asks before running install scripts | Nothing to do: each ships prebuilt binaries as optional dependencies, and the builds, Storybook and `wrangler deploy` all work without the scripts (checked 2026-11-03) |
