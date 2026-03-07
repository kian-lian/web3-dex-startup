import { describe, expect, it } from "vitest";
import { wagmiConfig } from "@/shared/config/wagmi";

describe("wagmi config", () => {
  it("should include all required mainnet chains", () => {
    const chainIds = wagmiConfig.chains.map((chain) => chain.id);

    // Ethereum mainnet
    expect(chainIds).toContain(1);
    // Arbitrum
    expect(chainIds).toContain(42161);
    // Optimism
    expect(chainIds).toContain(10);
    // Polygon
    expect(chainIds).toContain(137);
    // Base
    expect(chainIds).toContain(8453);
  });

  it("should include testnets when NEXT_PUBLIC_ENABLE_TESTNETS is true", () => {
    // .env.test sets NEXT_PUBLIC_ENABLE_TESTNETS=true
    const chainIds = wagmiConfig.chains.map((chain) => chain.id);

    // Sepolia
    expect(chainIds).toContain(11155111);
    // Arbitrum Sepolia
    expect(chainIds).toContain(421614);
  });

  it("should have at least 5 mainnet chains configured", () => {
    expect(wagmiConfig.chains.length).toBeGreaterThanOrEqual(5);
  });
});
