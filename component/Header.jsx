"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";

export const Header = () => {
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Auto-redirect if not connected
  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected]);
  useEffect(() => {
    if (!isConnected) return;
    const timer = setTimeout(() => {
      disconnect();
      router.push("/");
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [isConnected, disconnect]);

  const handleLogout = async () => {
   await disconnect();
   
  };

  return (
    <div className="topbar_topbar__TxUPS">
      <p className="style_text__Z44aT style_lg__AdDq0">BlockDAG Dashboard v3</p>
      <div className="topbar_right__XN7dF lightButtonImg">
        {/* <div className="style_levelprogress__ItXuz">
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
        </div> */}
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
