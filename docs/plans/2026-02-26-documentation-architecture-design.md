# 文档架构设计

Date: 2026-02-26

## 目标

全面重写 constitution.md、CLAUDE.md，新建 AGENTS.md，形成三层文档架构。

## 文档层级

```
constitution.md (宪法层 - 不可协商的安全/质量红线)
  ↓ 被 @import 引用
CLAUDE.md (操作层 - Claude Code 专属工作指南)
  ↓ @import 引用
AGENTS.md (上下文层 - 跨 AI 工具通用项目上下文)
```

优先级：constitution.md > CLAUDE.md > AGENTS.md > 会话指令

## 设计决策

1. **三层分离**：不同职责的内容分到不同文件，避免单文件膨胀
2. **中文主体**：保持现有风格，技术术语保留英文
3. **精简原则**：CLAUDE.md < 60 行，用 @imports 引用而非内联
4. **AGENTS.md 跨工具**：遵循 agents.md 开放标准，兼容 Cursor/Copilot/Codex
5. **DEX 聚合器定位**：安全条款聚焦前端 Web3 交互，非智能合约开发

## 各文件职责

| 文件 | 内容 | 大小 |
|------|------|------|
| constitution.md | 不可协商原则、安全红线、治理条款 | ~80 行 |
| CLAUDE.md | Claude 专属技术栈入口、MCP 配置、代码质量命令 | ~60 行 |
| AGENTS.md | 项目架构、目录结构、命令、代码风格、Web3 约定 | ~120 行 |

## 关键改进

- constitution: 精简为一条一行风格、新增 slippage/approve 安全条款、新增负面定义
- CLAUDE.md: 移除通用内容到 AGENTS.md、只保留 Claude Code 专属信息
- AGENTS.md: 全新创建、遵循开放标准、覆盖完整项目上下文
