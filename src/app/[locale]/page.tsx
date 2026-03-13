import { AccountInfo, ConnectButton } from "@/features/wallet";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
      <header className="text-center">
        <h1 className="font-bold text-3xl text-zinc-900 tracking-tight dark:text-zinc-50">
          Web3 DEX
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Connect your wallet to get started
        </p>
      </header>
      <ConnectButton />
      <AccountInfo />
    </div>
  );
}
