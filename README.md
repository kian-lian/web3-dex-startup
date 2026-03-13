# DEX Startup Template

[English](./README.md) | [简体中文](./README.zh-CN.md)

A production-oriented starter template for building DEX (decentralized exchange) frontends with Next.js, WalletConnect, and modern engineering guardrails.

## What This Template Includes

- App Router based Next.js application (`next@16`)
- Web3 connection stack with `wagmi`, `viem`, and `rainbowkit`
- Feature-First architecture (`app -> features -> shared`)
- Typed env access from a single source (`src/shared/config/env.ts`)
- Built-in observability (`@sentry/nextjs` + `pino` logger)
- Quality gates: Biome, TypeScript strict mode, Vitest, cspell
- Commit and pre-commit hygiene with Husky + lint-staged + commitlint

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict)
- **Web3**: wagmi + viem + RainbowKit
- **State/Data**: TanStack Query
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Testing Library
- **Quality**: Biome + cspell
- **Monitoring**: Sentry + Pino

## Quick Start

### 1) Prerequisites

- Node.js 20+
- pnpm 9+

### 2) Install

```bash
pnpm install
```

### 3) Configure Environment

```bash
cp .env.example .env.local
```****

Set your WalletConnect project ID in `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

> Get one at: https://cloud.walletconnect.com

### 4) Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

## 5-Minute Onboarding

If you just joined the project, follow this order:

1. Run the app: `pnpm dev`
2. Run baseline checks: `pnpm lint && pnpm typecheck && pnpm test:run`
3. Read architecture entry points:
   - `src/app/` (routing and page composition)
   - `src/features/` (business domains)
   - `src/shared/` (cross-feature infrastructure)
4. Read environment contract: `src/shared/config/env.ts`
5. Before your first PR, run:
   - `pnpm run ci`
   - `pnpm security:audit`
   - `pnpm security:secrets`

Suggested first contribution:

- Pick a small docs/test improvement and verify all quality gates pass.

## Project Structure

```text
src/
  app/                  # Next.js route and layout layer
  features/             # Domain modules (swap, token, wallet)
  shared/               # Cross-feature infrastructure and utilities
    config/             # env, wagmi config
    providers/          # React Query/Web3 providers
    lib/                # shared utilities
  test/                 # test setup utilities
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome checks |
| `pnpm typecheck` | Run TypeScript checks (`tsc --noEmit`) |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm spellcheck` | Run cspell on TS/TSX files |
| `pnpm run ci` | Run full local quality gate |
| `pnpm security:audit` | Scan dependencies for high+ vulnerabilities |
| `pnpm security:secrets` | Scan repository for hardcoded secrets |

## Engineering Quality Gates

Use these commands before opening a PR:

```bash
pnpm run ci
pnpm security:audit
pnpm security:secrets
```

Required CI checks:

- `semantic-pr-title` (PR title follows Conventional Commits)
- `quality` (lint, typecheck, test, build, spellcheck)
- `security-sca` (dependency vulnerability scan)
- `security-secret` (secret scan with gitleaks)

Repository settings that must be enabled for `main`:

- Require pull request before merging
- Require at least 1 approving review
- Require CODEOWNERS review
- Require conversation resolution before merging
- Require status checks to pass before merging:
  - `semantic-pr-title`
  - `quality`
  - `security-sca`
  - `security-secret`
- Enforce protection for administrators

Repository settings that must be enabled for merge automation:

- Enable auto-merge at repository level
- Configure GitHub Actions workflow permissions:
  - Set default workflow permissions to `read and write`
  - Enable `Allow GitHub Actions to approve pull requests`

Contribution reference:

- `CONTRIBUTING.md`
- `CONTRIBUTING.zh-CN.md`

## Versioning & Release

Releases are automated via [Release Please](https://github.com/googleapis/release-please). When commits are merged to `main`, Release Please creates a Release PR based on [Conventional Commits](https://www.conventionalcommits.org/):

| Commit prefix | Version bump | Example |
|---|---|---|
| `fix:` | PATCH (`0.2.0` → `0.2.1`) | Bug fixes |
| `feat:` | MINOR (`0.2.0` → `0.3.0`) | New features |
| `feat!:` or `BREAKING CHANGE:` | MAJOR (`0.2.0` → `1.0.0`) | Breaking changes |

Other prefixes (`chore:`, `docs:`, `refactor:`, etc.) do not trigger a release.

Merging the Release PR publishes a GitHub Release with an auto-generated CHANGELOG.

## Environment Notes

- Never commit secrets; keep private values in `.env.local`.
- All app code should read env values from `src/shared/config/env.ts`.
- Production build requires `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

## Supported Chains

Current default chain configuration is defined in `src/shared/config/wagmi.ts`.

## Contributing

Read `CONTRIBUTING.md` for the complete PR, CI, release, and security workflow.

## License

MIT
