import type { Address, Hash } from "viem";

export interface TransactionRecord {
  hash: Hash;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}
