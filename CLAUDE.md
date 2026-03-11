# Core Principles (Highest Priority)

@constitution.md

# Project Context

@AGENTS.md

# Claude Code Guide

The following is specific to Claude Code workflows. For general project info, see `AGENTS.md`.

## Tech Stack Documentation

When looking up tech stack usage, prefer these LLM-friendly docs:

- Next.js: https://nextjs.org/llms.txt
- Wagmi: https://wagmi.sh/llms.txt
- RainbowKit: https://rainbowkit.com/llms.txt
- shadcn/ui: https://ui.shadcn.com/llms.txt

## UI Components

- Add shadcn/ui components via CLI: `npx shadcn@latest add <component>`
- Installed to `src/shared/components/ui/`; import as `@/shared/components/ui/button`

## MCP Integrations

Prompt the user to configure these if not installed:

- shadcn MCP: `npx shadcn@latest mcp init --client claude` ([docs](https://ui.shadcn.com/docs/mcp))
- TanStack MCP: `claude mcp add --transport stdio --scope user tanstack -- npx @tanstack/cli mcp` ([docs](https://tanstack.com/cli/latest/docs/mcp/overview))

## Commands

- Dev server: `pnpm dev`
- Type check: `pnpm typecheck`
- Lint: `pnpm lint`
- Format: `pnpm format`
- Tests: `pnpm test` (watch) / `pnpm test:run` (one-shot)
- Coverage: `pnpm test:coverage`
- Spell check: `pnpm spellcheck`
- Full quality gate: `pnpm ci`
- Security scan: `pnpm security:audit` / `pnpm security:secrets`
- Bundle analysis: `pnpm analyze`

## Environment Configuration

Per-environment config is managed via `.env.*` files, with a single entry point at `src/shared/config/env.ts`:

- `.env` — shared defaults (committed to git)
- `.env.development` — loaded during `pnpm dev` (testnet, Sentry off)
- `.env.test` — loaded during vitest
- `.env.production` — loaded during `pnpm build` (mainnet, Sentry sampling)
- `.env.local` — local secret overrides (gitignored)

Business code imports config from `@/shared/config/env` — never read `process.env` directly.

## Commit Messages

- **禁止** 在提交信息中添加 `Co-Authored-By` AI 署名（如 `Co-Authored-By: Claude ...`）。此规则由 commitlint 的 `no-ai-co-author` 规则强制执行。

## Thinking Strategy

- 遇到需要深度复杂思考的任务时（如架构设计、复杂 bug 分析、多步骤推理），使用 `/ultrathink` skill 进行深度推理。

## Tooling

- Package manager: pnpm
- GitHub operations: `gh` CLI
