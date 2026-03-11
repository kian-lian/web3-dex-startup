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

所有源码文件（`.ts`, `.tsx`, `.js`, `.jsx`）顶部必须添加注释头：

```ts
/**
 * author: <作者名>
 * create time: <YYYY-MM-DD HH:mm:ss>
 * last edit time: <YYYY-MM-DD HH:mm:ss>
 * description: <简要描述文件的功能和作用>
 */
```

- **新建文件：** `create time` 和 `last edit time` 设为当前时间，`author` 填写当前作者。
- **修改文件：** 更新 `last edit time` 为当前时间；若当前作者不在 `author` 列表中则追加（逗号分隔）；`create time` 保持不变。
- **description：** 简要说明文件的功能和作用，方便他人快速了解内容和用途。
- **排除范围：** 自动生成的文件（如 `shared/components/ui/`）、配置文件（`.json`, `.config.*`）、类型声明文件（`.d.ts`）不需要添加。

## Testing Guidelines
- Framework: Vitest + Testing Library (`jsdom`).
- Test files: `*.test.ts` / `*.test.tsx` (or `*.spec.ts(x)`).
- Place tests close to modules (e.g., `src/shared/lib/__tests__/address.test.ts`).
- Before PR: run `pnpm test:run` (and `pnpm test:coverage` for larger changes).

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
- Keep `main` protected: require PR, at least one approval, and passing checks (`quality`, `security-sca`, `security-secret`).
