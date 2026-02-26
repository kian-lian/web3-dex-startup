# AGENTS.md

本文件为 AI 编码代理提供项目上下文，遵循 [AGENTS.md](https://agents.md) 开放标准。

---

## 项目概述

基于 Next.js 的 Web3 DEX 聚合器前端。通过 Wagmi/RainbowKit 连接用户钱包，聚合链上 DEX 流动性，提供代币兑换界面。纯前端项目，不包含智能合约或后端服务。

## 技术架构

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16 |
| UI | Tailwind CSS + shadcn/ui | v4 |
| Web3 | Wagmi + RainbowKit | v2 |
| 状态管理 | TanStack Query | v5 |
| 语言 | TypeScript（严格模式） | v5 |
| 代码质量 | Biome | v2 |
| 包管理 | pnpm | - |

## 目录结构

```
src/
  app/            # Next.js 页面和布局（App Router）
  components/     # 业务组件
  components/ui/  # shadcn/ui 组件（CLI 生成，勿手动修改）
  config/         # 配置文件（wagmi 链配置等）
  providers/      # 全局 Provider（Web3Provider、QueryProvider）
  hooks/          # 自定义 React hooks
  lib/            # 工具函数和通用逻辑
  types/          # 共享类型定义
```

## Setup 命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm lint             # 代码检查（Biome）
pnpm format           # 代码格式化（Biome）
```

## 代码风格

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件/目录 | kebab-case | `token-list.tsx`、`swap-provider.ts` |
| React 组件 | PascalCase | `TokenList`、`SwapCard` |
| Hooks | camelCase，use 前缀 | `useTokenBalance`、`useSwapQuote` |
| 常量 | UPPER_SNAKE_CASE | `MAX_SLIPPAGE`、`DEFAULT_CHAIN_ID` |
| 类型/接口 | PascalCase | `TokenInfo`、`SwapParams` |

### 组件规范

- 默认 Server Component，仅在需要浏览器 API / React 状态 / Web3 hooks 时标记 `"use client"`
- `"use client"` 边界下沉到叶子节点
- 使用 shadcn/ui 组件时从 `@/components/ui/` 引入

### Import 顺序

1. React / Next.js
2. 第三方库（wagmi、viem、@tanstack 等）
3. 项目内部模块（`@/components`、`@/hooks`、`@/lib`）
4. 类型导入（`type` imports 放最后）

## Web3 约定

### Provider 结构

所有全局 Provider 在 `src/providers/` 中管理，通过组合模式嵌套：

```
QueryProvider → Web3Provider（WagmiProvider + RainbowKitProvider）
```

### 链上数据处理

- 链上数据通过 Wagmi hooks 获取（`useReadContract`、`useBalance`）
- 禁止手动缓存链上数据到 React state，由 TanStack Query 管理
- 链下 API 数据（价格、元数据）使用 TanStack Query

### 钱包交互

- 地址校验：`viem` 的 `isAddress()`
- 金额转换：`viem` 的 `parseEther()` / `formatEther()`
- 签名操作委托钱包完成，代码不接触私钥

### 支持的链

Ethereum、Arbitrum、Optimism、Polygon、Base（配置见 `src/config/wagmi.ts`）

## Git 规范

### Commit 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)：

```
<type>(<scope>): <description>
```

常用 type：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`

### 环境变量

- 敏感信息通过 `.env.local` 注入
- `.env*` 已被 `.gitignore` 排除
- 公开变量使用 `NEXT_PUBLIC_` 前缀
- 示例见 `.env.example`

## 安全检查清单

提交代码前，确认以下各项：

- [ ] 无硬编码密钥、私钥或 API Key
- [ ] 用户输入的地址/金额已用 viem 校验
- [ ] Swap 交易设置了滑点上限
- [ ] Token approve 金额精确匹配（非 MaxUint256）
- [ ] 所有 catch 块包含错误处理逻辑（无空 catch）
- [ ] 交易错误向用户提供了清晰反馈
- [ ] `npx @biomejs/biome check .` 通过
