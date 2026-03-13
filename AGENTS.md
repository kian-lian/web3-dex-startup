# Repository Guidelines

## Project Structure & Module Organization
This repository follows a **Feature-First** architecture: routes in `app/`, business logic in `features/`, shared infrastructure in `shared/`.

```
src/
  app/              # Route shell — only Next.js convention files (page, layout, loading, error)
    (dex)/          # Route Group: DEX pages (swap, portfolio) with shared nav layout
    api/            # API Routes
  features/         # Business core — one directory per domain
    swap/           # Token exchange
      components/   # Feature-specific UI components
      hooks/        # Data fetching and interaction hooks (wagmi wrappers)
      lib/          # Pure utility functions (no React dependency)
      types.ts      # Domain types (SwapParams, SwapQuote)
      constants.ts  # Domain constants (DEFAULT_SLIPPAGE, MAX_SLIPPAGE)
      index.ts      # Public API — external code MUST import from here
    token/          # Token list, search, favorites
    wallet/         # Wallet status, balance, transaction history
  shared/           # Cross-feature infrastructure
    components/ui/  # shadcn/ui components (CLI-generated, do not hand-edit)
    config/         # wagmi chain config, env config
    providers/      # Global providers (Web3Provider, QueryProvider)
    hooks/          # Shared hooks
    lib/            # Utility functions (address formatting, etc.)
    types/          # Shared type definitions
    constants/      # Shared constants
  test/             # Shared test setup
```

Keep business logic in feature modules. Move reusable cross-feature code to `src/shared/`.

## Architecture Rules

### Dependency Direction

Allowed: `app → features → shared`, `app → shared`

Forbidden: `shared → features`, reverse feature dependencies

### Feature Public API

External code MUST import from a feature's `index.ts`, never from internal files:

```ts
// Correct
import { SwapCard } from '@/features/swap'

// Wrong — bypasses public API
import { SwapCard } from '@/features/swap/components/swap-card'
```

### Feature Dependency Graph

- `swap → token` ✅ (swap needs token selection)
- `swap → wallet` ✅ (swap needs balance and tx execution)
- `token → swap` ❌ (token is a base feature)
- `wallet → swap` ❌ (wallet is a base feature)

## Build, Test, and Development Commands
- `pnpm dev`: Start local development server.
- `pnpm build` / `pnpm start`: Build and run production bundle.
- `pnpm lint`: Run Biome checks.
- `pnpm typecheck`: Run TypeScript checks (`tsc --noEmit`).
- `pnpm test` / `pnpm test:run`: Run Vitest (watch / one-shot).
- `pnpm test:coverage`: Generate coverage report.
- `pnpm run ci`: Run full local quality gate.
- `pnpm security:audit`: Scan dependencies for high+ vulnerabilities.
- `pnpm security:secrets`: Scan repository for hardcoded secrets.
- `pnpm analyze`: Bundle size analysis (opens browser report).

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode.
- Indentation: 2 spaces (`.editorconfig` + Biome).
- Naming:
  - files/directories: `kebab-case`
  - components/types: `PascalCase`
  - hooks: `useCamelCase`
  - constants: `UPPER_SNAKE_CASE`
- Formatting/linting: Biome (`pnpm lint`, `pnpm format`).
- Prefer Server Components; add `"use client"` only when browser-only behavior is required.

### File Header Convention

All source files (`.ts`, `.tsx`, `.js`, `.jsx`) must include a comment header at the top:

```ts
/**
 * author: <GitHub username>
 * create time: <YYYY-MM-DD HH:mm:ss>
 * last edit time: <YYYY-MM-DD HH:mm:ss>
 * description: <brief description of the file's purpose>
 */
```

- **New files:** Set both `create time` and `last edit time` to the current time. Set `author` to the author's GitHub username.
- **Modified files (CRITICAL):** **Every** file modification — no matter how small — **must** update `last edit time` to the current time. If the current author's GitHub username is not in the `author` list, append it (comma-separated). Keep `create time` unchanged. This applies to all edits including header-only changes, single-line fixes, and batch updates.
- **description:** Briefly describe the file's purpose and functionality so others can quickly understand its content.
- **Excluded:** Auto-generated files (e.g., `shared/components/ui/`), config files (`.json`, `.config.*`), and type declaration files (`.d.ts`) do not need headers.

## Testing Guidelines
- Framework: Vitest + Testing Library (`jsdom`).
- Test files: `*.test.ts` / `*.test.tsx` (or `*.spec.ts(x)`).
- Place tests close to modules (e.g., `src/shared/lib/__tests__/address.test.ts`).
- Before PR: run `pnpm test:run` (and `pnpm test:coverage` for larger changes).

## Branch Strategy

The project uses a **feature → dev → main** workflow:

- **`main`** — Production branch. Only accepts PRs from `dev` (merge commit). Protected: requires PR, CI passing, and at least one approval.
- **`dev`** — Integration branch. Accepts PRs from feature branches. Protected: requires PR and CI passing.
- **`feat/xxx`** — Feature branches. Created from `dev`, merged back to `dev` via PR.

```
feat/xxx  ──PR──▸  dev  ──PR (merge commit)──▸  main
```

Release automation (Release Please) only triggers on `main`, so releases happen after `dev → main` merges.

## Versioning & Release

The project uses [Release Please](https://github.com/googleapis/release-please) for automated releases, triggered on merges to `main`. Version bumps follow [Semantic Versioning](https://semver.org/) and are determined by Conventional Commit prefixes:

| Commit prefix | Version bump | Example (`0.2.0` →) |
|---|---|---|
| `fix:` | PATCH | `0.2.1` |
| `feat:` | MINOR | `0.3.0` |
| `feat!:` or `BREAKING CHANGE:` footer | MAJOR | `1.0.0` |
| `chore:`, `docs:`, `refactor:`, etc. | No release | — |

Breaking changes can be indicated by:
- Adding `!` after the type/scope: `feat!:` or `feat(swap)!:`
- Adding a `BREAKING CHANGE:` footer in the commit body (after a blank line)

When multiple commits are included in a release, the **highest-level** change wins (BREAKING > feat > fix).

> **Note:** While MAJOR version is `0` (i.e., `0.x.x`), breaking changes bump MINOR instead of MAJOR per semver convention — the `0.x` range signals initial development.

Configuration files: `.release-please-config.json`, `.release-please-manifest.json`.

## Commit & Pull Request Guidelines
- Commit format: Conventional Commits (e.g., `feat(wallet): add connect state`).
- Allowed commit types are enforced by commitlint; subject max length is 72.
- PRs should be focused and include:
  - clear summary and motivation
  - linked issue/task
  - validation evidence (commands/logs)
  - screenshots/GIFs for UI changes

## Security & Configuration Tips
- Never commit secrets; use `.env.local`.
- Read env values through `src/shared/config/env.ts`.
- Keep `main` and `dev` protected: require PR and passing checks (`quality`, `security-sca`, `security-secret`). `main` additionally requires at least one approval.
