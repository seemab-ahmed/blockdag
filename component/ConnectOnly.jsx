"use client";
import { useRef } from "react";
import {
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { walletConnect, createWallet } from "thirdweb/wallets";
import { mainnet, bsc } from "thirdweb/chains";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Popup from "./Popup";

export const client = createThirdwebClient({
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
  const logoutTimer = useRef(null);

  // Set walletJustConnected flag after logout, so popup only shows after login after logout
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("justLoggedOut") === "true") {
        sessionStorage.removeItem("justLoggedOut");
        sessionStorage.setItem("walletJustConnected", "true");
      }
    }
  }, []);

  useEffect(() => {
    const getAddress = async () => {
      if (connectionStatus === "connected" && wallet) {
        try {
          const account = await wallet.getAccount();
          if (account?.address) {
            setWalletAddress(account.address);
          }
        } catch (err) {
          console.error("Error getting wallet address:", err);
        }
      }
    };
    getAddress();
  }, [connectionStatus, wallet]);

  // Auto-logout after 15 minutes of connection
  useEffect(() => {
    if (connectionStatus === "connected" && wallet) {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(async () => {
        if (wallet && typeof wallet.disconnect === "function") {
          await wallet.disconnect();
        }
        sessionStorage.setItem("justLoggedOut", "true");
        localStorage.removeItem("walletAddress");
        router.push("/");
      }, 15 * 60 * 1000); // 15 minutes
    }
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [connectionStatus, wallet, router]);

  // Listen for wallet disconnect event (if supported)
  useEffect(() => {
    if (!wallet) return;
    const handleDisconnect = async () => {
      sessionStorage.setItem("justLoggedOut", "true");
      localStorage.removeItem("walletAddress");
      router.push("/");
    };
    if (wallet.provider?.on) {
      wallet.provider.on("disconnect", handleDisconnect);
    }
    return () => {
      if (wallet.provider?.removeListener) {
        wallet.provider.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [wallet, router]);

  const verifyWallet = useCallback(async () => {
    if (!walletAddress) return;

    setIsChecking(true);
    setError("");

    try {
      console.log("Verifying wallet:", walletAddress);
      const response = await fetch(`/api/check-sheet?wallet=${walletAddress}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
      const result = await response.json();
      if (result.exists) {
        localStorage.setItem("walletAddress", walletAddress);

        // Only show popup if walletJustConnected flag is set
        let showPopup = false;
        if (
          typeof window !== "undefined" &&
          sessionStorage.getItem("walletJustConnected") === "true"
        ) {
          showPopup = true;
          sessionStorage.removeItem("walletJustConnected");
        }

        if (showPopup) {
          setPopup({
            show: true,
            message: "Wallet verified! Redirecting...",
            type: "success",
          });
          setTimeout(
            () => setPopup({ show: false, message: "", type: "" }),
            5000
          );
        }

        router.push("/dashboard");
      } else {
        localStorage.removeItem("walletAddress");
        setPopup({
          show: true,
          message: "Access restricted: Wallet not recognized. Disconnecting...",
          type: "error",
        });
        if (wallet) wallet.disconnect();
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
          setWalletAddress("");
          sessionStorage.setItem("justReloaded", "true");
          window.location.reload();
        }, 5000);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setPopup({
        show: true,
        message:
          err.message || "Failed to verify wallet. Please try again later.",
        type: "error",
      });
      setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
    } finally {
      setIsChecking(false);
    }
  }, [walletAddress, router, wallet]);

  useEffect(() => {
    if (walletAddress) {
      if (
        typeof window !== "undefined" &&
        sessionStorage.getItem("blockVerify") === "true"
      ) {
        // Skip verification after reload due to access restriction
        sessionStorage.removeItem("blockVerify");
        return;
      }
      if (walletAddress) {
        verifyWallet();
      }
    }
  }, [walletAddress, verifyWallet]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("justReloaded") === "true") {
        sessionStorage.removeItem("justReloaded");
        // Do NOT reload again, just clear the flag
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <ConnectButton
        client={client}
        wallets={wallets}
        supportedChains={[mainnet, bsc]}
        connectButton={{
          label: "Connect Wallet",
          style: {
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "600",
          },
        }}
      />
      {isChecking && <div> {/* Loader code unchanged */} </div>}
      {popup.show && (
        <Popup title="Success" message={popup.message} type={popup.type} />
      )}
      {error && <Popup title="Error" message={error} type="error" />}
    </div>
  );
}

// "use client";
// import { useRef } from "react";
// import {
//   useActiveWallet,
//   useActiveWalletConnectionStatus,
// } from "thirdweb/react";
// import { createThirdwebClient } from "thirdweb";
// import { ConnectButton } from "thirdweb/react";
// import { walletConnect, createWallet } from "thirdweb/wallets";
// import { mainnet, bsc } from "thirdweb/chains";
// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Popup from "./Popup";

// export const client = createThirdwebClient({
//   clientId: "39b118976e9e817bc3799d54ddf74337",
// });

// const wallets = [
//   walletConnect({
//     projectId: "39b118976e9e817bc3799d54ddf74337",
//     qrModal: true,
//   }),
//   createWallet("io.metamask"),
//   createWallet("com.coinbase.wallet"),
// ];

// export default function ConnectOnly() {
//   const router = useRouter();
//   const wallet = useActiveWallet();
//   const connectionStatus = useActiveWalletConnectionStatus();
//   const [isChecking, setIsChecking] = useState(false);
//   const [error, setError] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");
//   const [popup, setPopup] = useState({ show: false, message: "", type: "" });
//   const logoutTimer = useRef(null);

//   useEffect(() => {
//     const getAddress = async () => {
//       if (connectionStatus === "connected" && wallet) {
//         try {
//           const account = await wallet.getAccount();
//           if (account?.address) {
//             setWalletAddress(account.address);
//           }
//         } catch (err) {
//           console.error("Error getting wallet address:", err);
//         }
//       }
//     };
//     getAddress();
//   }, [connectionStatus, wallet]);

//   // Auto-logout after 15 minutes of connection
//   useEffect(() => {
//     if (connectionStatus === "connected" && wallet) {
//       if (logoutTimer.current) clearTimeout(logoutTimer.current);
//       logoutTimer.current = setTimeout(async () => {
//         if (wallet && typeof wallet.disconnect === "function") {
//           await wallet.disconnect();
//         }
//         sessionStorage.setItem("justLoggedOut", "true");
//         localStorage.removeItem("walletAddress");
//         router.push("/");
//       }, 15 * 60 * 1000); // 15 minutes
//     }
//     return () => {
//       if (logoutTimer.current) clearTimeout(logoutTimer.current);
//     };
//   }, [connectionStatus, wallet, router]);

//   // Listen for wallet disconnect event (if supported)
//   useEffect(() => {
//     if (!wallet) return;
//     const handleDisconnect = async () => {
//       sessionStorage.setItem("justLoggedOut", "true");
//       localStorage.removeItem("walletAddress");
//       router.push("/");
//     };
//     if (wallet.provider?.on) {
//       wallet.provider.on("disconnect", handleDisconnect);
//     }
//     return () => {
//       if (wallet.provider?.removeListener) {
//         wallet.provider.removeListener("disconnect", handleDisconnect);
//       }
//     };
//   }, [wallet, router]);

//   const verifyWallet = useCallback(async () => {
//     if (!walletAddress) return;

//     setIsChecking(true);
//     setError("");

//     try {
//       console.log("Verifying wallet:", walletAddress);
//       const response = await fetch(`/api/check-sheet?wallet=${walletAddress}`);
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message);
//       }
//       const result = await response.json();
//       if (result.exists) {
//         localStorage.setItem("walletAddress", walletAddress);
//         setPopup({
//           show: true,
//           message: "Wallet verified! Redirecting...",
//           type: "success",
//         });
//         router.push("/dashboard");
//         setTimeout(
//           () => setPopup({ show: false, message: "", type: "" }),
//           5000
//         );
//       } else {
//         localStorage.removeItem("walletAddress");
//         setPopup({
//           show: true,
//           message: "Access restricted: Wallet not recognized. Disconnecting...",
//           type: "error",
//         });
//         if (wallet) wallet.disconnect();
//         setTimeout(() => {
//           setPopup({ show: false, message: "", type: "" });
//           setWalletAddress("");
//           sessionStorage.setItem("justReloaded", "true");
//           window.location.reload();
//         }, 5000);
//       }
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setPopup({
//         show: true,
//         message:
//           err.message || "Failed to verify wallet. Please try again later.",
//         type: "error",
//       });
//       setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
//     } finally {
//       setIsChecking(false);
//     }
//   }, [walletAddress, router, wallet]);

//   useEffect(() => {
//     if (walletAddress) {
//       if (
//         typeof window !== "undefined" &&
//         sessionStorage.getItem("blockVerify") === "true"
//       ) {
//         // Skip verification after reload due to access restriction
//         sessionStorage.removeItem("blockVerify");
//         return;
//       }
//       if (walletAddress) {
//         verifyWallet();
//       }
//     }
//   }, [walletAddress, verifyWallet]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       if (sessionStorage.getItem("justLoggedOut") === "true") {
//         sessionStorage.removeItem("justLoggedOut");
//         window.location.reload();
//       }
//       if (sessionStorage.getItem("justReloaded") === "true") {
//         sessionStorage.removeItem("justReloaded");
//         // Do NOT reload again, just clear the flag
//       }
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <ConnectButton
//         client={client}
//         wallets={wallets}
//         supportedChains={[mainnet, bsc]}
//         connectButton={{
//           label: "Connect Wallet",
//           style: {
//             padding: "12px 24px",
//             borderRadius: "8px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontWeight: "600",
//           },
//         }}
//       />
//       {isChecking && <div> {/* Loader code unchanged */} </div>}
//       {popup.show && (
//         <Popup title="Success" message={popup.message} type={popup.type} />
//       )}
//       {error && <Popup title="Error" message={error} type="error" />}
//     </div>
//   );
// }

// export default function ConnectOnly() {
//   const router = useRouter();
//   const wallet = useActiveWallet();
//   const connectionStatus = useActiveWalletConnectionStatus();
//   const [isChecking, setIsChecking] = useState(false);
//   const [error, setError] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");
//   const [popup, setPopup] = useState({ show: false, message: "", type: "" });

//   useEffect(() => {
//     const getAddress = async () => {
//       if (connectionStatus === "connected" && wallet) {
//         try {
//           const account = await wallet.getAccount();
//           if (account?.address) {
//             setWalletAddress(account.address);
//           }
//         } catch (err) {
//           console.error("Error getting wallet address:", err);
//         }
//       }
//     };
//     getAddress();
//   }, [connectionStatus, wallet]);

//   const verifyWallet = useCallback(async () => {
//     if (!walletAddress) return;

//     setIsChecking(true);
//     setError("");

//     try {
//       console.log("Verifying wallet:", walletAddress);
//       const response = await fetch(`/api/check-sheet?wallet=${walletAddress}`);
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message);
//       }
//       const result = await response.json();
//       if (result.exists) {
//         localStorage.setItem("walletAddress", walletAddress);
//         setPopup({
//           show: true,
//           message: "Wallet verified! Redirecting...",
//           type: "success",
//         });
//         router.push("/dashboard");
//         setTimeout(
//           () => setPopup({ show: false, message: "", type: "" }),
//           5000
//         );
//       } else {
//         localStorage.removeItem("walletAddress");
//         setPopup({
//           show: true,
//           message: "Access restricted: Wallet not recognized. Disconnecting...",
//           type: "error",
//         });
//         if (wallet) wallet.disconnect();
//         setTimeout(() => {
//           setPopup({ show: false, message: "", type: "" });
//           setWalletAddress("");
//           sessionStorage.setItem("justReloaded", "true");
//           window.location.reload();
//         }, 5000);
//       }
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setPopup({
//         show: true,
//         message:
//           err.message || "Failed to verify wallet. Please try again later.",
//         type: "error",
//       });
//       setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
//     } finally {
//       setIsChecking(false);
//     }
//   }, [walletAddress, router, wallet]);

//   useEffect(() => {
//     if (walletAddress) {
//       if (
//         typeof window !== "undefined" &&
//         sessionStorage.getItem("blockVerify") === "true"
//       ) {
//         // Skip verification after reload due to access restriction
//         sessionStorage.removeItem("blockVerify");
//         return;
//       }
//       if (walletAddress) {
//         verifyWallet();
//       }
//     }
//   }, [walletAddress, verifyWallet]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       if (sessionStorage.getItem("justLoggedOut") === "true") {
//         sessionStorage.removeItem("justLoggedOut");
//         window.location.reload();
//       }
//       if (sessionStorage.getItem("justReloaded") === "true") {
//         sessionStorage.removeItem("justReloaded");
//         // Do NOT reload again, just clear the flag
//       }
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <ConnectButton
//         client={client}
//         wallets={wallets}
//         supportedChains={[mainnet, bsc]} // ✅ Support ETH + BNB
//         connectButton={{
//           label: "Connect Wallet",
//           style: {
//             padding: "12px 24px",
//             borderRadius: "8px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             fontWeight: "600",
//           },
//         }}
//       />
//       {isChecking && <div> {/* Loader code unchanged */} </div>}
//       {popup.show && (
//         <Popup title="Success" message={popup.message} type={popup.type} />
//       )}
//       {error && <Popup title="Error" message={error} type="error" />}
//     </div>
//   );
// }
