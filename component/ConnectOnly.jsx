"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Popup from "./Popup";
import {
  useAppKitAccount,
  useDisconnect,
  useAppKit,
} from "@reown/appkit/react";

export default function ConnectOnly() {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null); // New error state
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  // Auto-redirect if not connected
  useEffect(() => {
    if (!isConnected) router.replace("/");
    // setTimeOut(()=>{
    //   window.location.reload();
    // }, 3000)
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      router.replace("/dashboard");
    }
    return;
  }, [isConnected]);

  // Auto-logout after 15 minutes
  useEffect(() => {
    if (!isConnected) return;

    const timer = setTimeout(() => {
      disconnect();
      router.push("/");
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [isConnected, disconnect]);

  const verifyWallet = async () => {
    if (!address) return;

    setIsChecking(true);
    setError(null); // Reset error state

    try {
      const response = await fetch(`/api/check-sheet?wallet=${address}`);

      if (!response.ok) {
        throw new Error("Failed to verify wallet");
      }

      const result = await response.json();

      if (!result.exists) {
        throw new Error("Wallet not verified in our system");
      }
      // Successful verification
      setPopup({
        show: true,
        message: "Wallet verified! Redirecting...",
        type: "success",
      });
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Verification failed");

      // Show error popup
      setPopup({
        show: true,
        message: err.message || "Access denied. Disconnecting...",
        type: "error",
      });

      // Auto-disconnect after showing error
      setTimeout(async () => {
        await disconnect();
        router.push("/");
      }, 3000);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-verify on connection
  useEffect(() => {
    if (isConnected) verifyWallet();
  }, [isConnected]);



  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {isChecking ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <button
          onClick={() => {
            open({ view: "Connect" });
          }}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            backgroundColor: "#0094FF",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      )}

      {popup.show && (
        <Popup title="Success" message={popup.message} type={popup.type} />
      )}

      {error && <Popup title="Error" message={error} type="error" />}
    </div>
  );
}
