import React from 'react';

const SelectCurrencyModal = ({ onClose }) => {
  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    // Close only if clicking directly on the overlay background
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div id="modal-root" className="__className_ee1788">
      <div 
        className="modal_ModalOverlay__K1uoH" 
        onClick={handleOverlayClick}
      >
        <div 
          className="modal_StyledOverlayClose__4o6fb" 
          onClick={handleOverlayClick}
        ></div>
        <div className="modal_StyledModal__sHsFE">
          <div className="modal_StyledModalBody__cmbvZ modalhere">
            <div 
              className="modal_StyledCloseIcon__zqnAj" 
              onClick={handleClose}
              style={{ cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="selectCurrencyModal_selectCurrencyModal__ny7ww selectCurrencyModalActive">
              <p className="selectCurrencyModal_title__O2IBi">Buy with&nbsp;Other Cryptos</p>
              
              <div className="selectCurrencyModal_amount__YMxOa">
                <p className="selectCurrencyModal_amountTitle__miYyf">Amount to be paid</p>
                <p className="selectCurrencyModal_usd__XOmVg">0.00 USD</p>
                <p className="selectCurrencyModal_tokenAmount___0GiU">
                  <img 
                    alt="BlockDAG Logo" 
                    loading="lazy" 
                    width="15" 
                    height="15" 
                    decoding="async" 
                    src="https://purchase3.blockdag.network/favicon.png" 
                    style={{ color: "transparent" }} 
                  /> 
                  <span> BDAG WORTH:</span> 0 
                </p>
              </div>
              
              <div>
                <p className="selectCurrencyModal_title__O2IBi">Search Currencies</p>
                <input 
                  className="selectCurrencyModal_searchInput__CoT7Z" 
                  placeholder="Currency name" 
                  fdprocessedid="wzhj1" 
                />
                
                <div className="selectCurrencyModal_currencyList__yl7jH">
                  {[
                    { id: "BTC", name: "Bitcoin", image: "https://purchase3.blockdag.network/images/coins/btc.svg" },
                    { id: "USDTTRC20", name: "Tether-Tron", image: "https://purchase3.blockdag.network/images/coins/usdttrc20.svg" },
                    { id: "USDTBSC", name: "Tether USD (BSC)", image: "https://purchase3.blockdag.network/images/coins/usdtbsc.svg" },
                    { id: "KAS", name: "Kaspa", image: "https://purchase3.blockdag.network/images/coins/kas.svg" },
                    { id: "DOGE", name: "DOGE", image: "https://purchase3.blockdag.network/images/coins/doge.svg" },
                    { id: "SHIB", name: "Shiba Inu", image: "https://purchase3.blockdag.network/images/coins/shib.svg" },
                    { id: "TRX", name: "Tron", image: "https://purchase3.blockdag.network/images/coins/trx.svg" },
                    { id: "SOL", name: "SOLANA", image: "https://purchase3.blockdag.network/images/coins/sol.svg" },
                    { id: "XRP", name: "Ripple", image: "https://purchase3.blockdag.network/images/coins/xrp.svg" },
                    { id: "MATICMAINNET", name: "Polygon", image: "https://purchase3.blockdag.network/images/coins/matic.svg" },
                    { id: "FTM", name: "Fantom (ERC20)", image: "https://purchase3.blockdag.network/images/coins/ftm.svg" },
                    { id: "ADA", name: "Cardano", image: "https://purchase3.blockdag.network/images/coins/ada.svg" },
                    { id: "TRUMP", name: "OFFICIAL TRUMP", image: "https://purchase3.blockdag.network/images/coins/trump.svg" },
                    { id: "TON", name: "Toncoin", image: "https://purchase3.blockdag.network/images/coins/ton.svg" },
                    { id: "USDCBASE", name: "USD Coin (Base)", image: "https://purchase3.blockdag.network/images/coins/usdc.svg" },
                    { id: "ETHBASE", name: "Ethereum (Base)", image: "https://purchase3.blockdag.network/images/coins/eth.svg" }
                  ].map(currency => (
                    <div key={currency.id} className="selectCurrencyModal_currencyItem__RXjDE">
                      <input hidden id={currency.id} type="radio" name="currency" />
                      <label htmlFor={currency.id}>
                        <img 
                          alt={currency.name} 
                          loading="lazy" 
                          width="36" 
                          height="36" 
                          decoding="async" 
                          src={currency.image} 
                          style={{ color: "transparent" }} 
                        />
                        {currency.id}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="selectCurrencyModal_buttons__dLcCr">
                <button 
                  type="button" 
                  disabled 
                  className="style_button__C9H72 style_primary__FoPQF"
                >
                  Select Currency
                  <span className="style_wrap__yFGLp"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCurrencyModal;