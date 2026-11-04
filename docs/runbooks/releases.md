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

When `main` holds the changesets for the next release. `main` only takes
pull requests, so the version bump is one too:

```sh
git switch main && git pull
git switch -c release-X.Y.Z
npm run version          # bumps package.json, writes CHANGELOG.md, deletes the changesets
npm install              # updates the version in package-lock.json
npm run check && npm run typecheck && npm run build && npm run smoke
git commit -am "Release X.Y.Z"
git push -u origin release-X.Y.Z
gh pr create --fill      # then merge it once CI passes
```

The commit body lists nothing new: the release notes are in `CHANGELOG.md`.

## 3. Publish

Publishing is the `Release` workflow (`.github/workflows/release.yml`), and
only a GitHub Release starts it. On the merged release commit:

```sh
git switch main && git pull
git tag -s vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --verify-tag --title vX.Y.Z --notes "<the CHANGELOG.md section>"
```

The workflow checks that the tag matches `package.json`, runs the checks and
the smoke test, and runs `npm publish --provenance`, so every version on npm
links back to the commit and run that built it. A version on npm can't be
replaced: a mistake means a new patch version (`npm deprecate` the bad one).

## 4. Before the first publish

Done once, by the npm account owner:

- [ ] The npm account owns the `@nic-soares` scope (`npm whoami` →
      `nic-soares`)
- [ ] `npm pack --dry-run` lists only `dist/`, the shipped `src/`,
      `README.md`, `LICENSE`, `CHANGELOG.md`, `THIRD_PARTY_LICENSES.md` and
      `package.json`
- [ ] Trusted publishing on npmjs.com: the package's Settings → Trusted
      publisher → GitHub Actions, with owner `Nic-Soares`, repository
      `material-design-react`, workflow `release.yml` and environment
      `npm`. No token is stored anywhere.
- [ ] If npm only offers that setting once the package exists, publish
      `0.1.0` with a token instead: create a granular access token
      (read and write on `@nic-soares`, short expiry), save it as the
      `NPM_TOKEN` repository secret, run the release, then set up trusted
      publishing and delete both the secret and the token.
- [ ] Optional: in GitHub, Settings → Environments → `npm` → Required
      reviewers, so each publish waits for an approval.
