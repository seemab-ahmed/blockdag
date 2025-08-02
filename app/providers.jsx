'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from "thirdweb/react";
const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <ThirdwebProvider
      activeChain="sepolia"
      supportedChains={["ethereum", "polygon", "binance", "arbitrum"]}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </ThirdwebProvider>
  );
}


