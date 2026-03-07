import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { appName, enableTestnets, walletConnectProjectId } from "./env";

const mainnetChains = [mainnet, arbitrum, optimism, polygon, base] as const;
const testnetChains = [sepolia, arbitrumSepolia] as const;

const chains = enableTestnets
  ? ([...mainnetChains, ...testnetChains] as const)
  : mainnetChains;

export const wagmiConfig = getDefaultConfig({
  appName,
  projectId: walletConnectProjectId || "YOUR_PROJECT_ID",
  chains,
  ssr: true,
});
