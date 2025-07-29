"use client";

import { useActiveWallet, useActiveWalletConnectionStatus } from "thirdweb/react";
// import { createWallet, walletConnect } from "@thirdweb-dev/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const client = createThirdwebClient({
  clientId: "39b118976e9e817bc3799d54ddf74337",
});

const wallets = [
  walletConnect(), // this is what enables the QR modal
  createWallet("com.trustwallet.app"),
  createWallet("io.metamask"),
  createWallet("app.pluuswallet"),
  createWallet("com.binance.wallet"),
  createWallet("com.coinbase.wallet"),
];

export default function ConnectOnly() {
  const wallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const router = useRouter();

  useEffect(() => {
    const checkWalletSheet = async () => {
      if (connectionStatus !== "connected" || !wallet?.address) return;

      const response = await fetch(`/api/check-sheet?wallet=${wallet.address}`);
      const result = await response.json();

      if (result.exists) {
        router.push("/dashboard");
      } else {
        alert("Access restricted: Wallet not recognized.");
      }
    };

    checkWalletSheet();
  }, [wallet, connectionStatus, router]);

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{ label: "Connect Wallet" }}
      connectModal={{
        title: "Connect wallet",
        size: "compact",
        showThirdwebBranding: false,
      }}
    />
  );
}