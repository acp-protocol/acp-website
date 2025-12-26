# ACP Website

Landing page and documentation for the [AI Context Protocol (ACP)](https://github.com/acp-protocol/acp-spec) specification.

**Live site:** [https://acp-protocol.dev](https://acp-protocol.dev)

## Overview

This repository contains the website for the ACP Protocol, providing:

- **Landing Page** - Introduction to ACP Protocol and its benefits
- **Documentation** - Comprehensive guides and reference documentation (Diataxis-organized)
- **Schema Hosting** - JSON schemas for validation at `/schemas/v1/*.schema.json`

## Project Structure

```
acp-website/
├── acp-spec/                # Git submodule - specification & docs source
│   ├── acp-docs/            # User documentation (Diataxis)
│   ├── spec/                # Formal specification chapters
│   └── schemas/             # JSON schemas
├── apps/
│   └── web/                 # Next.js 16 web application
│       ├── scripts/         # Build scripts (sync-docs.ts)
│       └── content/docs/    # Generated MDX (gitignored)
├── packages/
│   ├── ui/                  # shadcn/ui component library
│   └── test-utils/          # Testing utilities
└── tooling/
    ├── eslint/              # ESLint configuration
    ├── prettier/            # Prettier configuration
    ├── tailwind/            # Tailwind CSS configuration
    └── typescript/          # TypeScript configuration
```

## Documentation System

Documentation is sourced from the `acp-spec` submodule and converted to MDX at build time:

- **Source**: `acp-spec/acp-docs/` (Markdown, Diataxis-organized)
- **Conversion**: `apps/web/scripts/sync-docs.ts` runs during build
- **Output**: `apps/web/content/docs/` (MDX with frontmatter, gitignored)

The build also copies JSON schemas to `public/schemas/v1/` for direct URL access.

## Technology Stack

| Layer           | Technology         | Purpose                           |
|-----------------|--------------------|-----------------------------------|
| Package Manager | pnpm               | Monorepo management               |
| Build System    | Turborepo          | Build orchestration and caching   |
| Framework       | Next.js 16         | React framework with App Router   |
| Styling         | Tailwind CSS 4     | Utility-first CSS                 |
| UI Components   | shadcn/ui          | Accessible, composable components |
| Type Safety     | TypeScript 5       | Static type checking              |
| Deployment      | Vercel             | Hosting and CI/CD                 |

## Getting Started

### Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 10.24.0

### Installation

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/acp-protocol/acp-website.git
cd acp-website

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The web application will be available at `http://localhost:3000`.

### If you already cloned without submodules

```bash
git submodule update --init --recursive
```

## Development

### Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `pnpm dev`        | Start development server                 |
| `pnpm build`      | Build all packages (syncs docs first)    |
| `pnpm sync-docs`  | Manually sync docs from acp-spec         |
| `pnpm typecheck`  | Run TypeScript type checking             |
| `pnpm lint`       | Run ESLint                               |
| `pnpm format`     | Format code with Prettier                |

### Updating Documentation

Documentation content lives in the `acp-spec` repository. To update:

1. Make changes in `acp-spec/acp-docs/`
2. Commit and push changes in the submodule
3. Update the submodule reference: `git add acp-spec && git commit`
4. Push to trigger rebuild

## Deployment

The site deploys automatically to Vercel on push to `main`. The GitHub Actions workflow:

1. Initializes submodules
2. Runs TypeScript and lint checks
3. Builds and deploys to Vercel

Preview deployments are created for pull requests.

## Related Projects

- [ACP Specification](https://github.com/acp-protocol/acp-spec) - The ACP Protocol specification and documentation source

## License

MIT License - see [LICENSE](LICENSE) for details.
