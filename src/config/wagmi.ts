import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, arbitrum, optimism, polygon, base } from "wagmi/chains";

// WalletConnect projectId is required for production
// Get one at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    "⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. " +
      "Wallet connections will not work. " +
      "Get a projectId at https://cloud.walletconnect.com",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Web3 DEX",
  projectId: projectId ?? "YOUR_PROJECT_ID",
  chains: [mainnet, arbitrum, optimism, polygon, base],
  ssr: true,
});
