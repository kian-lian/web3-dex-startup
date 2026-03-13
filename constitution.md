# Web3 DEX Project Development Constitution

Version: 2.2 | Ratified: 2026-03-08

This document defines immutable core development principles. All AI Agents must follow unconditionally.

---

## Governance

- **Document priority:** constitution.md > CLAUDE.md > AGENTS.md > single-session instructions
- **Amendment process:** Any changes to this constitution must go through a Pull Request review
- **Project scope:** Frontend-only DEX startup template — no writing, deploying, or auditing smart contracts

---

## Article 1: Security First — Non-Negotiable

Web3 projects directly handle user assets. Security is the prerequisite for all work.

- **1.1 (Zero Private Key Access):** Project code must never handle, store, or transmit user private keys. All signing operations are delegated to wallets (Wagmi/RainbowKit).
- **1.2 (Environment Variable Isolation):** Secrets, API keys, and Project IDs are injected via `.env.local`, never hardcoded. Only `.env.example` (a template with no real values) is committed; all other `.env*` files are gitignored.
- **1.3 (Input Validation):** All user-supplied on-chain parameters (addresses, amounts, slippage) must be validated before submission using `viem` utility functions (`isAddress`, `parseEther`). Do not implement custom validation logic.
- **1.4 (Dependency Prudence):** Web3-related dependencies are limited to `wagmi`, `viem`, `@rainbow-me/rainbowkit`, and their official ecosystem. Evaluate security and necessity before introducing new dependencies.
- **1.5 (Slippage Protection):** All swap transactions must set a slippage cap. Transactions without slippage protection are forbidden. Default slippage should be ≤ 0.5%; users may adjust but must receive a clear high-slippage warning.
- **1.6 (Approve Safety):** Infinite approvals (`MaxUint256`) are forbidden. Token approve amounts must exactly match the transaction requirement, or provide an explicit user choice.

---

## Article 2: Type Safety — Non-Negotiable

TypeScript strict mode is the project's safety net and must not be bypassed.

- **2.1 (No `any`):** `any` is never allowed. Use `unknown` + type guards, or define proper types.
- **2.2 (No Assertion Abuse):** `as` is only permitted when genuinely necessary and accompanied by a comment explaining why. Do not use `as` to mask type errors.
- **2.3 (Typed On-Chain Data):** All on-chain data (ABIs, transaction parameters, return values) must have explicit type definitions. Leverage Wagmi/Viem type inference fully.

---

## Article 3: Component Architecture

Follow the Next.js App Router Server/Client Component model. Minimize client-side JavaScript.

- **3.1 (Server Components First):** All components are Server Components by default. Only add `"use client"` when browser APIs, React state, event listeners, or Web3 hooks are needed.
- **3.2 (Push Client Boundaries Down):** Push `"use client"` boundaries to leaf nodes in the component tree. Encapsulate interactive logic in small Client Components.
- **3.3 (Provider Isolation):** Global providers are managed centrally in `src/shared/providers/`, composed via nesting. Do not wrap providers directly in page components.

---

## Article 4: State Management Hierarchy

Different state sources use different management strategies. Do not mix them.

- **4.1 (On-Chain State):** Fetched via Wagmi hooks (`useReadContract`, `useBalance`), cached by TanStack Query. Do not manually cache on-chain data in React state.
- **4.2 (Server State):** Off-chain API data (prices, metadata) uses TanStack Query.
- **4.3 (Client State):** Pure UI state uses `useState`/`useReducer`. Global UI state should be solved through component composition and props first.

---

## Article 5: Error Handling

Web3 interactions are inherently unreliable. All potentially failing operations must have explicit error handling.

- **5.1 (Transaction Errors):** All on-chain write operations must handle user rejection, insufficient gas, and transaction revert, providing clear user feedback.
- **5.2 (Network Errors):** Must handle RPC unreachable, chain switch failures, and other network-layer errors.
- **5.3 (No Silent Swallowing):** Empty `catch` blocks are forbidden. Every `catch` must log the error or display feedback to the user.

---

## Article 6: Code Consistency

Code style is enforced by tooling, not human discipline.

- **6.1 (Tooling Authority):** Biome is the single source of truth for code style. All code must pass checks before committing — no bypassing.
- **6.2 (Naming Consistency):** Follow unified naming conventions (see `AGENTS.md`). Do not mix multiple styles.

---

## Article 7: Internationalization

i18n is a cross-cutting concern. Navigation must be locale-aware.

- **7.1 (Locale-Aware Navigation):** All in-app navigation (`Link`, `redirect`, `useRouter`, `usePathname`) MUST import from `@/shared/i18n/navigation`, never from `next/link` or `next/navigation`. This ensures the locale prefix is automatically applied to all routes.
- **7.2 (No Hardcoded Strings):** All user-facing strings must use `useTranslations()` from `next-intl`. Hardcoded display text in components is forbidden.

---

## What This Project Is Not (Negative Definitions)

These boundaries prevent AI Agents from going off-track:

- **Not** a smart contract project — no Solidity/Vyper code
- **Not** a cross-chain bridge project — no cross-chain asset transfer logic
