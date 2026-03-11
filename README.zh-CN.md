# DEX 启动模板

[English](./README.md) | [简体中文](./README.zh-CN.md)

一个面向生产实践的 DEX（去中心化交易所）前端启动模板，基于 Next.js、WalletConnect，并内置工程化质量与安全门禁。

## 模板内置能力

- 基于 Next.js App Router（`next@16`）
- Web3 连接栈：`wagmi` + `viem` + `rainbowkit`
- Feature-First 架构（`app -> features -> shared`）
- 环境变量统一入口（`src/shared/config/env.ts`）
- 可观测性基础（`@sentry/nextjs` + `pino`）
- 质量门禁：Biome、TypeScript strict、Vitest、cspell
- 提交规范：Husky + lint-staged + commitlint

## 技术栈

- **框架**：Next.js（App Router）
- **语言**：TypeScript（strict）
- **Web3**：wagmi + viem + RainbowKit
- **状态/数据**：TanStack Query
- **样式**：Tailwind CSS v4
- **测试**：Vitest + Testing Library
- **代码质量**：Biome + cspell
- **监控**：Sentry + Pino

## 快速开始

### 1）前置要求

- Node.js 20+
- pnpm 9+

### 2）安装依赖

```bash
pnpm install
```

### 3）配置环境变量

```bash
cp .env.example .env.local
```

在 `.env.local` 中设置 WalletConnect Project ID：

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

> 获取地址：https://cloud.walletconnect.com

### 4）启动开发环境

```bash
pnpm dev
```

访问：http://localhost:3000

## 5 分钟上手（新同学）

如果你刚加入项目，建议按这个顺序完成：

1. 启动项目：`pnpm dev`
2. 跑基础检查：`pnpm lint && pnpm typecheck && pnpm test:run`
3. 先读核心目录：
   - `src/app/`（路由与页面编排）
   - `src/features/`（业务域）
   - `src/shared/`（跨 feature 基础设施）
4. 理解环境变量契约：`src/shared/config/env.ts`
5. 提交第一个 PR 前执行：
   - `pnpm run ci`
   - `pnpm security:audit`
   - `pnpm security:secrets`

建议第一个贡献：

- 从小的文档优化或测试补充开始，并确保所有质量门禁通过。

## 项目结构

```text
src/
  app/                  # Next.js 路由与布局层
  features/             # 业务域模块（swap、token、wallet）
  shared/               # 跨 feature 的通用基础设施
    config/             # env、wagmi 配置
    providers/          # React Query / Web3 Provider
    lib/                # 通用工具函数
  test/                 # 测试初始化与公共测试工具
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产包 |
| `pnpm start` | 启动生产服务 |
| `pnpm lint` | 运行 Biome 检查 |
| `pnpm typecheck` | 运行 TypeScript 类型检查（`tsc --noEmit`） |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm test` | Vitest 监听模式 |
| `pnpm test:run` | Vitest 单次运行 |
| `pnpm test:coverage` | 生成覆盖率报告 |
| `pnpm spellcheck` | 对 TS/TSX 运行拼写检查 |
| `pnpm run ci` | 本地执行完整质量门禁 |
| `pnpm security:audit` | 扫描依赖高危/严重漏洞 |
| `pnpm security:secrets` | 扫描仓库硬编码密钥 |

## 工程质量门禁

发起 PR 前建议执行：

```bash
pnpm run ci
pnpm security:audit
pnpm security:secrets
```

CI 必过检查：

- `quality`（lint、typecheck、test、build、spellcheck）
- `security-sca`（依赖漏洞扫描）
- `security-secret`（gitleaks 密钥扫描）

建议为 `main` 分支开启保护策略：

- 合并前必须走 Pull Request
- 至少 1 个 Approving Review
- 必须通过以下状态检查：
  - `quality`
  - `security-sca`
  - `security-secret`

更多说明：

- `docs/engineering/ci-quality-gates.md`
- `docs/engineering/security-baseline.md`

## 环境与安全说明

- 禁止提交密钥，私有值请放在 `.env.local`。
- 应用代码请统一从 `src/shared/config/env.ts` 读取环境变量。
- 生产构建必须提供 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`。

## 链配置

默认链配置位于：`src/shared/config/wagmi.ts`。

## 贡献规范

- 使用 Conventional Commits（`feat:`、`fix:`、`chore:` 等）
- PR 尽量小而聚焦
- 行为变更请附验证证据

## License

MIT
