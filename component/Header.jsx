"use client";
import React, { useState, useEffect } from "react";
import { useActiveWallet, useActiveWalletConnectionStatus } from "thirdweb/react";
import { useRouter } from "next/navigation";

export const Header = () => {
  const wallet = useActiveWallet();
  const router = useRouter();
  const connectionStatus = useActiveWalletConnectionStatus();
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
      }, 60 * 1000); // 15 minutes
    }
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [connectionStatus, wallet, router]);
  const handleLogout = async () => {
    if (wallet && typeof wallet.disconnect === "function") {
      console.log("Wallet disconnected successfully");
      await wallet.disconnect();
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("justLoggedOut", "true");
      localStorage.removeItem("walletAddress");
    }
    router.push("/");
  };
  return (
    <div className="topbar_topbar__TxUPS">
      <p className="style_text__Z44aT style_lg__AdDq0">BlockDAG Dashboard v3</p>
      <div className="topbar_right__XN7dF lightButtonImg">
        <div className="style_levelprogress__ItXuz">
          <div className="style_progress__40Zve">
            <div
              className="style_circle__DLGMX"
              style={{
                background:
                  "conic-gradient(var(--primary) undefined%, #ffffff10 undefined% 100%)",
              }}
            ></div>
            <div className="style_level__gAnH1 __className_665d18">
              <span></span>
            </div>
          </div>
        </div>
        <a className="topbar_button__kWwDK" href="/#buy">
          <img
            alt="BlockDAG"
            loading="lazy"
            width="40"
            height="40"
            decoding="async"
            data-nimg="1"
            className="topbar_easter__wqKZx"
            style={{ color: "transparent" }}
            src="https://purchase3.blockdag.network/3d.gif"
          />
          <p className="style_text__Z44aT style_sm__RimS5">BEAT VESTING</p>
        </a>
        <div className="topbar_button__kWwDK">
          <img
            alt="logout"
            loading="lazy"
            width="18"
            height="18"
            decoding="async"
            data-nimg="1"
            style={{ color: "transparent" }}
            src="https://purchase3.blockdag.network/icons/notification.svg"
          />
          <p className="style_text__Z44aT style_sm__RimS5">Notifications</p>
          <span className="topbar_notCount__308rO topbar_active__YxvZN">1</span>
        </div>
        <div
          className="topbar_button__kWwDK"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <img
            alt="logout"
            loading="lazy"
            width="18"
            height="18"
            decoding="async"
            data-nimg="1"
            style={{ color: "transparent" }}
            src="https://purchase3.blockdag.network/images/dashboard/icons/wallet.svg"
          />
          <p className="style_text__Z44aT style_sm__RimS5">Logout Wallet</p>
        </div>
      </div>
    </div>
  );
};
