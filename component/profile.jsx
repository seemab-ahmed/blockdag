'use client';
import React from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { parseSheetData } from '../utils/sheetParser';


const Profile = () => {
   const { data: sheetData } = useSheetData();
  const { profile } = parseSheetData(sheetData);

  return (
    <div className="profile_profile__7BfzS">
      <div className="profile_userInfoArea__HKeSC">
        <div className="profile_userPlace__Yb8ll">
  <div className="profile_info__hpTVz">
    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw style_font-700__9q48B">#? Your Place</p>
    <p className="style_text__Z44aT style_md__ZQhe4">
      <img 
        alt="Crab" 
        loading="lazy" 
        width="24" 
        height="24" 
        decoding="async" 
        data-nimg="1" 
        src="https://purchase3.blockdag.network/images/ranks/crab.svg" 
        style={{ color: 'transparent' }} 
      /> 
      0xc7fb...d93
    </p>
  </div>
  <div className="profile_info__hpTVz">
    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw style_font-700__9q48B">Total Transactions</p>
    <p className="style_text__Z44aT style_md__ZQhe4">0.00</p>
  </div>
</div>
        <div className="profile_userRank__sL4Ki">
          <div className="profile_rankInfoArea__dHcT1">
            <div className="profile_info__hpTVz">
              <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw style_font-700__9q48B">Your Current Rank</p>
              <p className="style_text__Z44aT style_md__ZQhe4">
                <img alt="Crab" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/ranks/crab.svg" style={{ color: 'transparent' }} />
                <span className="style_text__Z44aT style_md__ZQhe4">Crab - Level 1</span>
              </p>
            </div>
            <div className="profile_info__hpTVz">
              <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw style_font-700__9q48B">Next Rank</p>
              <p className="style_text__Z44aT style_md__ZQhe4">
                <img alt="Turtle" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/ranks/turtle.svg" style={{ color: 'transparent' }} />
                <span className="style_text__Z44aT style_md__ZQhe4">Turtle - 100.0% to next level</span>
              </p>
            </div>
          </div>
          <p className="style_text__Z44aT style_sm__RimS5 profile_remainingInfo__SxF1W">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_7501_18206)">
                <path d="M9.99935 13.3334V10.0001M9.99935 6.66675H10.0077M18.3327 10.0001C18.3327 14.6025 14.6017 18.3334 9.99935 18.3334C5.39698 18.3334 1.66602 14.6025 1.66602 10.0001C1.66602 5.39771 5.39698 1.66675 9.99935 1.66675C14.6017 1.66675 18.3327 5.39771 18.3327 10.0001Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
              <defs>
                <clipPath id="clip0_7501_18206">
                  <rect width="20" height="20" fill="currentColor"></rect>
                </clipPath>
              </defs>
            </svg>
            <span className="style_text__Z44aT style_sm__RimS5">
              You need <span className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
                <a href="/#buy">13.33K more BDAG</a>
              </span> coins to level up.
            </span>
          </p>
        </div>
      </div>
      <div className="profile_earnings__FK3EW">
        <div className="profile_title__Nkj9v">
          <p className="style_text__Z44aT style_lg__AdDq0 style_font-700__9q48B">Wallet</p>
        </div>
        <div className="profile_walletAddressArea__QMz4D">
          <div className="profile_stat__q4375">
            <p className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">Wallet Address</p>
            <p className="style_text__Z44aT style_md__ZQhe4 profile_walletAddress__KmTeP style_font-700__9q48B">
              0xc7fbfD46d4b712Dcf3F035acEe15E261F5A5ad93
            </p>
          </div>
          <div className="profile_btns___ypRC">
            <button type="button" className="style_button__C9H72 style_transparent-dark__hThHh">
              Change Wallet<span className="style_wrap__yFGLp"></span>
            </button>
            <button type="button" className="style_button__C9H72 style_primary__FoPQF">
              Disconnect<span className="style_wrap__yFGLp"></span>
            </button>
          </div>
        </div>
        <div className="profile_statsArea__Tvg83">
          <div className="profile_stats__SwnTU">
            <div className="profile_stat__q4375">
              <p className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">Total BDAG Balance</p>
              <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">{profile["Total Balance"] ? `${profile["Total Balance"]} BDAG` : "0.00 BDAG"}</p>
            </div>
            <div className="profile_stat__q4375">
              <p className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">Current Coin Worth</p>
              <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">{profile["current coin worth"] || "0.00"}</p>
            </div>
            <div className="profile_stat__q4375">
              <p className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">Coin Spent Amount</p>
              <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">{profile["coin spent amount"] || "0.00"}</p>
            </div>
            <div className="profile_stat__q4375">
              <p className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">Your Coin Worth at Launch</p>
              <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">{profile["your coin worth at launch"] || "0.00"}</p>
            </div>
          </div>
          <div className="profile_chartArea__vsPCc">
            <div className="profile_chart__R3bOy">
              <div className="style_chart__4Dhsv">
                <svg className="style_donut__h_f_T" width="300" height="300" viewBox="-150 -150 300 300">
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A1C000"></stop>
                      <stop offset="100%" stopColor="#FF923B"></stop>
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#421C81"></stop>
                      <stop offset="100%" stopColor="#8E57E7"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M 0 0 L 150 0 A 150 150 0 0 1 -74.97279136480131 129.91951568170953 Z" fill="url(#orangeGradient)" stroke="#000" strokeWidth="1"></path>
                  <text x="50.00906872264892" y="86.59730391584588" fill="#FFF" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">49.0%</text>
                  <path d="M 0 0 L -74.97279136480131 129.91951568170953 A 150 150 0 0 1 -75.05440739959964 -129.87238324561122 Z" fill="url(#purpleGradient)" stroke="#000" strokeWidth="1"></path>
                  <text x="-99.99999506519785" y="0.031415926019190236" fill="#FFF" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">0.0%</text>
                  <path d="M 0 0 L -75.05440739959964 -129.87238324561122 A 150 150 0 0 1 149.99997039118776 -0.09424777340662932 Z" fill="#38CDC1" stroke="#000" strokeWidth="1"></path>
                  <text x="49.95464816407422" y="-86.62870844473878" fill="#FFF" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">0.0%</text>
                  <circle cx="0" cy="0" r="75" fill="#000"></circle>
                </svg>
              </div>
            </div>
            <div className="profile_labels__AajJF">
              <div className="profile_label__GWloT">
                <span className="profile_icon__p61hL"></span>
                <p className="style_text__Z44aT style_md__ZQhe4">Purchase</p>
              </div>
              <div className="profile_label__GWloT">
                <span className="profile_icon__p61hL"></span>
                <p className="style_text__Z44aT style_md__ZQhe4">Referrals</p>
              </div>
              <div className="profile_label__GWloT">
                <span className="profile_icon__p61hL"></span>
                <p className="style_text__Z44aT style_md__ZQhe4">Bonus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile_assets__UHihl">
        <div className="profile_title__Nkj9v">
          <p className="style_text__Z44aT style_lg__AdDq0 style_font-700__9q48B">Products &amp; Assets</p>
          <p className="style_text__Z44aT style_md__ZQhe4">
            <span className="profile_point__JXnlB"></span>
            <span className="style_text__Z44aT style_md__ZQhe4 style_light__1UtMf">
              You have <span className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">0 Units</span> in total
            </span>
          </p>
        </div>
        <div className="profile_products__Gg_sO">
          <div className="profile_product__6V5cI">
            <div className="profile_productImg__dSbI_">
              <img alt="BlockDAG x10 Miner" loading="lazy" width="0" height="0" decoding="async" data-nimg="1" className="style_img__foiEq" src="https://purchase3.blockdag.network/images/products/x10.png" style={{ color: 'transparent' }} />
            </div>
            <div className="profile_productContent__sJNtz">
              <p className="style_text__Z44aT style_sm__RimS5 style_font-700__9q48B">BlockDAG X10</p>
              <p className="style_text__Z44aT style_sm__RimS5">
                <span className="profile_point__JXnlB profile_none__ZVgSl"></span>0 Units
              </p>
            </div>
          </div>
          <div className="profile_product__6V5cI">
            <div className="profile_productImg__dSbI_">
              <img alt="BlockDAG x30 Miner" loading="lazy" width="0" height="0" decoding="async" data-nimg="1" className="style_img__foiEq" src="https://purchase3.blockdag.network/images/products/x30.png" style={{ color: 'transparent' }} />
            </div>
            <div className="profile_productContent__sJNtz">
              <p className="style_text__Z44aT style_sm__RimS5 style_font-700__9q48B">BlockDAG X30</p>
              <p className="style_text__Z44aT style_sm__RimS5">
                <span className="profile_point__JXnlB profile_none__ZVgSl"></span>0 Units
              </p>
            </div>
          </div>
          <div className="profile_product__6V5cI">
            <div className="profile_productImg__dSbI_">
              <img alt="BlockDAG x100 Miner" loading="lazy" width="0" height="0" decoding="async" data-nimg="1" className="style_img__foiEq" src="https://purchase3.blockdag.network/images/products/x100.png" style={{ color: 'transparent' }} />
            </div>
            <div className="profile_productContent__sJNtz">
              <p className="style_text__Z44aT style_sm__RimS5 style_font-700__9q48B">BlockDAG X100</p>
              <p className="style_text__Z44aT style_sm__RimS5">
                <span className="profile_point__JXnlB profile_none__ZVgSl"></span>0 Units
              </p>
            </div>
          </div>
          <div className="profile_product__6V5cI">
            <div className="profile_productImg__dSbI_">
              <img alt="BlockDAG x1 Miner" loading="lazy" width="0" height="0" decoding="async" data-nimg="1" className="style_img__foiEq" src="https://purchase3.blockdag.network/images/products/x1.png" style={{ color: 'transparent' }} />
            </div>
            <div className="profile_productContent__sJNtz">
              <p className="style_text__Z44aT style_sm__RimS5 style_font-700__9q48B">BlockDAG X1</p>
              <div className="style_text__Z44aT style_sm__RimS5">
                <a target="_blank" href="/">App Store</a>
                <br />
                <a target="_blank" href="/">Google Play Store</a>
              </div>
            </div>
          </div>
        </div>
        <div className="profile_btns___ypRC">
          <a className="style_button__C9H72 style_transparent-dark__hThHh" href="/#buy">
            Buy product<span className="style_wrap__yFGLp"></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;