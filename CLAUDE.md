# 核心原则（最高优先级）

@constitution.md

# 项目上下文

@AGENTS.md

# Claude Code 专属指南

以下内容仅与 Claude Code 工作流相关，通用项目信息见 `AGENTS.md`。

## 技术栈文档入口

查阅技术栈用法时，优先访问以下 LLM 友好文档：

- Next.js：https://nextjs.org/llms.txt
- Wagmi：https://wagmi.sh/llms.txt
- RainbowKit：https://rainbowkit.com/llms.txt
- shadcn/ui：https://ui.shadcn.com/llms.txt

## UI 组件

- shadcn/ui 组件位于 `components/ui/`，通过 CLI 添加：`npx shadcn@latest add <component>`
- 引入路径使用项目本地路径（`@/components/ui/button`），而非外部包

## MCP 服务集成

若以下 MCP 未安装，应提示用户配置：

- shadcn MCP：`npx shadcn@latest mcp init --client claude`（[文档](https://ui.shadcn.com/docs/mcp)）
- TanStack MCP：`claude mcp add --transport stdio --scope user tanstack -- npx @tanstack/cli mcp`（[文档](https://tanstack.com/cli/latest/docs/mcp/overview)）

## 代码质量命令

- 格式化：`npx @biomejs/biome format --write .`
- Lint：`npx @biomejs/biome lint .`
- 全量检查：`npx @biomejs/biome check --write .`

## 工具链

- 包管理器：pnpm
- GitHub 操作：`gh` CLI
