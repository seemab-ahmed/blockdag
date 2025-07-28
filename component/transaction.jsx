import React from 'react'

const Transaction = () => {
  return (
    <div className="transactions_lastTransactionsArea__DfC1R">
      <div className="transactions_lastList__zrOK_">
        <div className="transactions_lastItem__k8rQB">
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
                18932 <span>BDAG</span>
              </p>
              <p className="style_text__Z44aT style_sm__RimS5 style_light__1UtMf">
                Status: <span className="style_text__Z44aT style_sm__RimS5 transactions_status__kTxb8 transactions_confirmed__D44w4">Referral Bonus</span>
                <span className="transactions_iconSpan__bWFL8 transactions_confirmed__D44w4">
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
            <p className="style_text__Z44aT style_md__ZQhe4">$0.00</p>
            <p className="style_text__Z44aT style_sm__RimS5">
              <span>Batch 28 - Phase 59</span>May 10 at 08:09
            </p>
          </div>
        </div>
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
          Total Completed Transactions<span>0</span>
        </p>
        <p>
          <span className="transactions_green__iQNpc"></span>
          Total Transactions Amount<span>$0.00</span>
        </p>
      </div>
    </div>
  
  )
}

export default Transaction;
    //  <div className="transactions_lastTransactionsArea__DfC1R">
    //   <p className="style_text__Z44aT style_lg__AdDq0 style_font-700__9q48B">
    //     Last Transactions
    //   </p>
    //   <div className="transactions_lastList__zrOK_">
    //     <p>There are no finalized transactions yet.</p>
    //   </div>
    // </div>