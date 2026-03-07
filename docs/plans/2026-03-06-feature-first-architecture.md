# Feature First Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the project from a flat directory structure to Feature First architecture with `app/` (routing), `features/` (business logic), and `shared/` (common infrastructure).

**Architecture:** Route Group `(dex)` organizes swap/portfolio pages. Three feature modules (`swap`, `token`, `wallet`) encapsulate business logic. `shared/` holds providers, config, shadcn/ui components, and cross-cutting utilities. Dependencies flow strictly: `app → features → shared`.

**Tech Stack:** Next.js 16 (App Router), TypeScript 5 (strict), Wagmi v2, RainbowKit v2, TanStack Query v5, Tailwind CSS v4, shadcn/ui, Biome v2, Vitest v4, pnpm

---

## Task 1: Create shared/ directory and migrate existing infrastructure

**Files:**
- Move: `src/providers/index.tsx` → `src/shared/providers/index.tsx`
- Move: `src/providers/web3-provider.tsx` → `src/shared/providers/web3-provider.tsx`
- Move: `src/providers/query-provider.tsx` → `src/shared/providers/query-provider.tsx`
- Move: `src/config/wagmi.ts` → `src/shared/config/wagmi.ts`
- Move: `src/config/__tests__/wagmi.test.ts` → `src/shared/config/__tests__/wagmi.test.ts`
- Modify: `src/app/layout.tsx` (update import path)

**Step 1: Create shared directory structure and move files**

```bash
mkdir -p src/shared/providers src/shared/config/__tests__

# Move providers
mv src/providers/web3-provider.tsx src/shared/providers/web3-provider.tsx
mv src/providers/query-provider.tsx src/shared/providers/query-provider.tsx
mv src/providers/index.tsx src/shared/providers/index.tsx
rmdir src/providers

# Move config
mv src/config/__tests__/wagmi.test.ts src/shared/config/__tests__/wagmi.test.ts
mv src/config/wagmi.ts src/shared/config/wagmi.ts
rmdir src/config/__tests__
rmdir src/config
```

**Step 2: Update internal imports in moved files**

Update `src/shared/providers/web3-provider.tsx` — change import path:

```tsx
// Before
import { wagmiConfig } from "@/config/wagmi";
// After
import { wagmiConfig } from "@/shared/config/wagmi";
```

Update `src/shared/providers/index.tsx` — relative imports stay the same (no change needed).

Update `src/shared/config/__tests__/wagmi.test.ts` — change import path:

```ts
// Before
import { wagmiConfig } from "@/config/wagmi";
// After
import { wagmiConfig } from "@/shared/config/wagmi";
```

**Step 3: Update app/layout.tsx import**

```tsx
// Before
import { Providers } from "@/providers";
// After
import { Providers } from "@/shared/providers";
```

**Step 4: Run tests to verify nothing broke**

Run: `pnpm test:run`
Expected: All tests pass (wagmi config test should still find and validate the config).

**Step 5: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 6: Commit**

```bash
git add src/shared/ src/app/layout.tsx
git add -u src/providers/ src/config/
git commit -m "refactor: migrate providers and config to shared/"
```

---

## Task 2: Create feature directory scaffolds with index.ts public API

**Files:**
- Create: `src/features/swap/index.ts`
- Create: `src/features/swap/types.ts`
- Create: `src/features/swap/constants.ts`
- Create: `src/features/token/index.ts`
- Create: `src/features/token/types.ts`
- Create: `src/features/token/constants.ts`
- Create: `src/features/wallet/index.ts`
- Create: `src/features/wallet/types.ts`

**Step 1: Create directories**

```bash
mkdir -p src/features/swap/{components,hooks,lib}
mkdir -p src/features/token/{components,hooks,lib}
mkdir -p src/features/wallet/{components,hooks}
```

**Step 2: Create swap types and constants**

`src/features/swap/types.ts`:
```ts
import type { Address } from "viem";

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  slippage: number;
}

export interface SwapQuote {
  amountOut: bigint;
  priceImpact: number;
  route: string;
}
```

`src/features/swap/constants.ts`:
```ts
/** Default slippage tolerance: 0.5% */
export const DEFAULT_SLIPPAGE = 0.5;

/** Maximum allowed slippage: 5% */
export const MAX_SLIPPAGE = 5;

/** Slippage warning threshold: 1% */
export const HIGH_SLIPPAGE_THRESHOLD = 1;
```

**Step 3: Create token types and constants**

`src/features/token/types.ts`:
```ts
import type { Address } from "viem";

export interface TokenInfo {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}
```

`src/features/token/constants.ts`:
```ts
import type { TokenInfo } from "./types";

/**
 * Well-known tokens for default display.
 * Addresses are Ethereum mainnet.
 */
export const DEFAULT_TOKENS: readonly TokenInfo[] = [
  {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    chainId: 1,
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    chainId: 1,
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    chainId: 1,
  },
] as const;
```

**Step 4: Create wallet types**

`src/features/wallet/types.ts`:
```ts
import type { Address, Hash } from "viem";

export interface TransactionRecord {
  hash: Hash;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}
```

**Step 5: Create index.ts for each feature (initially re-exporting types)**

`src/features/swap/index.ts`:
```ts
export type { SwapParams, SwapQuote } from "./types";
export { DEFAULT_SLIPPAGE, MAX_SLIPPAGE, HIGH_SLIPPAGE_THRESHOLD } from "./constants";
```

`src/features/token/index.ts`:
```ts
export type { TokenInfo } from "./types";
export { DEFAULT_TOKENS } from "./constants";
```

`src/features/wallet/index.ts`:
```ts
export type { TransactionRecord } from "./types";
```

**Step 6: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 7: Commit**

```bash
git add src/features/
git commit -m "feat: scaffold feature directories with types and public API"
```

---

## Task 3: Extract wallet feature from current home page

**Files:**
- Create: `src/features/wallet/components/connect-button.tsx`
- Create: `src/features/wallet/components/account-info.tsx`
- Create: `src/shared/lib/address.ts`
- Modify: `src/features/wallet/index.ts`
- Modify: `src/app/page.tsx`

**Step 1: Create shared address utility**

`src/shared/lib/address.ts`:
```ts
/**
 * Truncate an Ethereum address for display: 0x1234...abcd
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
```

**Step 2: Write test for address utility**

Create: `src/shared/lib/__tests__/address.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { truncateAddress } from "@/shared/lib/address";

describe("truncateAddress", () => {
  it("should truncate address with default chars", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678";
    expect(truncateAddress(address)).toBe("0x1234...5678");
  });

  it("should truncate address with custom chars", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678";
    expect(truncateAddress(address, 6)).toBe("0x123456...345678");
  });
});
```

**Step 3: Run test to verify it passes**

Run: `pnpm test:run`
Expected: PASS

**Step 4: Create connect-button component**

`src/features/wallet/components/connect-button.tsx`:
```tsx
"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectButton() {
  return <RainbowConnectButton />;
}
```

**Step 5: Create account-info component**

Extract the wallet info card from the current `page.tsx` into its own component.

`src/features/wallet/components/account-info.tsx`:
```tsx
"use client";

import { formatEther } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { truncateAddress } from "@/shared/lib/address";

export function AccountInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 font-semibold text-lg text-zinc-900 dark:text-zinc-50">
        Wallet Info
      </h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500 dark:text-zinc-400">Address</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">
            {truncateAddress(address)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500 dark:text-zinc-400">Chain ID</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{chainId}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500 dark:text-zinc-400">Balance</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {balance
              ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}`
              : "Loading..."}
          </dd>
        </div>
      </dl>
    </div>
  );
}
```

**Step 6: Update wallet index.ts**

```ts
export { ConnectButton } from "./components/connect-button";
export { AccountInfo } from "./components/account-info";
export type { TransactionRecord } from "./types";
```

**Step 7: Rewrite app/page.tsx as thin orchestration layer**

```tsx
import { AccountInfo, ConnectButton } from "@/features/wallet";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
      <header className="text-center">
        <h1 className="font-bold text-3xl text-zinc-900 tracking-tight dark:text-zinc-50">
          Web3 DEX
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Connect your wallet to get started
        </p>
      </header>
      <ConnectButton />
      <AccountInfo />
    </div>
  );
}
```

Note: `page.tsx` is now a **Server Component** (no `"use client"`). The `"use client"` boundary is pushed down into `ConnectButton` and `AccountInfo`.

**Step 8: Run Biome check and tests**

Run: `npx @biomejs/biome check --write . && pnpm test:run`
Expected: All pass.

**Step 9: Commit**

```bash
git add src/features/wallet/ src/shared/lib/ src/app/page.tsx
git commit -m "refactor: extract wallet feature from home page"
```

---

## Task 4: Set up Route Group and (dex) layout

**Files:**
- Create: `src/app/(dex)/layout.tsx`
- Create: `src/app/(dex)/swap/page.tsx`
- Create: `src/app/(dex)/portfolio/page.tsx`

**Step 1: Create (dex) Route Group directory**

```bash
mkdir -p src/app/\(dex\)/swap src/app/\(dex\)/portfolio
```

**Step 2: Create (dex) layout**

`src/app/(dex)/layout.tsx`:
```tsx
import { ConnectButton } from "@/features/wallet";

export default function DexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="flex items-center justify-between border-zinc-200 border-b px-6 py-4 dark:border-zinc-800">
        <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
          Web3 DEX
        </span>
        <ConnectButton />
      </nav>
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
    </div>
  );
}
```

**Step 3: Create swap page (placeholder)**

`src/app/(dex)/swap/page.tsx`:
```tsx
export default function SwapPage() {
  return (
    <div className="text-center text-zinc-500 dark:text-zinc-400">
      Swap — coming soon
    </div>
  );
}
```

**Step 4: Create portfolio page (placeholder)**

`src/app/(dex)/portfolio/page.tsx`:
```tsx
import { AccountInfo } from "@/features/wallet";

export default function PortfolioPage() {
  return <AccountInfo />;
}
```

**Step 5: Run dev server to verify routes work**

Run: `pnpm dev`
Verify: `/swap` and `/portfolio` both render correctly with the shared nav layout.

**Step 6: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 7: Commit**

```bash
git add src/app/\(dex\)/
git commit -m "feat: add (dex) Route Group with swap and portfolio pages"
```

---

## Task 5: Initialize shadcn/ui and configure for shared/ paths

**Step 1: Run shadcn init**

Run: `pnpm dlx shadcn@latest init`

When prompted, select:
- Style: New York
- Base color: Zinc
- CSS variables: yes

**Step 2: Update components.json aliases for shared/ paths**

After init, update `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/components",
    "ui": "@/shared/components/ui",
    "hooks": "@/shared/hooks",
    "lib": "@/shared/lib",
    "utils": "@/shared/lib/utils"
  }
}
```

**Step 3: Verify by adding a test component**

Run: `pnpm dlx shadcn@latest add button`
Expected: Component generated at `src/shared/components/ui/button.tsx`.

**Step 4: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 5: Commit**

```bash
git add components.json src/shared/components/ src/shared/lib/utils.ts
git commit -m "chore: configure shadcn/ui with shared/ paths"
```

---

## Task 6: Update AGENTS.md and CLAUDE.md to reflect new architecture

**Files:**
- Modify: `AGENTS.md` (update directory structure section)
- Modify: `CLAUDE.md` (update shadcn component path reference)

**Step 1: Update AGENTS.md directory structure**

Replace the existing `## 目录结构` section in `AGENTS.md` with:

```markdown
## 目录结构

\```
src/
  app/            # 路由壳层（page、layout、loading、error 等约定文件）
    (dex)/        # Route Group：交易相关页面（swap、portfolio）
    api/          # API Routes
  features/       # 业务核心层（按功能域拆分）
    swap/         # 代币兑换
      components/ # 该 feature 的 UI 组件
      hooks/      # 数据获取和交互逻辑 hooks
      lib/        # 纯函数工具（不依赖 React）
      types.ts    # 领域类型
      constants.ts# 领域常量
      index.ts    # 公共 API 出口
    token/        # 代币列表/搜索/收藏
    wallet/       # 钱包状态/余额/交易历史
  shared/         # 通用层（跨 feature 的基础设施）
    components/ui/# shadcn/ui 组件（CLI 生成，勿手动修改）
    config/       # wagmi 链配置等
    providers/    # 全局 Provider（Web3Provider、QueryProvider）
    hooks/        # 通用 hooks
    lib/          # 工具函数
    types/        # 共享类型定义
    constants/    # 共享常量
\```
```

**Step 2: Add architecture rules to AGENTS.md**

Append a new section after directory structure:

```markdown
## 架构规则

### 依赖方向

只允许：`app → features → shared`、`app → shared`

禁止：`shared → features`、feature 之间反向依赖

### Feature 公共接口

Feature 外部只能从 `index.ts` 导入，禁止深入引用内部文件：

\```ts
// 正确
import { SwapCard } from '@/features/swap'

// 错误
import { SwapCard } from '@/features/swap/components/swap-card'
\```

### Feature 间方向性依赖

- swap → token ✅ (swap 需要选择代币)
- swap → wallet ✅ (swap 需要读余额、发交易)
- token → swap ❌
- wallet → swap ❌
```

**Step 3: Update CLAUDE.md shadcn path reference**

Change:

```markdown
- shadcn/ui 组件位于 `components/ui/`
- 引入路径使用项目本地路径（`@/components/ui/button`）
```

To:

```markdown
- shadcn/ui 组件位于 `shared/components/ui/`，通过 CLI 添加：`pnpm dlx shadcn@latest add <component>`
- 引入路径使用项目本地路径（`@/shared/components/ui/button`），而非外部包
```

**Step 4: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 5: Commit**

```bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: update AGENTS.md and CLAUDE.md for Feature First architecture"
```

---

## Task 7: Clean up old test path and verify full build

**Step 1: Move test setup into shared**

```bash
mkdir -p src/shared/test
mv src/test/setup.ts src/shared/test/setup.ts
rmdir src/test
```

**Step 2: Update vitest.config.ts**

```ts
// Before
setupFiles: ["./src/test/setup.ts"],
// After
setupFiles: ["./src/shared/test/setup.ts"],
```

**Step 3: Run full test suite**

Run: `pnpm test:run`
Expected: All tests pass.

**Step 4: Run full build**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 5: Run Biome check**

Run: `npx @biomejs/biome check --write .`
Expected: No errors.

**Step 6: Commit**

```bash
git add src/shared/test/ vitest.config.ts
git add -u src/test/
git commit -m "refactor: move test setup to shared/test"
```

---

## Summary

| Task | Description | Commits |
|------|-------------|---------|
| 1 | Migrate providers + config to shared/ | `refactor: migrate providers and config to shared/` |
| 2 | Scaffold feature directories with types | `feat: scaffold feature directories with types and public API` |
| 3 | Extract wallet feature from home page | `refactor: extract wallet feature from home page` |
| 4 | Set up (dex) Route Group | `feat: add (dex) Route Group with swap and portfolio pages` |
| 5 | Configure shadcn/ui for shared/ paths | `chore: configure shadcn/ui with shared/ paths` |
| 6 | Update project docs | `docs: update AGENTS.md and CLAUDE.md for Feature First architecture` |
| 7 | Clean up + full verification | `refactor: move test setup to shared/test` |
