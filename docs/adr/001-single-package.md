# ADR-001 — One package at the repository root

## Status
Accepted (2026-11-03; roadmap `EP-01`).

## Context
The repository started from the Turborepo starter: a pnpm workspace with two
Next.js apps (`apps/docs`, `apps/web`), shared ESLint and TypeScript config
packages, and the library in `packages/ui`. What the project needs is one
library and one place to document it. Every extra workspace adds a manifest,
a config and a build step to keep in sync, and Next.js brings a framework the
library's docs don't use.

## Decision
- The library is the repository: `package.json` and `src/` at the root.
- No workspaces, no Turborepo, no Next.js. Documentation runs from the same
  package (Storybook, `EP-02`).
- npm is the package manager, as in the projects that consume the library.

## Consequences
- One install, one lockfile, one set of scripts.
- If a second package is ever needed (say, a separate icons package), the
  repository becomes a workspace then, with a new ADR.
