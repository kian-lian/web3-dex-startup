# Web3 DEX 项目开发宪法

Version: 2.0 | Ratified: 2026-02-26

本文件定义不可动摇的核心开发原则。所有 AI Agent 必须无条件遵循。

---

## 治理 (Governance)

- **文档优先级：** constitution.md > CLAUDE.md > AGENTS.md > 单次会话指令
- **修改流程：** 对本宪法的任何修改必须通过 Pull Request 审查
- **项目定位：** 纯前端 DEX 聚合器——不编写、不部署、不审计智能合约

---

## 第一条：安全性至上 (Security First) — 不可协商

Web3 项目直接涉及用户资产，安全是一切工作的前提。

- **1.1 (私钥零接触):** 项目代码不得处理、存储或传输用户私钥。所有签名操作委托钱包（Wagmi/RainbowKit）完成。
- **1.2 (环境变量隔离):** 密钥、API Key、Project ID 等敏感信息通过 `.env.local` 注入，绝不硬编码。`.env*` 已被 `.gitignore` 排除，不得移除此规则。
- **1.3 (输入校验):** 所有用户输入的链上参数（地址、金额、slippage）必须在提交前用 `viem` 工具函数（`isAddress`、`parseEther`）校验，不得自行实现校验逻辑。
- **1.4 (依赖审慎):** Web3 相关依赖仅限 `wagmi`、`viem`、`@rainbow-me/rainbowkit` 及其官方生态。引入新依赖前必须评估安全性和必要性。
- **1.5 (Slippage 保护):** 所有 swap 交易必须设置滑点上限，禁止发起无滑点保护的交易。默认滑点应≤ 0.5%，用户可自行调整但需明确警告高滑点风险。
- **1.6 (Approve 安全):** 禁止请求无限授权（`MaxUint256`）。Token approve 金额应精确匹配交易所需，或提供明确的用户选择。

---

## 第二条：类型安全铁律 (Type Safety) — 不可协商

TypeScript 严格模式是项目的安全网，不得绕过。

- **2.1 (禁止 any):** 绝不允许 `any`。使用 `unknown` + 类型守卫，或正确定义类型。
- **2.2 (禁止断言滥用):** `as` 仅允许在确有必要且附带注释说明原因时使用。禁止用 `as` 掩盖类型错误。
- **2.3 (链上数据类型化):** 所有链上数据（ABI、交易参数、返回值）必须有明确类型定义。充分利用 Wagmi/Viem 的类型推导。

---

## 第三条：组件架构原则 (Component Architecture)

遵循 Next.js App Router 的 Server/Client 组件模型，最小化客户端 JavaScript。

- **3.1 (Server Component 优先):** 默认所有组件为 Server Component。仅在需要浏览器 API、React 状态、事件监听或 Web3 hooks 时标记 `"use client"`。
- **3.2 (Client 边界下沉):** `"use client"` 边界下沉到组件树叶子节点。交互逻辑封装在小的 Client Component 中。
- **3.3 (Provider 隔离):** 全局 Provider 统一在 `src/providers/` 管理，通过组合模式嵌套，禁止在页面组件中直接包裹 Provider。

---

## 第四条：状态管理分层 (State Management Hierarchy)

不同来源的状态使用不同管理方案，不得混用。

- **4.1 (链上状态):** 通过 Wagmi hooks（`useReadContract`、`useBalance`）获取，TanStack Query 管理缓存。禁止手动缓存链上数据到 React state。
- **4.2 (服务端状态):** 链下 API 数据（价格、元数据）使用 TanStack Query。
- **4.3 (客户端状态):** 纯 UI 状态使用 `useState`/`useReducer`。全局 UI 状态优先通过组件组合和 props 传递解决。

---

## 第五条：错误处理原则 (Error Handling)

Web3 交互天然不稳定，必须对所有可能失败的操作进行显式错误处理。

- **5.1 (交易错误):** 所有链上写操作必须处理用户拒绝、gas 不足、交易回滚，并向用户提供清晰反馈。
- **5.2 (网络错误):** 必须处理 RPC 不可达、链切换失败等网络层错误。
- **5.3 (禁止静默吞错):** 禁止空 `catch` 块。所有 `catch` 必须记录错误或向用户展示反馈。

---

## 第六条：代码风格统一 (Code Consistency)

代码风格由工具强制保证，不依赖人工自觉。

- **6.1 (工具权威):** Biome 是代码风格的唯一权威来源。提交前必须通过检查，不得绕过。
- **6.2 (命名一致性):** 遵循统一的命名约定（具体规则见 `AGENTS.md`），禁止混用多种风格。

---

## 本项目不是 (Negative Definitions)

以下明确列出本项目的边界，防止 AI Agent 偏离方向：

- **不是**智能合约开发项目——不编写 Solidity/Vyper 代码
- **不是**多链桥接项目——不实现跨链资产转移逻辑
