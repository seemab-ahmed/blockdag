"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSheetData } from "../hooks/useSheetData";
import { parseSheetData } from "../utils/sheetParser";

import { useDisconnect } from "wagmi";

export const SideBar = () => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const handleLogout = async () => {
    disconnect();
    console.log("Wallet disconnected successfully");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("justLoggedOut", "true");
      localStorage.removeItem("walletAddress");
    }
  };

  const [storedWallet, setStoredWallet] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredWallet(localStorage.getItem("walletAddress"));
    }
  }, []);

  const { data: sheetData, isLoading, error } = useSheetData(storedWallet);
  const { profile } = parseSheetData(sheetData);

  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("/dashboard"); // State to track active link

  // Set the initial active link based on the current pathname
  useEffect(() => {
    // Normalize /dashboard#buy to /dashboardbuy
    const normalizedPath =
      pathname === "/dashboard" && window.location.hash === "#buy"
        ? "/dashboardbuy"
        : pathname;
    setActiveLink(normalizedPath);
  }, [pathname]);

  const handleLinkClick = (href) => {
    if (window.innerWidth <= 768) setCollapsed(false);

    // Normalize /dashboard#buy to /dashboardbuy
    const normalizedHref = href === "/dashboard#buy" ? "/dashboardbuy" : href;
    setActiveLink(normalizedHref); // Update active link state
  };

  const isActive = (href) => {
    // Normalize /dashboard#buy to /dashboardbuy
    const normalizedHref = href === "/dashboard#buy" ? "/dashboardbuy" : href;
    return activeLink === normalizedHref; // Check if the link matches the active link
  };

  return (
    <div
      className={`style_sidebar__FlOrd${
        collapsed ? " style_collapsed__W42on" : ""
      }`}
    >
      <div className="style_logoArea__bCOmk">
        <div
          className="style_hamburger__Rzhn3 d-sm"
          onClick={() => setCollapsed((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M9 18H21"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <a className="__className_665d18 style_logo__4uOOG" href="/">
          <img
            alt="cube"
            loading="lazy"
            width="54"
            height="54"
            decoding="async"
            data-nimg="1"
            className="d-md"
            style={{ color: "transparent" }}
            src="https://purchase3.blockdag.network/bdag.gif"
          />
          <span>BlockDAG</span>
        </a>
        <div
          className="style_hamburger__Rzhn3 d-md"
          onClick={() => setCollapsed((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 14.1663L10.8333 9.99967L15 5.83301M9.16667 14.1663L5 9.99967L9.16667 5.83301"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>
      <div className="style_quickArea__wwwUV d-sm">
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
        <div className="style_button__D_Zxp">
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
          <span className="style_notCount__NlAKO style_active__XzDfO">1</span>
        </div>
        <a className="style_button__D_Zxp style_early__0esFG" href="/#buy">
          <img
            alt="easter"
            loading="lazy"
            width="40"
            height="40"
            decoding="async"
            data-nimg="1"
            className="style_easter__vHJvf"
            style={{ color: "transparent" }}
            src="https://purchase3.blockdag.network/3d.gif"
          />
        </a>
        <a
          className="style_button__D_Zxp style_wallet__AMv1L d-sm"
          href="/#buy"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5 14H16.51M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7L5 7C3.89543 7 3 6.10457 3 5ZM3 5C3 3.89543 3.89543 3 5 3H17M17 14C17 14.2761 16.7761 14.5 16.5 14.5C16.2239 14.5 16 14.2761 16 14C16 13.7239 16.2239 13.5 16.5 13.5C16.7761 13.5 17 13.7239 17 14Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </a>
      </div>
      <ul
        className={`style_nav__VkM8c${collapsed ? " style_active__XzDfO" : ""}`}
      >
        <li>
          <Link
            className={isActive("/dashboard") ? "style_active__XzDfO" : ""}
            href="/dashboard"
            onClick={() => handleLinkClick("/dashboard")}
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 17.4965H16M11.0177 3.26052L4.23539 8.53565C3.78202 8.88827 3.55534 9.06458 3.39203 9.28538C3.24737 9.48097 3.1396 9.7013 3.07403 9.93557C3 10.2 3 10.4872 3 11.0616V18.2965C3 19.4166 3 19.9767 3.21799 20.4045C3.40973 20.7808 3.71569 21.0868 4.09202 21.2785C4.51984 21.4965 5.07989 21.4965 6.2 21.4965H17.8C18.9201 21.4965 19.4802 21.4965 19.908 21.2785C20.2843 21.0868 20.5903 20.7808 20.782 20.4045C21 19.9767 21 19.4166 21 18.2965V11.0616C21 10.4872 21 10.2 20.926 9.93557C20.8604 9.7013 20.7526 9.48097 20.608 9.28538C20.4447 9.06458 20.218 8.88827 19.7646 8.53565L12.9823 3.26052C12.631 2.98727 12.4553 2.85064 12.2613 2.79812C12.0902 2.75178 11.9098 2.75178 11.7387 2.79812C11.5447 2.85064 11.369 2.98727 11.0177 3.26052Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span>Home </span>
          </Link>
        </li>

        <li>
          <Link
            className={isActive("/dashboardbuy") ? "style_active__XzDfO" : ""}
            href="/dashboard#buy"
            onClick={() => handleLinkClick("/dashboardbuy")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15L9 12M12 15C13.3968 14.4687 14.7369 13.7987 16 13M12 15V20C12 20 15.03 19.45 16 18C17.08 16.38 16 13 16 13M9 12C9.53214 10.6194 10.2022 9.29607 11 8.05C12.1652 6.18699 13.7876 4.65305 15.713 3.5941C17.6384 2.53514 19.8027 1.98637 22 2C22 4.72 21.22 9.5 16 13M9 12H4C4 12 4.55 8.97 6 8C7.62 6.92 11 8 11 8M4.5 16.5C3 17.76 2.5 21.5 2.5 21.5C2.5 21.5 6.24 21 7.5 19.5C8.21 18.66 8.2 17.37 7.41 16.59C7.02131 16.219 6.50929 16.0046 5.97223 15.988C5.43516 15.9714 4.91088 16.1537 4.5 16.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Buy Now </span>
          </Link>
        </li>
        <li>
          <Link
            className={
              isActive("/dashboard/calculator") ? "style_active__XzDfO" : ""
            }
            href="/dashboard/calculator"
            onClick={() => handleLinkClick("/dashboard/calculator")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 6.5L6.5 17.5M8.5 10.5V6.5M6.5 8.5H10.5M13.5 15.5H17.5M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span>Roi Calculator </span>
          </Link>
        </li>
        <li>
          <Link
            className={
              isActive("/dashboard/transaction") ? "style_active__XzDfO" : ""
            }
            href="/dashboard/transaction"
            onClick={() => handleLinkClick("/dashboard/transaction")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L8 4M8 4L6 2M8 4H6C3.79086 4 2 5.79086 2 8M18 18L16 20M16 20L18 22M16 20H18C20.2091 20 22 18.2091 22 16M10.189 6.5C10.8551 3.91216 13.2042 2 16 2C19.3137 2 22 4.68629 22 8C22 10.7957 20.0879 13.1449 17.5001 13.811M14 16C14 19.3137 11.3137 22 8 22C4.68629 22 2 19.3137 2 16C2 12.6863 4.68629 10 8 10C11.3137 10 14 12.6863 14 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span>Transaction </span>
          </Link>
        </li>
        <li>
          <Link
            className={
              isActive("/dashboard/profile") ? "style_active__XzDfO" : ""
            }
            href="/dashboard/profile"
            onClick={() => handleLinkClick("/dashboard/profile")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span>Profile </span>
          </Link>
        </li>
        <div className="style_sideFoot__l4hez">
          <div className="style_profileBox__OgRkH">
            <p className="style_text__Z44aT style_md__ZQhe4 style_currentRank__UE4lp">
              Your Current Rank
            </p>
            <div className="style_rank__6tJax">
              <img
                alt="Crab"
                loading="lazy"
                width="24"
                height="24"
                decoding="async"
                data-nimg="1"
                className="style_rankImg__mh24N"
                style={{ color: "transparent" }}
                src={`https://purchase3.blockdag.network/images/ranks/${profile[
                  "Current Rank"
                ]?.toLowerCase()}.svg`}
              />
              <span className="style_text__Z44aT style_md__ZQhe4 style_rankText__pq6dx">
                {profile["Current Rank"] || "No Rank"}
              </span>
            </div>
            <div
              className="d-sm"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "start",
                cursor: "pointer",
              }}
            >
              <img
                alt="Crab"
                loading="lazy"
                width="18"
                height="18"
                decoding="async"
                data-nimg="1"
                className="style_rankImg__mh24N"
                style={{ color: "transparent" }}
                src="https://purchase3.blockdag.network//icons/logout.svg"
              />
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>
                Logout
              </span>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};
