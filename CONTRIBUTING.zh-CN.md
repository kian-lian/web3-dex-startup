# 贡献指南

[English](./CONTRIBUTING.md) | [简体中文](./CONTRIBUTING.zh-CN.md)

本文档定义 `web3-cex-startup` 的贡献流程与合并规范。

## 1）范围与原则

- 改动应小而聚焦，并且可回滚。
- 严格遵守 Feature-First 依赖方向：
  - 允许：`app -> features -> shared`、`app -> shared`
  - 禁止：`shared -> features`、反向 feature 依赖
- feature 对外调用只能通过各 feature 的 `index.ts` 公共 API。

示例：

```ts
// 正确
import { SwapCard } from "@/features/swap";

// 错误
import { SwapCard } from "@/features/swap/components/swap-card";
```

## 2）文件头注释规范

所有源码文件（`.ts`, `.tsx`, `.js`, `.jsx`）顶部必须添加注释头：

```ts
/**
 * author: <作者名>
 * create time: <YYYY-MM-DD HH:mm:ss>
 * last edit time: <YYYY-MM-DD HH:mm:ss>
 * description: <简要描述文件的功能和作用>
 */
```

- **新建文件：** `create time` 和 `last edit time` 设为当前时间。
- **修改文件：** 仅更新 `last edit time`；若你不在 `author` 列表中则追加姓名（逗号分隔）；`create time` 保持不变。
- **description：** 简要说明文件的功能和作用，方便他人快速了解。
- **排除范围：** 自动生成的文件（如 `shared/components/ui/`）、配置文件（`.json`, `.config.*`）、类型声明文件（`.d.ts`）不需要添加。

## 3）开发环境准备

前置要求：

- Node.js `>=20`
- pnpm `>=9`

安装与启动：

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

本地构建验证：

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=test-project-id pnpm build
```

## 4）分支与提交规范

分支命名（推荐）：

- `feat/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`
- `docs/<short-topic>`
- `refactor/<short-topic>`

提交规范：

- 必须使用 Conventional Commits。
- 允许的提交类型：
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
- subject 最长 `72` 字符
- 禁止添加 AI Co-Authored-By 尾注（`claude`/`anthropic`）

Git hooks：

- `pre-commit`：执行 `lint-staged`
- `commit-msg`：执行 `commitlint`

## 5）Pull Request 流程

### PR 标题

PR 标题必须符合 Conventional Commits，例如：

- `feat(swap): support max slippage`
- `fix(wallet): avoid stale balance`

### PR 内容要求

按 `/.github/pull_request_template.md` 填写并补充：

- 变更摘要与动机
- 影响范围与用户影响
- 验证证据
- 风险与回滚方案

### 必过检查

合并前必须通过以下检查：

- `semantic-pr-title`
- `quality`
- `security-sca`
- `security-secret`

其中 `quality` 包含：

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:run`
- `pnpm build`
- `pnpm spellcheck`

## 6）主分支保护（仓库设置）

`main` 必须开启：

- 合并前必须通过 Pull Request
- 至少 `1` 个 Approving Review
- 必须通过 CODEOWNERS 审批
- 合并前必须解决会话（conversation）
- 必须通过状态检查：
  - `semantic-pr-title`
  - `quality`
  - `security-sca`
  - `security-secret`
- 管理员同样受保护策略约束

## 7）自动合并与依赖更新

仓库必须开启：

- Auto-merge
- GitHub Actions 工作流默认权限设为 `read and write`
- 开启 `Allow GitHub Actions to approve pull requests`

Dependabot 策略：

- 每周检查（`npm` 与 `github-actions`）
- `patch/minor` 在检查通过后自动审批并自动合并
- `major` 版本更新保持人工审核

## 8）发布流程

发布使用 Release Please 自动化：

- 工作流：`/.github/workflows/release.yml`
- 触发：`push main` 或手动触发
- 配置文件：
  - `/.release-please-config.json`
  - `/.release-please-manifest.json`

流程：

1. `main` 累积 Conventional Commits
2. Release Please 自动创建/更新 release PR
3. release PR 合并后，自动创建 tag 与 GitHub Release

版本规则：

- `feat:` -> minor
- `fix:`、`refactor:`、`perf:` -> patch
- `!` 或 `BREAKING CHANGE:` -> major

## 9）安全要求

- 禁止提交任何密钥
- 私有配置仅放在 `.env.local`
- 环境变量统一从 `src/shared/config/env.ts` 读取
- 发 PR 前执行：

```bash
pnpm security:audit
pnpm security:secrets
```

## 10）发起 PR 前检查

执行：

```bash
pnpm run ci
pnpm security:audit
pnpm security:secrets
```

确认：

- 本地测试和构建通过
- PR 标题符合 Conventional Commits
- 涉及行为/流程改动时同步更新文档
