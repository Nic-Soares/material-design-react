<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Status][status-shield]][roadmap-url]
[![CI][ci-shield]][ci-url]
[![License][license-shield]][license-url]
[![React][react-shield]][react-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Material Design 3][m3-shield]][m3-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Material Design React</h3>

  <p align="center">
    React components that implement Material Design 3 — native elements,
    accessible by default, themed with plain CSS variables.
    <br />
    <br />
    <a href="https://material-design-react.nicolassoares-santos.workers.dev"><strong>Documentation »</strong></a>
    <br />
    <br />
    <a href="https://material-design-react.nicolassoares-santos.workers.dev">View Docs</a>
    &middot;
    <a href="https://github.com/Nic-Soares/material-design-react/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Nic-Soares/material-design-react/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#principles">Principles</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Material Design React is a component library that follows the
[Material Design 3](https://m3.material.io) specification, including
M3 Expressive. It is built from the components of my portfolio site and is
the UI layer of
[Benefits Transactions Analytics](https://github.com/Nic-Soares/benefits-transactions-analytics).

> **Status:** early development. The package is set up; tokens and components
> are being added (see the [roadmap](docs/planning/ROADMAP.md)). Nothing is
> published to npm yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Principles

* **Material Design 3 is the specification.** Anatomy, variants, states and
  token names follow M3; any departure is documented.
* **Native first.** Each component renders the right HTML element and
  forwards its native props, `ref` and `aria-*` attributes.
* **Accessible by default.** Keyboard, focus, roles and contrast are part of
  every component, and tested.
* **You own the theme.** Components read only `--md-sys-*` CSS variables.
  Change the values and every component follows — no JavaScript theme
  provider.
* **No app dependencies.** No router, i18n or icon font is imposed: text and
  icons come in through props.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][react-shield]][react-url]
* [![TypeScript][typescript-shield]][typescript-url]
* [![Vite][vite-shield]][vite-url] — library mode
* [Lightning CSS](https://lightningcss.dev) — CSS Modules and custom media
* [Biome](https://biomejs.dev) — lint and format
* [Storybook](https://storybook.js.org) — docs, with the accessibility addon
* [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com)
  and [axe-core](https://github.com/dequelabs/axe-core) — tests

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* React 19 and React DOM 19

### Installation

> Not published yet — the first release is `0.1.0`
> ([roadmap](docs/planning/ROADMAP.md)).

```sh
npm install @nic-soares/material-design-react
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Import the stylesheet once, at the root of your app, then the components:

```tsx
import "@nic-soares/material-design-react/styles.css";
import { Button } from "@nic-soares/material-design-react";

export function App() {
  return <Button variant="filled">Save</Button>;
}
```

To change the theme, set the Material Design 3 system tokens:

```css
:root {
  --md-sys-color-primary: rgb(86 100 34);
  --md-sys-color-on-primary: rgb(255 255 255);
}
```

> The API above is the target of the roadmap; components are not available
> yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEVELOPMENT -->
## Development

Requires [Node.js](https://nodejs.org) (version in `.nvmrc`) and npm.

```sh
git clone git@github.com:Nic-Soares/material-design-react.git
cd material-design-react
npm install
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts Storybook on `http://localhost:6006` |
| `npm test` | Runs the unit and accessibility tests (Vitest) |
| `npm run coverage` | Runs the tests with a coverage report |
| `npm run build` | Builds `dist/`: ESM, `styles.css` and type declarations |
| `npm run build-storybook` | Builds the docs into `storybook-static/` |
| `npm run typecheck` | Type-checks the project |
| `npm run lint` | Lints with Biome |
| `npm run check` | Lints and formats with Biome, applying fixes |
| `npm run changeset` | Describes a change for the next release |

Setup details are in [`docs/runbooks/local-setup.md`](docs/runbooks/local-setup.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->
## Project Structure

```text
material-design-react/
├── .changeset/               # pending release notes (Changesets)
├── .github/workflows/        # CI and docs deploy
├── .storybook/               # Storybook: config, intro page, docs Worker
├── docs/
│   ├── adr/                  # architecture decisions
│   ├── planning/ROADMAP.md   # epics and stories
│   └── runbooks/             # releases, setup, upgrades, docs deploy
├── src/
│   ├── index.ts              # public API
│   └── test/                 # test setup and the axe helper (not published)
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── biome.json
├── package.json
├── tsconfig.json             # type-checking
├── tsconfig.build.json       # type declarations for dist/
└── vite.config.ts            # library build and tests
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Repository baseline
- [ ] Docs (Storybook) and test infrastructure
- [ ] Design tokens
- [ ] Foundations (ripple, state layers, focus)
- [ ] Components from the portfolio
- [ ] Release `0.1.0`
- [ ] New components for the dashboard
- [ ] Release `0.2.0`

See the [full roadmap](docs/planning/ROADMAP.md) for epics and stories.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Suggestions and bug reports are welcome through
[issues](https://github.com/Nic-Soares/material-design-react/issues).
How the library is developed — workflow, commits, changesets and the
component definition of done — is in [CONTRIBUTING.md](CONTRIBUTING.md).
The decisions behind it are in [`docs/adr/`](docs/adr/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See [LICENSE](LICENSE).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Nicolas Santos — [GitHub](https://github.com/Nic-Soares)

Project link: [https://github.com/Nic-Soares/material-design-react](https://github.com/Nic-Soares/material-design-react)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Material Design 3](https://m3.material.io)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[status-shield]: https://img.shields.io/badge/status-early%20development-orange?style=for-the-badge
[roadmap-url]: docs/planning/ROADMAP.md
[ci-shield]: https://img.shields.io/github/actions/workflow/status/Nic-Soares/material-design-react/ci.yml?branch=main&style=for-the-badge&label=CI
[ci-url]: https://github.com/Nic-Soares/material-design-react/actions/workflows/ci.yml
[license-shield]: https://img.shields.io/badge/license-MIT-blue?style=for-the-badge
[license-url]: LICENSE
[react-shield]: https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev
[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev
[m3-shield]: https://img.shields.io/badge/Material%20Design%203-757575?style=for-the-badge&logo=materialdesign&logoColor=white
[m3-url]: https://m3.material.io
