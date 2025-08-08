"use client";
import React, { useState, useEffect } from "react";

import { useSheetData } from "../hooks/useSheetData";
import { parseSheetData } from "../utils/sheetParser";
import { useAppKitAccount } from "@reown/appkit/react";

const Transaction = () => {
  const { address, isConnected } = useAppKitAccount();

  const { data: sheetData, isLoading, error } = useSheetData(address);
  const { transactions } = parseSheetData(sheetData);

  // Calculate totals
  const completedCount = transactions.length;
  const totalAmount = transactions.reduce((sum, tx) => {
    const value = parseFloat(tx["$value"] || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error loading transactions</div>;
  }

 

  return (
    <div className="transactions_lastTransactionsArea__DfC1R">
      <div className="transactions_lastList__zrOK_">
        {transactions.map((tx, idx) => {

           const currency = tx["crypto currency"]?.toLowerCase(); // Normalize for matching
           console.log(currency)

  let imageSrc = "https://purchase3.blockdag.network/favicon.png"; // Default fallback

  if (currency === "eth") {
    imageSrc = "https://purchase3.blockdag.network/images/coins/eth.svg";
  } else if (currency === "usdt" || currency === "usd" || currency === "USDT") {
    imageSrc = "https://purchase3.blockdag.network/images/coins/usdtbsc.svg";
  } else if (currency === "bnb") {
    imageSrc = "https://purchase3.blockdag.network/images/coins/favicon.svg";
  }

          return (
          <div className="transactions_lastItem__k8rQB" key={idx}>
            <div className="transactions_left__mveP_">
              <div className="transactions_iconBox__OJutv">
                {currency === "eth" && (
                <img
                  alt="user plus"
                  loading="lazy"
                  width="24"
                  height="24"
                  decoding="async"
                  data-nimg="1"
                  src="https://purchase3.blockdag.network/images/coins/eth.svg"
                  style={{ color: "transparent" }}
                />
              )}

              {(currency === "usdt" || currency === "usd") && (
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.203125" width="24" height="24" rx="12" fill="#50AF95"></rect>
              <path fillRule="evenodd" clipRule="evenodd" d="M13.808 12.7104C13.7357 12.7159 13.3624 12.7381 12.5297 12.7381C11.8674 12.7381 11.3971 12.7183 11.2321 12.7104C8.67251 12.5978 6.76198 12.1523 6.76198 11.6188C6.76198 11.0853 8.67251 10.6403 11.2321 10.5259V12.2667C11.3995 12.2787 11.8788 12.307 12.5411 12.307C13.3359 12.307 13.7339 12.2739 13.8056 12.2673V10.5271C16.3598 10.6409 18.2661 11.0865 18.2661 11.6188C18.2661 12.1511 16.3604 12.5966 13.8056 12.7098L13.808 12.7104ZM13.808 10.3471V8.78943H17.3725V6.41406H7.66757V8.78943H11.2315V10.3465C8.33472 10.4796 6.15625 11.0534 6.15625 11.741C6.15625 12.4286 8.33472 13.0019 11.2315 13.1355V18.1271H13.8074V13.1337C16.6976 13.0007 18.8724 12.4274 18.8724 11.7404C18.8724 11.0534 16.6994 10.4802 13.8074 10.3465L13.808 10.3471Z" fill="white"></path>
              <rect x="14.375" y="14.0781" width="10.125" height="10.125" rx="5.0625" fill="#F3F8F7"></rect>
              <path d="M19.5888 15.5625L19.5384 15.7334V20.6926L19.5888 20.7428L21.8963 19.3821L19.5888 15.5625Z" fill="#202125"></path>
              <path d="M19.5888 15.5625L17.2812 19.3821L19.5888 20.7428L19.5888 18.3358L19.5888 15.5625Z" fill="#202125"></path>
              <path d="M19.5888 21.1786L19.5604 21.2132V22.9797L19.5888 23.0625L21.8977 19.8186L19.5888 21.1786Z" fill="#202125"></path>
              <path d="M19.5888 23.0625V21.1786L17.2813 19.8186L19.5888 23.0625Z" fill="#202125"></path>
              <path d="M19.5888 20.7428L21.8963 19.3821L19.5888 18.3358L19.5888 20.7428Z" fill="#202125"></path>
              <path d="M17.2812 19.3821L19.5888 20.7428L19.5888 18.3358L17.2812 19.3821Z" fill="#202125"></path>
              <path d="M21.9125 19.4103L19.6053 20.7708C19.5951 20.7768 19.5824 20.7768 19.5722 20.7708L17.265 19.4103L17.2647 19.4101L17.2812 19.3821M21.9125 19.4103L17.3155 19.4023L17.3093 19.3986L17.3091 19.3989L17.2812 19.3821M21.9125 19.4103L21.9128 19.4101L21.8963 19.3821M21.9125 19.4103L21.8665 19.3328L21.9097 19.3524L21.8963 19.3821M17.2812 19.3821L17.2678 19.3524L17.311 19.3328L17.2981 19.3542L17.2978 19.354L17.2812 19.3821ZM21.8963 19.3821L21.8684 19.3989L21.8682 19.3986L21.8963 19.3821ZM21.8811 19.7905L19.5888 21.1408L17.2978 19.7905C17.2845 19.7827 17.2676 19.7852 17.2573 19.7965C17.2469 19.8079 17.2458 19.8249 17.2547 19.8374L19.5622 23.0814C19.5683 23.09 19.5782 23.0951 19.5888 23.0951C19.5993 23.0951 19.6092 23.09 19.6153 23.0814L21.9242 19.8375C21.9331 19.825 21.932 19.8079 21.9217 19.7966C21.9113 19.7853 21.8944 19.7827 21.8811 19.7905Z" stroke="#202125" strokeWidth="0.0651343" strokeLinejoin="round"></path>
            </svg>
              )}

              {currency === "bnb" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
              <path d="M11.5085 15.1276L18.4997 8.13654L25.4945 15.1312L29.5625 11.0632L18.4997 0L7.44069 11.0596L11.5085 15.1276ZM0.5 17.9994L4.56813 13.9313L8.63598 17.9992L4.56789 22.0673L0.5 17.9994ZM11.5085 20.8724L18.4997 27.8635L25.4943 20.869L29.5645 24.9349L29.5625 24.937L18.4997 36L7.44033 24.9408L7.43457 24.935L11.5085 20.8724ZM28.3641 18.0017L32.4323 13.9336L36.5001 18.0014L32.432 22.0695L28.3641 18.0017Z" fill="#F3BA2F"></path>
              <path d="M22.6259 17.9979H22.6277L18.4998 13.87L15.4492 16.9206H15.449L15.0985 17.2713L14.3756 17.9943L14.3699 17.9999L14.3756 18.0059L18.4998 22.1302L22.6277 18.0023L22.6297 17.9999L22.6259 17.9979Z" fill="#F3BA2F"></path>
            </svg>
              )}

              {/* Default fallback */}
              {!["eth", "usdt", "usd", "bnb"].includes(currency) && (
                <img
                  alt="default"
                  loading="lazy"
                  width="24"
                  height="24"
                  src="https://purchase3.blockdag.network/favicon.png"
                />
              )}
              </div>
              <div className="transactions_lastInfo__GTAHL">
                <p className="style_text__Z44aT style_md__ZQhe4">
                  {tx["amount"] ? `${tx["amount"]} ` : ""}
                  <span>{tx["crypto currency"]}</span>
                </p>
                <p className="style_text__Z44aT style_sm__RimS5 style_light__1UtMf">
                  Status:{" "}
                  <span
                    className={`style_text__Z44aT style_sm__RimS5 transactions_status__kTxb8 ${
                      tx["status"] === "Confimed"
                        ? "transactions_confirmed__D44w4"
                        : ""
                    }`}

                    style={{color: "#14cc26"}}
                  >
                    {tx["status"] || " "}
                  </span>
                  <span
                    className={`transactions_iconSpan__bWFL8 ${
                      tx["status"] === "Confimed"
                        ? "transactions_confirmed__D44w4"
                        : ""
                    }`}
                  >
                    <img
                      alt="user plus"
                      loading="lazy"
                      width="24"
                      height="24"
                      decoding="async"
                      data-nimg="1"
                      // src="/favicon.png" // /images/dashboard/icons/confirmed.svg
                      src={
                        tx["status"] === "Confirmed"
                          ? "https://purchase3.blockdag.network/images/dashboard/icons/confirmed.svg"
                          : tx["status"] === "Bonus"
                          ? imageSrc
                          : "https://purchase3.blockdag.network/favicon.png"
                      }
                      style={{ color: "transparent" }}
                    />
                  </span>
                </p>
              </div>
            </div>
            <div className="transactions_right__DILE5">
              <p className="style_text__Z44aT style_md__ZQhe4">
                ${tx["$value"] ? parseFloat(tx["$value"]).toFixed(2) : "0.00"}
              </p>
              <p className="style_text__Z44aT style_sm__RimS5">
                <span>
                  Batch {tx["batch "] || "-"} - Phase {tx["phase"] || "-"}
                </span>
                {tx["Date"] ? `${tx["Date"]} at ${tx["time"] || ""}` : ""}
              </p>
            </div>
          </div>
        )})}
      </div>
      <div className="transactions_pagination___OvtL">
        <button className="transactions_prev__bvpSA" disabled>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16602 10.2015H15.8327M15.8327 10.2015L9.99935 4.36816M15.8327 10.2015L9.99935 16.0348"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span>1 / 1</span>
        <button disabled>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16602 10.2015H15.8327M15.8327 10.2015L9.99935 4.36816M15.8327 10.2015L9.99935 16.0348"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="transactions_bottomInfo__MNkfL">
        <p>
          <span className="transactions_blue__445c7"></span>
          Total Completed Transactions<span>{completedCount}</span>
        </p>
        <p>
          <span className="transactions_green__iQNpc"></span>
          Total Transactions Amount<span>${totalAmount.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default Transaction;
