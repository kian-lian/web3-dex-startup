"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Web3 DEX
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Connect your wallet to get started
        </p>
      </header>

      <ConnectButton />

      {isConnected && (
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Wallet Info
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Address</dt>
              <dd className="font-mono text-zinc-900 dark:text-zinc-50">
                {address?.slice(0, 6)}...{address?.slice(-4)}
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
      )}
    </div>
  );
}
