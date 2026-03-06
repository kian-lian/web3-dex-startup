"use client";

import { QueryProvider } from "./query-provider";
import { Web3Provider } from "./web3-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Web3Provider>{children}</Web3Provider>
    </QueryProvider>
  );
}
