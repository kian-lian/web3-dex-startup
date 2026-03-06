import { describe, expect, it } from "vitest";
import { wagmiConfig } from "@/config/wagmi";

describe("wagmi config", () => {
  it("should include all required chains", () => {
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

  it("should have exactly 5 chains configured", () => {
    expect(wagmiConfig.chains).toHaveLength(5);
  });
});
