"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, bsc } from "viem/chains";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider, createConfig, http, injected } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
const projectId = "21cdeb2da197b288fc649b9305a3aece";

// 2. Create a metadata object - optional
const metadata = {
  name: "BlockDag",
  description: "BlockDag",
  url: "https://blockdag-tau.vercel.app/", // origin must match your domain & subdomain
  icons: ["https://purchase3.blockdag.network/favicon.png"],
};

// 3. Set the networks
const networks = [mainnet, bsc];

// 4. Create Wagmi Adapter

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  chains: [mainnet, bsc],
  transports: {
    [mainnet.id]: http(
      "https://mainnet.infura.io/v3/c0d6b944e7eb41039a517fd6a4836fed"
    ),
  },
  ssr: false,
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
