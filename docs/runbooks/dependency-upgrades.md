# Runbook — Dependency upgrades

`package.json` holds the version ranges; `package-lock.json` pins the exact
versions, transitive ones included. `.nvmrc` pins Node.js. React and React DOM
are both a peer dependency (the range consumers must satisfy) and a dev
dependency (the version the library is built and tested with).

---

## 1. See what's outdated

```sh
npm outdated
```

`Wanted` is the newest version inside the range; `Latest` may be a new major.

## 2. Upgrade inside the ranges (routine)

```sh
npm update
```

Only `package-lock.json` changes.

## 3. Upgrade past a range (major versions)

```sh
npm install -D vite@latest
```

Before doing it, read the package's changelog for the versions being skipped.
Biome is pinned to a version in `biome.json` (`$schema`): update the schema
URL with the package, and run `npx biome migrate --write`.

## 4. Upgrade React's peer range

Widening `peerDependencies` (for example to accept React 20) is a change for
consumers: it needs a changeset, and the library must be tested with that
version first.

## 5. Verify

```sh
npm run check && npm run typecheck && npm run build
```

Once tests and Storybook exist (roadmap `EP-02`), run them too.

## 6. Commit

`package.json` and `package-lock.json` go in one commit; breaking changes and
the code they required are described in its body. Add a row to the log below.

---

## Upgrade log

| Date | Change | Notes |
|---|---|---|
| 2026-11-03 | New toolchain: Vite 8, TypeScript 7, Biome 2, Lightning CSS, React 19.3 | Replaced the Turborepo starter (ADR-001, ADR-002) |
