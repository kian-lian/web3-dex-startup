# Web3 DEX

A decentralized exchange starter project built with Next.js.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Web3**: [Wagmi](https://wagmi.sh) + [viem](https://viem.sh)
- **Wallet Connection**: [RainbowKit](https://rainbowkit.com)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Code Quality**: [Biome](https://biomejs.dev)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

```bash
cp .env.example .env.local
```

Add your WalletConnect Project ID to `.env.local`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

> Get a free Project ID at [WalletConnect Cloud](https://cloud.walletconnect.com)

### Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── config/
│   └── wagmi.ts            # Wagmi config (chains, connectors)
├── providers/
│   ├── index.tsx           # Provider composition layer
│   ├── query-provider.tsx  # React Query Provider
│   └── web3-provider.tsx   # Wagmi + RainbowKit Provider
```

## Supported Chains

- Ethereum Mainnet
- Arbitrum
- Optimism
- Polygon
- Base

Modify supported chains in `src/config/wagmi.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code |

## License

MIT
