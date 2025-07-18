'use client';
import React, { useState } from 'react';


const Calculator = () => {
  const [activeTab, setActiveTab] = useState('coin');
  const [bdagAmount, setBdagAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('0.00');
  const [sliderValue, setSliderValue] = useState(64);
  const [stage, setStage] = useState(29);
  const [price, setPrice] = useState('0.0276');

  const handleBdagChange = (e) => {
    setBdagAmount(e.target.value);
    // Add conversion logic here if needed
  };

  const handleUsdChange = (e) => {
    setUsdAmount(e.target.value);
    // Add conversion logic here if needed
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    // Update stage and price based on slider value
    // This is just an example - adjust according to your logic
    setStage(Math.floor(value / 3.5));
    setPrice((0.01 + (value * 0.0005)).toFixed(4));
  };

  return (
    <div className="style_calculator__5UHYM">
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

      <div className="style_box__P4d5J">
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
                <p>$</p>
                <div className="style_input__d5JsO">
                  <div className="style_controller__nvybk">
                    <input 
                      value={usdAmount} 
                      onChange={handleUsdChange}
                      readOnly // Remove this if you want it to be editable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="style_barArea__rVaM_">
            <p className="style_text__Z44aT style_sm__RimS5">
              Move the slider to see how much your <b>BDAG</b> will be worth at different price targets!
            </p>
            <div className="style_bar__V59_K">
              <div 
                className="style_progress__cgEf3" 
                style={{ width: `${sliderValue}%` }}
              >
                <span className="style_percent__6raBl">{sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="style_thumb__HR41y"
                tabIndex="-1"
              />
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
              Price <span className="style_text__Z44aT style_lg__AdDq0 style_big__MgAeM">{price} $BDAG</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;