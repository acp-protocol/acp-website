# ACP Website

Landing page, playground, and documentation for the [AI Context Protocol (ACP)](https://github.com/your-org/acp-spec) specification.

## Overview

This repository contains the website for the ACP Protocol, providing:

- **Landing Page** - Introduction to ACP Protocol and its benefits
- **Documentation** - Comprehensive guides and reference documentation
- **Playground** - Interactive examples for trying ACP annotations

## Project Structure

```
acp-website/
├── apps/
│   └── web/                 # Next.js 16 web application
├── packages/
│   ├── ui/                  # shadcn/ui component library
│   └── test-utils/          # Testing utilities
└── tooling/
    ├── eslint/              # ESLint configuration
    ├── prettier/            # Prettier configuration
    ├── tailwind/            # Tailwind CSS configuration
    └── typescript/          # TypeScript configuration
```

## Technology Stack

| Layer           | Technology         | Purpose                           |
|-----------------|--------------------|-----------------------------------|
| Package Manager | pnpm               | Monorepo management               |
| Build System    | Turborepo          | Build orchestration and caching   |
| Framework       | Next.js 16         | React framework with App Router   |
| Styling         | Tailwind CSS 4     | Utility-first CSS                 |
| UI Components   | shadcn/ui          | Accessible, composable components |
| Type Safety     | TypeScript 5.9     | Static type checking              |
| Testing         | Vitest, Playwright | Unit and E2E testing              |

## Getting Started

### Prerequisites

- **Node.js** >= 25.0.0
- **pnpm** >= 10.24.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/acp-website.git
cd acp-website

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The web application will be available at `http://localhost:3000`.

## Development

### Available Scripts

| Command           | Description                       |
|-------------------|-----------------------------------|
| `pnpm dev`        | Start development server          |
| `pnpm dev:web`    | Start web app only                |
| `pnpm build`      | Build all packages                |
| `pnpm typecheck`  | Run TypeScript type checking      |
| `pnpm lint`       | Run ESLint                        |
| `pnpm test`       | Run unit tests                    |
| `pnpm format`     | Format code with Prettier         |

### Running Specific Packages

```bash
# Web app only
pnpm --filter @acp-website/web dev

# UI package tests
pnpm --filter @acp-website/ui test

# Build specific package
pnpm --filter @acp-website/ui build
```

### Adding UI Components

The UI package uses shadcn/ui. Add components with:

```bash
cd packages/ui
pnpm ui:add button dialog card
```

## Packages

### `@acp-website/web`

Next.js 16 web application serving the ACP Protocol website.

### `@acp-website/ui`

Reusable UI components built with shadcn/ui and Tailwind CSS.

```tsx
import { Button } from "@acp-website/ui/components";
import { cn } from "@acp-website/ui/lib/utils";

<Button variant="outline" className={cn("custom-class")}>
  Get Started
</Button>
```

### `@acp-website/test-utils`

Testing utilities for Vitest including Testing Library setup.

## Related Projects

- [ACP Specification](https://github.com/your-org/acp-spec) - The ACP Protocol specification

## License

MIT License - see [LICENSE](LICENSE) for details.
