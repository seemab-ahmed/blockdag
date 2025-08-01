'use client';
import { useActiveWallet, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { walletConnect, createWallet } from "thirdweb/wallets";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Popup from "./Popup";

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
        localStorage.setItem("walletAddress", walletAddress);
        setPopup({ show: true, message: "Wallet verified! Redirecting...", type: "success" });
        router.push("/dashboard");
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
        }, 5000);
      } else {
        localStorage.removeItem("walletAddress");
        setPopup({ show: true, message: "Access restricted: Wallet not recognized. Disconnecting...", type: "error" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
          if (wallet) wallet.disconnect();
          setWalletAddress("");
        }, 5000);
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 50 50"
            style={{ display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
              opacity="0.4"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="31.4 94.2"
              transform="rotate(-90 25 25)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}


      {popup.show && (
        <Popup
          title="Success"
          message="Login Successful!"
          type={popup.type}
        />
      )}

      {error && (
       <Popup
          title="Error"
          message="Validation failed. Please try again."
          type={popup.type}
        />
      )}

      {error && (
        <p className="mt-4 text-red-500 max-w-[300px] text-center">
          {error.includes("500") 
            ? "Server error. Please try again later." 
            : error}
        </p>
      )}
    </div>
  );
}