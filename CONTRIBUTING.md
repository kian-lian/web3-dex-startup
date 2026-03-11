# Contributing Guide

[English](./CONTRIBUTING.md) | [简体中文](./CONTRIBUTING.zh-CN.md)

This document defines the contribution workflow for `web3-cex-startup`.

## 1) Scope and Principles

- Keep changes small, focused, and reversible.
- Follow Feature-First architecture boundaries:
  - Allowed: `app -> features -> shared`, `app -> shared`
  - Forbidden: `shared -> features`, reverse feature dependencies
- Import feature modules only from each feature public API (`index.ts`).

Example:

```ts
// Correct
import { SwapCard } from "@/features/swap";

// Wrong
import { SwapCard } from "@/features/swap/components/swap-card";
```

## 2) File Header Convention

All source files (`.ts`, `.tsx`, `.js`, `.jsx`) must include a header comment at the top:

```ts
/**
 * author: <name>
 * create time: <YYYY-MM-DD HH:mm:ss>
 * last edit time: <YYYY-MM-DD HH:mm:ss>
 * description: <brief description of the file's purpose>
 */
```

- **New files:** Set both `create time` and `last edit time` to the current time.
- **Modified files:** Update `last edit time` only. If you are not already listed in `author`, append your name (comma-separated). Never change `create time`.
- **description:** Briefly explain what the file does so others can understand it quickly.
- **Excluded:** Auto-generated files (e.g., `shared/components/ui/`), config files (`.json`, `.config.*`), and type declarations (`.d.ts`).

## 3) Development Setup

Prerequisites:

- Node.js `>=20`
- pnpm `>=9`

Install and run:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

For local build validation:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=test-project-id pnpm build
```

## 4) Branch and Commit Rules

Branch naming (recommended):

- `feat/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`
- `docs/<short-topic>`
- `refactor/<short-topic>`

Commit rules:

- Conventional Commits are required.
- Allowed commit types:
  - `feat`
  - `fix`
  - `docs`
  - `style`
  - `refactor`
  - `test`
  - `chore`
  - `perf`
  - `ci`
  - `revert`
- Subject max length: `72`
- Do not add AI co-author trailers (`Co-Authored-By: ... claude/anthropic`).

Git hooks:

- `pre-commit`: runs `lint-staged`
- `commit-msg`: runs `commitlint`

## 5) Pull Request Workflow

### PR title

PR title must follow Conventional Commits format, for example:

- `feat(swap): support max slippage`
- `fix(wallet): avoid stale balance`

### PR checklist

Use `/.github/pull_request_template.md` and include:

- Change summary and motivation
- Scope and potential impact
- Validation evidence
- Risks and rollback plan

### Required checks

The following checks must pass before merge:

- `semantic-pr-title`
- `quality`
- `security-sca`
- `security-secret`

`quality` includes:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:run`
- `pnpm build`
- `pnpm spellcheck`

## 6) Branch Protection (Repository Settings)

`main` must enforce:

- Require pull request before merging
- Require at least 1 approving review
- Require CODEOWNERS review
- Require conversation resolution before merging
- Require required status checks:
  - `semantic-pr-title`
  - `quality`
  - `security-sca`
  - `security-secret`
- Enforce protection for administrators

## 7) Merge Automation and Dependency Updates

Repository settings required:

- Enable Auto-merge
- Set GitHub Actions workflow permissions to `read and write`
- Enable `Allow GitHub Actions to approve pull requests`

Dependabot:

- Runs weekly (`npm` and `github-actions`)
- Patch/minor updates are auto-approved and auto-merged after checks pass
- Major updates require manual review

## 8) Release Process

Release is automated by Release Please:

- Workflow: `/.github/workflows/release.yml`
- Trigger: push to `main` or manual dispatch
- Uses:
  - `/.release-please-config.json`
  - `/.release-please-manifest.json`

Flow:

1. Conventional commits accumulate on `main`.
2. Release Please opens/updates a release PR.
3. After the release PR is merged, tag and GitHub Release are created.

Version bump rules:

- `feat:` -> minor
- `fix:`, `refactor:`, `perf:` -> patch
- `!` or `BREAKING CHANGE:` -> major

## 9) Security Requirements

- Never commit secrets.
- Keep private values in `.env.local`.
- Read env values through `src/shared/config/env.ts`.
- Run security checks before PR:

```bash
pnpm security:audit
pnpm security:secrets
```

## 10) Before Opening a PR

Run:

```bash
pnpm run ci
pnpm security:audit
pnpm security:secrets
```

Then verify:

- Tests and build pass locally
- PR title follows Conventional Commits
- Changed docs are updated when behavior/workflow changes
