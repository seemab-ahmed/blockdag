'use client'
import React from 'react'
import { useSheetData } from '../hooks/useSheetData';
import { parseSheetData } from '../utils/sheetParser';

const Transaction = () => {

  const [storedWallet, setStoredWallet] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    setStoredWallet(localStorage.getItem("walletAddress"));
  }
}, []);

  const { data: sheetData, isLoading, error } = useSheetData(storedWallet);
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
        {transactions.map((tx, idx) => (
          <div className="transactions_lastItem__k8rQB" key={idx}>
            <div className="transactions_left__mveP_">
              <div className="transactions_iconBox__OJutv">
                <img 
                  alt="user plus" 
                  loading="lazy" 
                  width="24" 
                  height="24" 
                  decoding="async" 
                  data-nimg="1" 
                  src="https://purchase3.blockdag.network/favicon.png" 
                  style={{ color: 'transparent' }} 
                />
              </div>
              <div className="transactions_lastInfo__GTAHL">
                <p className="style_text__Z44aT style_md__ZQhe4">
                  {tx["Base tokens"] ? `${tx["Base tokens"]} ` : ""}<span>BDAG</span>
                </p>
                <p className="style_text__Z44aT style_sm__RimS5 style_light__1UtMf">
                  Status: <span className={`style_text__Z44aT style_sm__RimS5 transactions_status__kTxb8 ${tx["status"] === "Confimed" ? "transactions_confirmed__D44w4" : ""}`}>{tx["status"] || "Unknown"}</span>
                  <span className={`transactions_iconSpan__bWFL8 ${tx["status"] === "Confimed" ? "transactions_confirmed__D44w4" : ""}`}>
                    <img 
                      alt="user plus" 
                      loading="lazy" 
                      width="24" 
                      height="24" 
                      decoding="async" 
                      data-nimg="1" 
                      src="/favicon.png" 
                      style={{ color: 'transparent' }} 
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
        ))}
      </div>
      <div className="transactions_pagination___OvtL">
        <button className="transactions_prev__bvpSA" disabled>
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  )
}

export default Transaction;