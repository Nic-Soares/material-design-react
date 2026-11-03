# Contributing

Thanks for your interest. Bug reports and suggestions are welcome through
[issues](https://github.com/Nic-Soares/material-design-react/issues). This
file describes how the library is developed.

## Before you start

- Set up the project: [`docs/runbooks/local-setup.md`](docs/runbooks/local-setup.md).
- Read the decisions behind the library: [`docs/adr/`](docs/adr/).
- See what is planned: [`docs/planning/ROADMAP.md`](docs/planning/ROADMAP.md).

## Workflow

- `main` holds the latest work; changes arrive through short-lived branches
  named `ep-XX-<slug>` or `st-XX.Y-<slug>` after the roadmap item.
- Pull requests are squash-merged. Until CI exists (roadmap `EP-01`),
  commits go straight to `main`.
- Commits are signed.

## Commit messages

```
Add the filled variant to Button

The body explains why the change is made and why this solution, not
what the diff already shows. Wrap it at about 72 columns so git log
reads well.
```

- The header is one line in the imperative ("Add", "Fix", "Make"), and makes
  sense on its own.
- No trailers, except `Reported-by:` when someone reported the issue.

## Changesets

A change to what is published (components, tokens, styles, types) adds a
changeset: `npm run changeset`. See
[`docs/runbooks/releases.md`](docs/runbooks/releases.md).

## Before opening a pull request

```sh
npm run check && npm run typecheck && npm run build
```

## Component definition of done

A component is done when:

1. It follows its Material Design 3 spec page (anatomy, variants, states,
   measurements); departures are documented.
2. It renders the right native element and forwards native props and `ref`
   ([ADR-004](docs/adr/004-native-first-api.md)).
3. Text, icons and navigation come from props; it imports nothing from an
   app ([ADR-005](docs/adr/005-icons-as-slots.md)).
4. It reads only `--md-sys-*` tokens, plus private variables of its own
   ([ADR-003](docs/adr/003-tokens-and-theming.md)).
5. Keyboard and focus work; roles and `aria-*` are right; axe passes in both
   themes.
6. Tests cover its behaviour, states and accessibility.
7. A Storybook page shows every variant and state, in light and dark.
8. A changeset describes it.
