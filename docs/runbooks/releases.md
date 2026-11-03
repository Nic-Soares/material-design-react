# Runbook — Changesets and releases

Versions and release notes come from [Changesets](https://github.com/changesets/changesets),
not from commit messages. The package follows Semantic Versioning and stays at
`0.x` while the API settles: in `0.x`, a breaking change bumps the minor
version and everything else the patch.

---

## 1. Add a changeset to a change

Every pull request that changes what is published — components, tokens,
styles, types — adds a changeset:

```sh
npm run changeset
```

Pick the bump and write one or two sentences for the release notes, from the
consumer's point of view (what they can now do, or what they must change).
The command writes a Markdown file under `.changeset/`; commit it with the
change.

Docs, tests, CI and tooling changes need no changeset.

## 2. Cut a version

When `main` holds the changesets for the next release:

```sh
git switch main && git pull
npm run version          # bumps package.json, writes CHANGELOG.md, deletes the changesets
npm install              # updates the version in package-lock.json
npm run check && npm run typecheck && npm run build
git commit -am "Release X.Y.Z"
git tag -s vX.Y.Z -m "vX.Y.Z"
git push && git push origin vX.Y.Z
```

The commit body lists nothing new: the release notes are in `CHANGELOG.md`.

## 3. Publish

Publishing is automated in roadmap `EP-06`: a workflow builds the package and
runs `npm publish --provenance`, so every version on npm links back to the
commit and workflow that built it. Until then, nothing is published.

Then, in GitHub: Releases → Draft a new release → the tag, with its
`CHANGELOG.md` section as the notes.

## 4. Before the first publish

- [ ] The npm account owns the `@nic-soares` scope
- [ ] `npm pack --dry-run` lists only `dist/`, `README.md`, `LICENSE`,
      `CHANGELOG.md` and `package.json`
