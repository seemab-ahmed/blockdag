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
  name: "AppKit",
  description: "AppKit Example",
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
  },
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,

  features: {
    email: false,
    socials: [],
    analytics: true, // Optional - defaults to your Cloud configuration
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
