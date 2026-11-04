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
gh release create vX.Y.Z --verify-tag --title vX.Y.Z --notes "$(awk '/^## X.Y.Z/{f=1;next} /^## /{f=0} f' CHANGELOG.md)"
gh run watch             # wait until it finishes
```

The workflow checks that the tag matches `package.json`, runs the checks and
the smoke test, and **stages** the version with `npm stage publish
--provenance`: it is on npm but not public yet. Approve it with your 2FA:

```sh
npm stage list @nic-soares/material-design-react
npm stage approve <stage-id>
```

Approval publishes it, with provenance linking it to the commit and run
that built it. `npm stage reject <stage-id>` drops a bad one instead. A
published version can't be replaced: a mistake means a new patch version
(`npm deprecate` the bad one).

## 4. npm setup (done)

- The npm account `nic-soares` owns the `@nic-soares` scope, with 2FA.
- `0.1.0` and `0.2.0` were published with a short-lived granular token,
  since npm only configures trusted publishing on a package that exists.
  The `NPM_TOKEN` repository secret is deleted; revoke the token on
  npmjs.com too if it hasn't expired.
- Trusted publisher on npmjs.com: GitHub Actions, `Nic-Soares` /
  `material-design-react`, workflow `release.yml`, environment `npm`, with
  **Allow npm publish unchecked**, so CI can only stage and every version
  waits for a 2FA approval.
- Optional: in GitHub, Settings → Environments → `npm` → Required
  reviewers, so the workflow itself waits for an approval too.
