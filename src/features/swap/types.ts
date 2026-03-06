import type { Address } from "viem";

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  slippage: number;
}

export interface SwapQuote {
  amountOut: bigint;
  priceImpact: number;
  route: string;
}
