# 项目概述

- 基于 Next.js 的 Web3 DEX 启动项目

# 技术栈

## 框架

- [Next.js](https://nextjs.org)（App Router）— 完整文档：https://nextjs.org/llms.txt
- 路由基于文件系统，关键文件：`layout.tsx`、`page.tsx`、`loading.tsx`、`error.tsx`

## UI

- 样式方案：Tailwind CSS
- 组件库：[shadcn/ui](https://ui.shadcn.com)（基于 Radix UI + Tailwind CSS）
- shadcn 组件位于 `components/ui/` 目录，通过 CLI 添加：`npx shadcn@latest add <component>`
- 使用 shadcn 组件时从项目本地路径引入（如 `@/components/ui/button`），而非外部包
- shadcn 完整文档：https://ui.shadcn.com/llms.txt
- shadcn 提供 MCP 服务，若未安装应提示用户配置：https://ui.shadcn.com/docs/mcp
- MCP 安装命令：`npx shadcn@latest mcp init --client claude`

## 数据请求

- [TanStack Query](https://tanstack.com/query)（React Query）— 服务端状态管理与缓存
- 由 Wagmi 内置集成，共享同一个 QueryClient
- TanStack 提供 MCP 服务，若未安装应提示用户配置：https://tanstack.com/cli/latest/docs/mcp/overview
- MCP 安装命令：claude mcp add --transport stdio --scope user tanstack -- npx @tanstack/cli mcp

## Web3

- [Wagmi](https://wagmi.sh) — ETH 交互库，提供 hooks 进行链上读写（完整文档：https://wagmi.sh/llms.txt）
- [RainbowKit](https://rainbowkit.com) — 钱包连接 UI 组件（完整文档：https://rainbowkit.com/llms.txt）

# 项目规范

## 命名规范

- 文件及目录命名遵循 kebab-case（如 `token-list.tsx`、`swap-provider.ts`）

## Git 规范

- Commit 信息遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范
- 格式：`<type>(<scope>): <description>`
- 常用 type：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`

## 代码质量

- 使用 [Biome](https://biomejs.dev) 进行代码格式化与 lint
- 配置文件：`biome.json`
- 格式化：`npx @biomejs/biome format --write .`
- Lint：`npx @biomejs/biome lint .`
- 全量检查：`npx @biomejs/biome check --write .`

## 工具链

- 使用 `gh` CLI 操作 GitHub（PR、Issue 等）
