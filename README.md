# 🎨 Material Design React (UI Library)

A React component library based on Material Design 3, focused on performance and modern CSS patterns.

## 🚀 Key Technologies

- **Monorepo:** Managed with [Turborepo](https://turbo.build/)
- **Package manager:** [pnpm](https://pnpm.io/) (Workspaces)
- **Build:** [tsup](https://tsup.egoist.dev/) (esbuild-based)
- **Styling:** Native CSS Modules + CSS Variables (No Sass/Less)
- **Versioning:** [Changesets](https://github.com/changesets/changesets)

## 📂 Project Structure

```
.
├── apps/
│   ├── docs/           # Documentation (Next.js) to preview components
│   └── web/            # Test app (playground)
├── packages/
│   ├── ui/             # 📦 THE LIBRARY (Where the components live)
│   │   ├── src/        # Source code (React + CSS)
│   │   └── dist/       # Compiled output (generated)
│   ├── eslint-config/  # Shared lint configs
│   └── typescript-config/ # Shared TS configs
```

## ⚡ Quick Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Installs all dependencies |
| `pnpm build` | Builds the library (`packages/ui`) and apps |
| `pnpm dev` | Starts development mode |
| `pnpm lint` | Runs code linters |
| `pnpm changeset` | Creates a version changeset (required for new features) |

## 📚 Full Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Processes, commit guidelines and workflow
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical concepts and design decisions
- **[DEPENDENCIES.md](./DEPENDENCIES.md)** - Dictionary of the tools used

## 🎯 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd material-design-react
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the initial build**
   ```bash
   pnpm build
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

5. **Access the apps**
   - Docs: `http://localhost:3000`
   - Web (Playground): `http://localhost:3001`

## 🧩 Using the Library

After building the project, you can import components from the `@repo/ui` package:

```tsx
// Import the library CSS once at the app root
import "@repo/ui/styles.css";

// Import components
import { Button } from "@repo/ui";

function App() {
  return <Button variant="filled">Click me</Button>;
}
```

## 🤝 Contributing

Before contributing, please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** to understand the workflow, commit conventions, and versioning process.

## 📄 License

MIT License — Feel free to use this project.