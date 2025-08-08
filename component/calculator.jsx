'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { parseSheetData } from '../utils/sheetParser';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('coin');
  const [bdagAmount, setBdagAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('0.00');
  const [sliderValue, setSliderValue] = useState(64);
  const [stage, setStage] = useState(29);
  // Get price from sheet
  const [storedWallet, setStoredWallet] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredWallet(localStorage.getItem("walletAddress"));
    }
  }, []);
  const { data: sheetData } = useSheetData(storedWallet);
  const { profile } = parseSheetData(sheetData);
  const price = profile && profile["1 Bdag"] ? String(profile["1 Bdag"]) : '0.0276';
  const [dragging, setDragging] = useState(false);

  const barRef = useRef(null);

  // Update stage based on slider value
  useEffect(() => {
    setStage(Math.floor(sliderValue / 3.5));
  }, [sliderValue]);

  // Conversion: BDAG to USD
  const handleBdagChange = (e) => {
    const val = e.target.value;
    setBdagAmount(val);
    // If input is empty, clear USD too
    if (val === "") {
      setUsdAmount("");
      return;
    }
    const num = parseFloat(val);
    const priceNum = parseFloat(price);
    if (!isNaN(num) && num >= 0 && !isNaN(priceNum)) {
      setUsdAmount((num * priceNum).toFixed(2));
    } else {
      setUsdAmount("");
    }
  };

  // Conversion: USD to BDAG
  const handleUsdChange = (e) => {
    const val = e.target.value;
    setUsdAmount(val);
    // If input is empty, clear BDAG too
    if (val === "") {
      setBdagAmount("");
      return;
    }
    const num = parseFloat(val);
    const priceNum = parseFloat(price);
    if (!isNaN(num) && num >= 0 && priceNum > 0) {
      setBdagAmount((num / priceNum).toFixed(4));
    } else {
      setBdagAmount("");
    }
  };

  // Keep conversion in sync when price changes
  useEffect(() => {
    const priceNum = parseFloat(price);
    // If BDAG is set, update USD
    const bdagNum = parseFloat(bdagAmount);
    if (bdagAmount !== "" && !isNaN(bdagNum) && bdagNum >= 0 && !isNaN(priceNum)) {
      setUsdAmount((bdagNum * priceNum).toFixed(2));
    } else if (usdAmount !== "") {
      // If only USD is set, update BDAG
      const usdNum = parseFloat(usdAmount);
      if (!isNaN(usdNum) && usdNum >= 0 && priceNum > 0) {
        setBdagAmount((usdNum / priceNum).toFixed(4));
      } else {
        setBdagAmount("");
      }
    } else {
      setUsdAmount("");
      setBdagAmount("");
    }
  }, [price]);

  // Drag logic for custom slider
  const startDrag = (e) => {
    setDragging(true);
    document.body.style.userSelect = "none";
    moveThumb(e);
  };

  const stopDrag = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  const moveThumb = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSliderValue(Math.round(percent));
  };

  useEffect(() => {
    if (dragging) {
      const onMove = (e) => moveThumb(e);
      const onUp = () => stopDrag();
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
      };
    }
  }, [dragging]);

  return (
    <div className="style_calculator__5UHYM" >
      <div className="style_tabs__S8H6b">
        <div
          className={`style_tabItem__JsB2S ${activeTab === 'coin' ? 'style_active__1Yrok' : ''}`}
          onClick={() => setActiveTab('coin')}
        >
          <span>Coin Amount<span className="d-md"> Calculator</span></span>
        </div>
        <div
          className={`style_tabItem__JsB2S ${activeTab === 'mining' ? 'style_active__1Yrok' : ''}`}
          onClick={() => setActiveTab('mining')}
        >
          <span>Mining Profit<span className="d-md"> Calculator</span></span>
        </div>
      </div>

      <div className="style_box__P4d5J" style={{ paddingBottom: '170px !important' }}>
        <div className="style_coins__mi9VT">
          <p className="style_text__Z44aT style_lg__AdDq0 style_title__rXABb">
            Calculate your profits on coin launch
          </p>

          <div className="style_inputs__g5nZF">
            <div className="style_formGroup__8kJRT">
              <label>Enter how much BDAG coins you have</label>
              <div className="style_formController__kBuhk">
                <p>BDAG</p>
                <div className="style_input__d5JsO">
                  <div className="style_controller__nvybk">
                    <input
                      inputMode="numeric"
                      maxLength="18"
                      placeholder="0.00"
                      value={bdagAmount}
                      onChange={handleBdagChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="style_formGroup__8kJRT">
              <label>USD Amount</label>
              <div className="style_formController__kBuhk">
                <p className="override-margin">$</p>
                <div className="style_input__d5JsO">
                  <div className="style_controller__nvybk">
                    <input
                      value={usdAmount}
                      onChange={handleUsdChange}
                      readOnly
                    />
                  </div>
                </div>
              {/* <div style={{marginTop: '6px', fontSize: '13px', color: '#888'}}>1 $ = {parseFloat(price) > 0 ? (1/parseFloat(price)).toFixed(4) : '0.0000'} BDAG (Sheet Price)</div> */}
              </div>
            </div>
          </div>

          <div className="style_barArea__rVaM_">
            <p className="style_text__Z44aT style_sm__RimS5">
              Move the slider to see how much your <b>BDAG</b> will be worth at different price targets!
            </p>
            <div
              className="style_bar__V59_K"
              ref={barRef}
              style={{ position: "relative" , marginTop: "20px" }}
              onMouseDown={e => startDrag(e)}
              onTouchStart={e => startDrag(e)}
            >
              <div
                className="style_progress__cgEf3"
                style={{ width: `${sliderValue}%` }}
              ></div>
              <div
                className="style_thumb__HR41y"
                tabIndex={-1}
                style={{
                  position: "absolute",
                  left: `calc(${sliderValue}% - 16px)`,
                  top: 0,
                  zIndex: 2,
                  cursor: "pointer"
                }}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
              ></div>
              <span
                className="style_percent__6raBl"
                style={{
                  position: "absolute",
                  left: `calc(${sliderValue}% - 16px)`,
                  top: "-28px", // adjust as needed
                  zIndex: 3,
                  whiteSpace: "nowrap"
                }}
              >
                {sliderValue}%
              </span>
              <div
                className="style_remaining__drxK_"
                style={{ width: `${100 - sliderValue}%` }}
              ></div>
            </div>
            
          </div>

          <div className="style_selected__TZOjj">
            <p className="style_text__Z44aT style_sm__RimS5">
              Stage <span className="style_text__Z44aT style_lg__AdDq0 style_big__MgAeM">{stage}</span>
            </p>
            <p className="style_text__Z44aT style_sm__RimS5">
              Price <span className="style_text__Z44aT style_lg__AdDq0 style_big__MgAeM">{(0.01 + (sliderValue * 0.0005)).toFixed(4)} $BDAG</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;