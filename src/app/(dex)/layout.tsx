import { ConnectButton } from "@/features/wallet";

export default function DexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="flex items-center justify-between border-zinc-200 border-b px-6 py-4 dark:border-zinc-800">
        <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
          Web3 DEX
        </span>
        <ConnectButton />
      </nav>
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
    </div>
  );
}
