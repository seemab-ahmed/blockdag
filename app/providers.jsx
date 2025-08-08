"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, bsc } from "viem/chains";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// 1. Configure Reown AppKit
// const reownConfig = {
//   appName: "Your App Name",
//   appIcon: "https://your-app-url.com/logo.png",
//   chains: [sepolia, mainnet, polygon, arbitrum, bsc],
//   theme: {
//     primaryColor: "#2563eb",
//     borderRadius: "8px",
//     fontFamily: "inherit",
//   },
//   walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
//   defaultChain: sepolia,
// };
const projectId = "21cdeb2da197b288fc649b9305a3aece";

// 2. Create a metadata object - optional
const metadata = {
  name: "BlockDag",
  description: "BlockDag",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const networks = [mainnet, bsc];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  themeVariables: {
    primaryColor: "#2563eb",
    borderRadius: "8px",
    fontFamily: "inherit",

    "--wcm-footer-display": "none",
    "--wcm-footer-background-color": "transparent",
    "--wcm-footer-font-size": "0",
    "--wcm-footer-color": "transparent",
    "--wcm-footer-height": "0",
  },
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  featuredWalletIds: [
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "dd15a3530dc4de4c50ebb22010824c41337403efec713f1187695c72934fb94c",
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
  ],
  features: {
    email: false,
    socials: [],
    allWallets: true,
  },
  walletConnect: {
    modalOptions: {
      themeVariables: {
        "--wcm-footer-display": "none", // Ensures WalletConnect respects the setting
      },
    },
  },
});
// 2. Set up query client
const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
