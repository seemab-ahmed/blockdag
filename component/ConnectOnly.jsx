import { useActiveWallet, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { walletConnect, createWallet } from "thirdweb/wallets";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const client = createThirdwebClient({
  clientId: "39b118976e9e817bc3799d54ddf74337",
});

const wallets = [
  walletConnect({
    projectId: "39b118976e9e817bc3799d54ddf74337",
    qrModal: true,
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
];

export default function ConnectOnly() {
  const router = useRouter();
  const wallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  // Get wallet address when connected
  useEffect(() => {
    const getAddress = async () => {
      if (connectionStatus === "connected" && wallet) {
        try {
          const account = await wallet.getAccount();
          if (account?.address) {
            setWalletAddress(account.address);
            console.log("Wallet connected:", account.address);
          }
        } catch (err) {
          console.error("Error getting wallet address:", err);
        }
      }
    };
    getAddress();
  }, [connectionStatus, wallet]);

  const verifyWallet = useCallback(async () => {
    if (!walletAddress) return;

    setIsChecking(true);
    setError("");

    try {
      console.log("Verifying wallet:", walletAddress);
      const response = await fetch(`/api/check-sheet?wallet=${walletAddress}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Verification result:", result);

      if (result.exists) {
        setPopup({ show: true, message: "Wallet verified! Redirecting...", type: "success" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
          router.push("/dashboard");
        }, 2000);
      } else {
        setPopup({ show: true, message: "Access restricted: Wallet not recognized. Disconnecting...", type: "error" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
          if (wallet) wallet.disconnect();
          setWalletAddress("");
        }, 2000);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setPopup({ show: true, message: err.message || "Failed to verify wallet. Please try again later.", type: "error" });
      setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
    } finally {
      setIsChecking(false);
    }
  }, [walletAddress, router, wallet]);

  // Verify wallet when address is available
  useEffect(() => {
    if (walletAddress) {
      verifyWallet();
    }
  }, [walletAddress, verifyWallet]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{
          label: "Connect Wallet",
          style: {
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "600",
          }
        }}
      />

      {isChecking && (
        <p className="mt-4 text-gray-600">Verifying wallet...</p>
      )}

      {popup.show && (
        <div
          className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${
            popup.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {popup.message}
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 max-w-[300px] text-center">
          {error.includes("500") 
            ? "Server error. Please try again later." 
            : error}
        </p>
      )}

      {walletAddress && (
        <p className="mt-2 text-sm text-gray-500">
          Connected: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </p>
      )}
    </div>
  );
}