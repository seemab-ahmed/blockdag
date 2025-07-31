// 'use client';
// import React, { useState } from 'react';
// import BuyMiner from './buyMiner';
// import RankProgress from './rankProgress';
// import BeatVestingModal from './beatVestingModal';
// import SelectCurrencyModal from './selectCurrencyModal';
// import Transaction from './transaction';
// import { useSheetData } from '../hooks/useSheetData';
// import { parseSheetData } from '../utils/sheetParser';
// import { parseConstantsData } from '../utils/parseConstantsData';
// import { useActiveWallet, useSendTransaction , useActiveWalletConnectionStatus} from "thirdweb/react";
// import { prepareContractCall, toWei } from "thirdweb";

// const contractAddress = "0x43D033C19eA0A9f8F2459b9A51dC97f59B7725bB";
// const abi = [
//   {
//     "inputs": [
//       { "internalType": "uint256", "name": "usdEquivalent", "type": "uint256" }
//     ],
//     "name": "buyWithETH",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   }
// ];

// export const MainArea = () => {
//   const { data: sheetData } = useSheetData();
//   const { profile, transactions } = parseSheetData(sheetData);
//   const { data: constantsData } = useSheetData("Constants");
//   const constants = parseConstantsData(constantsData);

//   const [activeTab, setActiveTab] = useState('buyBDAG');
//   const [activePaymentMethod, setActivePaymentMethod] = useState('ETH');
//   const [amount, setAmount] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

//  const connectionStatus = useActiveWalletConnectionStatus();
//   const [walletAddress, setWalletAddress] = useState("");


//   const [transactionStatus, setTransactionStatus] = useState({
//     message: "",
//     isError: false,
//     isLoading: false
//   });

//   const wallet = useActiveWallet();
//   const { mutate: sendTransaction } = useSendTransaction();
//   const ethPerUSD = 0.00002067; // Current ETH/USD rate
//   const minETH = 0.01413; // Minimum ETH purchase amount


//    // Get wallet address when connected
//     useEffect(() => {
//       const getAddress = async () => {
//         if (connectionStatus === "connected" && wallet) {
//           try {
//             const account = await wallet.getAccount();
//             if (account?.address) {
//               setWalletAddress(account.address);
//               console.log("Wallet connected:", account.address);
//             }
//           } catch (err) {
//             console.error("Error getting wallet address:", err);
//           }
//         }
//       };
  
//       getAddress();
//     }, [connectionStatus, wallet]);

//   const handleBuy = async () => {
//     if (!walletAddress) {
//       setTransactionStatus({
//         message: "Please connect your wallet first",
//         isError: true,
//         isLoading: false
//       });
//       return;
//     }

//     if (!amount || amount <= 0) {
//       setTransactionStatus({
//         message: "Please enter a valid amount",
//         isError: true,
//         isLoading: false
//       });
//       return;
//     }

//     try {
//       setTransactionStatus({
//         message: "Preparing transaction...",
//         isError: false,
//         isLoading: true
//       });

//       const usdAmount = parseFloat(amount);
//       const ethToSend = usdAmount * ethPerUSD;

//       if (ethToSend < minETH) {
//         setTransactionStatus({
//           message: `Minimum purchase: ${minETH} ETH ($${(minETH/ethPerUSD).toFixed(2)})`,
//           isError: true,
//           isLoading: false
//         });
//         return;
//       }

//       const weiValue = toWei(ethToSend.toString());

//       const transaction = prepareContractCall({
//         contract: {
//           address: contractAddress,
//           abi,
//         },
//         method: "buyWithETH",
//         params: [Math.floor(usdAmount * 1e6)], // Convert to 6 decimal places
//         value: weiValue,
//       });

//       setTransactionStatus({
//         message: "Confirm transaction in your wallet...",
//         isError: false,
//         isLoading: true
//       });

//       const result = await sendTransaction(transaction);

//       setTransactionStatus({
//         message: "✅ Purchase successful!",
//         isError: false,
//         isLoading: false
//       });

//       // Optional: Refresh data after successful purchase
//       // await refetchSheetData();

//     } catch (error) {
//       console.error("Transaction error:", error);
//       let errorMessage = "Transaction failed";
      
//       if (error.message.includes("user rejected")) {
//         errorMessage = "Transaction cancelled by user";
//       } else if (error.message.includes("insufficient funds")) {
//         errorMessage = "Insufficient ETH balance";
//       }

//       setTransactionStatus({
//         message: `❌ ${errorMessage}`,
//         isError: true,
//         isLoading: false
//       });
//     }
//   };


//   const handleOpenCurrencyModal = () => {
//     setIsCurrencyModalOpen(true);
//   };

//   const handleCloseCurrencyModal = () => {
//     setIsCurrencyModalOpen(false);
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true); // Open the modal
//   };

//   const handleCloseModal = () => {
//     console.log('onclickTrigger')
//     setIsModalOpen(false); // Close the modal
//   };
  
//   return (
//     <div className="style_overview__iPKe6">
//     <RankProgress />
//    <div className="style_balanceSection__K0yQq">
//   <div className="style_balances__lxOoR">
//     <div className="style_balanceBox___25FT">
//       <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total BDAG Balance</p>
//       <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
//         {profile["Total Balance"] ? `${profile["Total Balance"]} BDAG` : "0.00 BDAG"}
//       </p>
//       <div className="style_icon__jwMyF">
//         {/* ...svg... */}
//       </div>
//     </div>
//     <div className="style_balanceBox___25FT">
//       <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Your Coin Worth at Launch</p>
//       <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
//         {profile["your coin worth at launch"] || "0.00"}
//       </p>
//       <div className="style_icon__jwMyF">
//         {/* ...svg... */}
//       </div>
//     </div>
//   </div>
// </div>
//       <div className="style_purchase__X5B7u">
//         <div className="wallet_wallet__HKWGq wallet_shouldLogin__ai97O">
//           <div id="buy" className="wallet_anchor__W3ZBk"></div>
//           <div className="wallet_modalHead__Q3MP_">
//             <div className="wallet_modalHeadArea__CUzyB">
//               <p 
//                className={activeTab === 'buyBDAG' ? "wallet_active__9n3l6" : ""}
//                 onClick={() => setActiveTab('buyBDAG')}
//               >Buy BDAG</p>
//               <p 
//               className={activeTab === 'buyMiner' ? "wallet_active__9n3l6" : ""}
//                 onClick={() => setActiveTab('buyMiner')}
//               >Buy Miner</p>
//             </div>
//           </div>
//           {activeTab === 'buyBDAG' ? (
//           <div className="wallet_walletWrapper__6pNfN">
//             <div className="wallet_walletHead__N6OWX">
//               {/* <div className="wallet_currentBatch__L9Xlq">
//                 <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Current Batch</p>
//                 <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">Batch 29</p>
//                 <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">-</p>
//                 <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">Phase 88</p>
//               </div> */}
//               <div className="wallet_doubleIt__OhJ0r">
//                 <p className="wallet_doubleText__JRiZM __className_665d18"
//                 onClick={handleOpenModal} // Open modal on click
//                 style={{ cursor: 'pointer' }}
//                 >BUY, BEAT VESTING PASS!</p>
//               </div>
//               <div className="wallet_walletHeadCoin__G_Gxn">
//                 <div className="wallet_walletHeadItem__2_GYQ">
//                   <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total Coin Sales</p>
//                   <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
//                     {constants["Total Coin sales"] || "$0.00"}
//                   </p>
//                 </div>
//                 <div className="wallet_walletHeadItem__2_GYQ">
//                   <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total Coins Sold</p>
//                   <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
//                     {constants["Total coins sold"] || "0"}
//                   </p>
//                 </div>
//               </div>
//               <div className="style_bar__PrR89">
//                 <div className="style_spans__yvuK_">
//                   <span>Remaining</span>
//                   <span translate="no">{constants["Remaining bar"] || "0"}</span>
//                 </div>
//                 <span className="style_progress__IPzew" style={{width: "98%"}}></span>
//                 <span className="style_progressTitle__SWVW1" style={{left: "98%"}}></span>
//               </div>
//               <div className="wallet_walletHeadCoin__G_Gxn">
//                 <div className="wallet_walletPriceItem__E7HOg">
//                   <p className="style_text__Z44aT style_md__ZQhe4">1 BDAG:</p>
//                   <p className="style_text__Z44aT style_md__ZQhe4">
//                     ${constants["Batch Price"] || "0.00"}
//                   </p>
//                 </div>
//                 <div className="wallet_walletPriceItem__E7HOg">
//                   <p className="style_text__Z44aT style_md__ZQhe4">Next Batch:</p>
//                   <p className="style_text__Z44aT style_md__ZQhe4">
//                     ${constants["Next Batch"] || "0.00"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="wallet_walletContent__3lxb6">
//               <div className="wallet_purchaseMethods__n4mDq">
//           <div className="selectMethodBox_selecttype__Omlpg">
//             <div 
//               className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'ETH' ? 'selectMethodBox_active__EdF_w' : ''}`}
//               onClick={() => setActivePaymentMethod('ETH')}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
//                 <path d="M18.3114 0.942505L18.0695 1.76283V25.5668L18.3114 25.8078L29.3875 19.2764L18.3114 0.942505Z" fill="currentColor"></path>
//                 <path d="M18.3114 0.942505L7.23535 19.2764L18.3114 25.8078L18.3115 14.2541L18.3114 0.942505Z" fill="currentColor"></path>
//                 <path d="M18.3114 27.8999L18.1751 28.0657V36.5452L18.3114 36.9425L29.3941 21.3718L18.3114 27.8999Z" fill="currentColor"></path>
//                 <path d="M18.3114 36.9425V27.8999L7.23535 21.3716L18.3114 36.9425Z" fill="currentColor"></path>
//                 <path d="M18.3114 25.8078L29.3875 19.2764L18.3115 14.2541L18.3114 25.8078Z" fill="currentColor"></path>
//                 <path d="M7.23535 19.2764L18.3114 25.8078L18.3115 14.2541L7.23535 19.2764Z" fill="currentColor"></path>
//                 <path d="M18.4389 0.852012C18.4186 0.823489 18.3889 0.80181 18.3533 0.791918C18.3473 0.790227 18.3412 0.788918 18.3351 0.787979C18.3208 0.785796 18.3061 0.785565 18.2914 0.787468C18.2851 0.788273 18.279 0.789445 18.273 0.790963L18.4389 0.852012ZM18.4389 0.852012C18.4411 0.855136 18.4432 0.858357 18.4452 0.861671L18.4389 0.852012ZM18.3719 25.9519C18.3271 25.9707 18.2764 25.9675 18.2347 25.944C18.2344 25.9438 18.2341 25.9437 18.2338 25.9435C18.2334 25.9432 18.2329 25.943 18.2324 25.9427L18.3719 25.9519ZM18.3719 25.9519C18.3743 25.9509 18.3767 25.9498 18.3791 25.9487" stroke="currentColor" strokeWidth="0.312645" strokeLinejoin="round"></path>
//               </svg>
//               <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> ETH</span>
//             </div>
//             <div 
//               className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'USDT' ? 'selectMethodBox_active__EdF_w' : ''}`}
//               onClick={() => setActivePaymentMethod('USDT')}
//             >
//               <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <rect x="0.5" y="0.203125" width="24" height="24" rx="12" fill="#50AF95"></rect>
//                 <path fillRule="evenodd" clipRule="evenodd" d="M13.808 12.7104C13.7357 12.7159 13.3624 12.7381 12.5297 12.7381C11.8674 12.7381 11.3971 12.7183 11.2321 12.7104C8.67251 12.5978 6.76198 12.1523 6.76198 11.6188C6.76198 11.0853 8.67251 10.6403 11.2321 10.5259V12.2667C11.3995 12.2787 11.8788 12.307 12.5411 12.307C13.3359 12.307 13.7339 12.2739 13.8056 12.2673V10.5271C16.3598 10.6409 18.2661 11.0865 18.2661 11.6188C18.2661 12.1511 16.3604 12.5966 13.8056 12.7098L13.808 12.7104ZM13.808 10.3471V8.78943H17.3725V6.41406H7.66757V8.78943H11.2315V10.3465C8.33472 10.4796 6.15625 11.0534 6.15625 11.741C6.15625 12.4286 8.33472 13.0019 11.2315 13.1355V18.1271H13.8074V13.1337C16.6976 13.0007 18.8724 12.4274 18.8724 11.7404C18.8724 11.0534 16.6994 10.4802 13.8074 10.3465L13.808 10.3471Z" fill="white"></path>
//                 <rect x="14.375" y="14.0781" width="10.125" height="10.125" rx="5.0625" fill="#F3F8F7"></rect>
//                 <path d="M19.5888 15.5625L19.5384 15.7334V20.6926L19.5888 20.7428L21.8963 19.3821L19.5888 15.5625Z" fill="#202125"></path>
//                 <path d="M19.5888 15.5625L17.2812 19.3821L19.5888 20.7428L19.5888 18.3358L19.5888 15.5625Z" fill="#202125"></path>
//                 <path d="M19.5888 21.1786L19.5604 21.2132V22.9797L19.5888 23.0625L21.8977 19.8186L19.5888 21.1786Z" fill="#202125"></path>
//                 <path d="M19.5888 23.0625V21.1786L17.2813 19.8186L19.5888 23.0625Z" fill="#202125"></path>
//                 <path d="M19.5888 20.7428L21.8963 19.3821L19.5888 18.3358L19.5888 20.7428Z" fill="#202125"></path>
//                 <path d="M17.2812 19.3821L19.5888 20.7428L19.5888 18.3358L17.2812 19.3821Z" fill="#202125"></path>
//                 <path d="M21.9125 19.4103L19.6053 20.7708C19.5951 20.7768 19.5824 20.7768 19.5722 20.7708L17.265 19.4103L17.2647 19.4101L17.2812 19.3821M21.9125 19.4103L17.3155 19.4023L17.3093 19.3986L17.3091 19.3989L17.2812 19.3821M21.9125 19.4103L21.9128 19.4101L21.8963 19.3821M21.9125 19.4103L21.8665 19.3328L21.9097 19.3524L21.8963 19.3821M17.2812 19.3821L17.2678 19.3524L17.311 19.3328L17.2981 19.3542L17.2978 19.354L17.2812 19.3821ZM21.8963 19.3821L21.8684 19.3989L21.8682 19.3986L21.8963 19.3821ZM21.8811 19.7905L19.5888 21.1408L17.2978 19.7905C17.2845 19.7827 17.2676 19.7852 17.2573 19.7965C17.2469 19.8079 17.2458 19.8249 17.2547 19.8374L19.5622 23.0814C19.5683 23.09 19.5782 23.0951 19.5888 23.0951C19.5993 23.0951 19.6092 23.09 19.6153 23.0814L21.9242 19.8375C21.9331 19.825 21.932 19.8079 21.9217 19.7966C21.9113 19.7853 21.8944 19.7827 21.8811 19.7905Z" stroke="#202125" strokeWidth="0.0651343" strokeLinejoin="round"></path>
//               </svg>
//               <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> USDT</span>
//             </div>
//             <div 
//               className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'BNB' ? 'selectMethodBox_active__EdF_w' : ''}`}
//               onClick={() => setActivePaymentMethod('BNB')}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
//                 <path d="M11.5085 15.1276L18.4997 8.13654L25.4945 15.1312L29.5625 11.0632L18.4997 0L7.44069 11.0596L11.5085 15.1276ZM0.5 17.9994L4.56813 13.9313L8.63598 17.9992L4.56789 22.0673L0.5 17.9994ZM11.5085 20.8724L18.4997 27.8635L25.4943 20.869L29.5645 24.9349L29.5625 24.937L18.4997 36L7.44033 24.9408L7.43457 24.935L11.5085 20.8724ZM28.3641 18.0017L32.4323 13.9336L36.5001 18.0014L32.432 22.0695L28.3641 18.0017Z" fill="#F3BA2F"></path>
//                 <path d="M22.6259 17.9979H22.6277L18.4998 13.87L15.4492 16.9206H15.449L15.0985 17.2713L14.3756 17.9943L14.3699 17.9999L14.3756 18.0059L18.4998 22.1302L22.6277 18.0023L22.6297 17.9999L22.6259 17.9979Z" fill="#F3BA2F"></path>
//               </svg>
//               <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> BNB</span>
//             </div>
//           </div>
//               </div>
//               <div className="wallet_otherMethods__BOKMM">
//                 <div className="wallet_otherCryptos__2TkU1 ">
//                   <p onClick={handleOpenCurrencyModal} style={{ cursor: 'pointer' }}>
//                     <img alt="Bitcoin" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/btc.svg" style={{color: "transparent"}} />
//                     <img alt="Tether-Tron" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/usdttrc20.svg" style={{color: "transparent"}} />
//                     <img alt="Tether USD (BSC)" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/usdtbsc.svg" style={{color: "transparent"}} />
//                     <img alt="Kaspa" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/kas.svg" style={{color: "transparent"}} />
//                     <img alt="DOGE" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/doge.svg" style={{color: "transparent"}} />
//                     <img alt="Shiba Inu" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/shib.svg" style={{color: "transparent"}} />
//                     <img alt="extra" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" className="wallet_extra__ZLA9e" src="https://purchase3.blockdag.network/images/extra.svg" style={{color: "transparent"}} />
//                     <span>Other Cryptos</span>
//                   </p>
//                 </div>
//               </div>
//               <div className="wallet_purchaseMethods__n4mDq">
//                 <div className="style_input__d5JsO">
//                   <div className="style_controller__nvybk">
//                     <input translate="no" inputMode="decimal" min="0" className="wallet_input__RkQZe" placeholder="Enter amount" type="number" value={amount}
//         onChange={e => setAmount(e.target.value)}  />
//                     <div className="wallet_selectedMethodCurrencyLabel__YO_mf">
//                       <p className="style_text__Z44aT style_md__ZQhe4">{activePaymentMethod}</p>
//                     </div>
//                     <div className="wallet_max__JwT99">
//                       <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">MAX</p>
//                     </div>
//                     <div className="style_right__R6XjJ"></div>
//                   </div>
//                   <p className="style_text__Z44aT style_sm__RimS5 style_infoDesc__MIj8g text-warning">
//                     <span translate="no" className="errorBNB errorMin">Min. Amount to Purchase: 0.01413 ETH</span>
//                   </p>
//                 </div>
//                 <div className="wallet_purchaseMethodsTitle__SOQtE">
//                   <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">BDAG Worth </p>
//                   <p className="style_text__Z44aT style_lg__AdDq0 style_font-700__9q48B">0.00 BDAG</p>
//                 </div>
//                <button
//                     type="button"
//                     disabled={!amount || amount <= 0 || transactionStatus.isLoading}
//                     onClick={handleBuy}
//                     className="style_button__C9H72 wallet_buyBtn___PtJa style_primary__FoPQF"
//                   >
//                     {transactionStatus.isLoading ? "Processing..." : "Buy Coins"}
//                     <span className="style_wrap__yFGLp"></span>
//                   </button>
                  
//                   {transactionStatus.message && (
//                     <p className={`mt-2 text-center text-sm ${
//                       transactionStatus.isError ? "text-red-500" : "text-green-500"
//                     }`}>
//                       {transactionStatus.message}
//                     </p>
//                   )}
//               </div>
//               <div translate="no" className="promoCode_promocode__fp4Nm undefined ">
//                 <div className="promoCode_promoForm__0loMK">
//                   <form action="" className="promoCode_active__AfYNo">
//                     <div className="promoCode_formGroup__dhqfn">
//                       <div className="style_input__d5JsO">
//                         <div className="style_controller__nvybk">
//                           <input id="promoInput" placeholder="Enter Your Special Key" type="text" value="" name="promoInput" readOnly />
//                           <div className="style_right__R6XjJ">
//                             <label className="style_customLabel__FJRk4">
//                               <p className="style_text__Z44aT style_sm__RimS5 style_light__1UtMf">Apply</p>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>) : (<BuyMiner handleClickModal={handleOpenCurrencyModal} />) }
//         </div>
//         {/* <div className="wallet_shouldLoginOverlay__6lhDi"></div> */}
//       </div>
//       <Transaction />
//     {isModalOpen && <BeatVestingModal onClose={handleCloseModal} />}
//     {isCurrencyModalOpen && <SelectCurrencyModal onClose={handleCloseCurrencyModal} />}
//     </div>
//   )
// }




'use client';
import React, { useState, useEffect, useCallback } from 'react';
import BuyMiner from './buyMiner';
import RankProgress from './rankProgress';
import BeatVestingModal from './beatVestingModal';
import SelectCurrencyModal from './selectCurrencyModal';
import Transaction from './transaction';
import { useSheetData } from '../hooks/useSheetData';
import { parseSheetData } from '../utils/sheetParser';
import { parseConstantsData } from '../utils/parseConstantsData';
import { useActiveWallet, useSendTransaction, useActiveWalletConnectionStatus } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";

const contractAddress = "0x43D033C19eA0A9f8F2459b9A51dC97f59B7725bB";
const abi = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "usdEquivalent", "type": "uint256" }
    ],
    "name": "buyWithETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const MainArea = () => {
  // Data and state management
  const { data: sheetData } = useSheetData();
  const { data: constantsData } = useSheetData("Constants");
  const { profile, transactions } = parseSheetData(sheetData);
  const constants = parseConstantsData(constantsData);

  const [activeTab, setActiveTab] = useState('buyBDAG');
  const [activePaymentMethod, setActivePaymentMethod] = useState('ETH');
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    message: "",
    isError: false,
    isLoading: false
  });

  // Wallet connection
  const wallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const { mutate: sendTransaction } = useSendTransaction();
  const [walletAddress, setWalletAddress] = useState("");
  // Verify wallet and get address
  useEffect(() => {
  const getAddress = async () => {
    if (connectionStatus === "connected" && wallet) {
      try {
        const account = await wallet.getAccount();
        if (account?.address) {
          setWalletAddress(account.address);
          console.log("Wallet connected:", account.address);
        }
      } catch (err) {
        console.error("Error getting wallet address:", err);
      }
    } else {
      setWalletAddress("");
      console.log("Wallet not connected");
    }
  };
  getAddress();
}, [connectionStatus, wallet]);

  // Buy function with wallet verification
  const handleBuy = useCallback(async () => {
    console.log(connectionStatus, walletAddress, amount);
    if (!walletAddress) {
      setTransactionStatus({
        message: "Please connect your wallet first",
        isError: true,
        isLoading: false
      });
      return;
    }


    if (!amount || isNaN(amount)) {
      setTransactionStatus({
        message: "Please enter a valid amount",
        isError: true,
        isLoading: false
      });
      return;
    }

    const usdAmount = parseFloat(amount);
    const ethToSend = usdAmount * 0.00002067; // ETH/USD rate
    const minETH = 0.01413;

    if (ethToSend < minETH) {
      setTransactionStatus({
        message: `Minimum purchase: ${minETH} ETH ($${(minETH/0.00002067).toFixed(2)})`,
        isError: true,
        isLoading: false
      });
      return;
    }

    try {
      setTransactionStatus({
        message: "Preparing transaction...",
        isError: false,
        isLoading: true
      });

      const transaction = prepareContractCall({
        contract: {
          address: contractAddress,
          abi,
        },
        method: "buyWithETH",
        params: [Math.floor(usdAmount * 1e6)],
        value: toWei(ethToSend.toString()),
      });

      setTransactionStatus({
        message: "Confirm in your wallet...",
        isError: false,
        isLoading: true
      });

      await sendTransaction(transaction);

      setTransactionStatus({
        message: "✅ Purchase successful!",
        isError: false,
        isLoading: false
      });

    } catch (error) {
      console.error("Transaction error:", error);
      let errorMessage = "Transaction failed";
      
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction cancelled";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH balance";
      }

      setTransactionStatus({
        message: `❌ ${errorMessage}`,
        isError: true,
        isLoading: false
      });
    }
  }, [walletAddress, amount, sendTransaction]);
  // Modal handlers (keep existing)
  const handleOpenCurrencyModal = () => setIsCurrencyModalOpen(true);
  const handleCloseCurrencyModal = () => setIsCurrencyModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="style_overview__iPKe6">
      <RankProgress />
      <div className="style_balanceSection__K0yQq">
        <div className="style_balances__lxOoR">
          <div className="style_balanceBox___25FT">
            <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total BDAG Balance</p>
            <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
              {profile["Total Balance"] ? `${profile["Total Balance"]} BDAG` : "0.00 BDAG"}
            </p>
            <div className="style_icon__jwMyF">
              {/* ...svg... */}
            </div>
          </div>
          <div className="style_balanceBox___25FT">
            <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Your Coin Worth at Launch</p>
            <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
              {profile["your coin worth at launch"] || "0.00"}
            </p>
            <div className="style_icon__jwMyF">
              {/* ...svg... */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="style_purchase__X5B7u">
        <div className="wallet_wallet__HKWGq wallet_shouldLogin__ai97O">
          <div id="buy" className="wallet_anchor__W3ZBk"></div>
          <div className="wallet_modalHead__Q3MP_">
            <div className="wallet_modalHeadArea__CUzyB">
              <p 
                className={activeTab === 'buyBDAG' ? "wallet_active__9n3l6" : ""}
                onClick={() => setActiveTab('buyBDAG')}
              >
                Buy BDAG
              </p>
              <p 
                className={activeTab === 'buyMiner' ? "wallet_active__9n3l6" : ""}
                onClick={() => setActiveTab('buyMiner')}
              >
                Buy Miner
              </p>
            </div>
          </div>
          
          {activeTab === 'buyBDAG' ? (
            <div className="wallet_walletWrapper__6pNfN">
              <div className="wallet_walletHead__N6OWX">
                <div className="wallet_doubleIt__OhJ0r">
                  <p 
                    className="wallet_doubleText__JRiZM __className_665d18"
                    onClick={handleOpenModal}
                    style={{ cursor: 'pointer' }}
                  >
                    BUY, BEAT VESTING PASS!
                  </p>
                </div>
                <div className="wallet_walletHeadCoin__G_Gxn">
                  <div className="wallet_walletHeadItem__2_GYQ">
                    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total Coin Sales</p>
                    <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
                      {constants["Total Coin sales"] || "$0.00"}
                    </p>
                  </div>
                  <div className="wallet_walletHeadItem__2_GYQ">
                    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">Total Coins Sold</p>
                    <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
                      {constants["Total coins sold"] || "0"}
                    </p>
                  </div>
                </div>
                <div className="style_bar__PrR89">
                  <div className="style_spans__yvuK_">
                    <span>Remaining</span>
                    <span translate="no">{constants["Remaining bar"] || "0"}</span>
                  </div>
                  <span className="style_progress__IPzew" style={{width: "98%"}}></span>
                  <span className="style_progressTitle__SWVW1" style={{left: "98%"}}></span>
                </div>
                <div className="wallet_walletHeadCoin__G_Gxn">
                  <div className="wallet_walletPriceItem__E7HOg">
                    <p className="style_text__Z44aT style_md__ZQhe4">1 BDAG:</p>
                    <p className="style_text__Z44aT style_md__ZQhe4">
                      ${constants["Batch Price"] || "0.00"}
                    </p>
                  </div>
                  <div className="wallet_walletPriceItem__E7HOg">
                    <p className="style_text__Z44aT style_md__ZQhe4">Next Batch:</p>
                    <p className="style_text__Z44aT style_md__ZQhe4">
                      ${constants["Next Batch"] || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="wallet_walletContent__3lxb6">
                <div className="wallet_purchaseMethods__n4mDq">
                  <div className="selectMethodBox_selecttype__Omlpg">
                    <div 
                      className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'ETH' ? 'selectMethodBox_active__EdF_w' : ''}`}
                      onClick={() => setActivePaymentMethod('ETH')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
                        <path d="M18.3114 0.942505L18.0695 1.76283V25.5668L18.3114 25.8078L29.3875 19.2764L18.3114 0.942505Z" fill="currentColor"></path>
                        <path d="M18.3114 0.942505L7.23535 19.2764L18.3114 25.8078L18.3115 14.2541L18.3114 0.942505Z" fill="currentColor"></path>
                        <path d="M18.3114 27.8999L18.1751 28.0657V36.5452L18.3114 36.9425L29.3941 21.3718L18.3114 27.8999Z" fill="currentColor"></path>
                        <path d="M18.3114 36.9425V27.8999L7.23535 21.3716L18.3114 36.9425Z" fill="currentColor"></path>
                        <path d="M18.3114 25.8078L29.3875 19.2764L18.3115 14.2541L18.3114 25.8078Z" fill="currentColor"></path>
                        <path d="M7.23535 19.2764L18.3114 25.8078L18.3115 14.2541L7.23535 19.2764Z" fill="currentColor"></path>
                        <path d="M18.4389 0.852012C18.4186 0.823489 18.3889 0.80181 18.3533 0.791918C18.3473 0.790227 18.3412 0.788918 18.3351 0.787979C18.3208 0.785796 18.3061 0.785565 18.2914 0.787468C18.2851 0.788273 18.279 0.789445 18.273 0.790963L18.4389 0.852012ZM18.4389 0.852012C18.4411 0.855136 18.4432 0.858357 18.4452 0.861671L18.4389 0.852012ZM18.3719 25.9519C18.3271 25.9707 18.2764 25.9675 18.2347 25.944C18.2344 25.9438 18.2341 25.9437 18.2338 25.9435C18.2334 25.9432 18.2329 25.943 18.2324 25.9427L18.3719 25.9519ZM18.3719 25.9519C18.3743 25.9509 18.3767 25.9498 18.3791 25.9487" stroke="currentColor" strokeWidth="0.312645" strokeLinejoin="round"></path>
                      </svg>
                      <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> ETH</span>
                    </div>
                    <div 
                      className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'USDT' ? 'selectMethodBox_active__EdF_w' : ''}`}
                      onClick={() => setActivePaymentMethod('USDT')}
                    >
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
                      <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> USDT</span>
                    </div>
                    <div 
                      className={`selectMethodBox_item__09JVV ${activePaymentMethod === 'BNB' ? 'selectMethodBox_active__EdF_w' : ''}`}
                      onClick={() => setActivePaymentMethod('BNB')}
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
                      <path d="M11.5085 15.1276L18.4997 8.13654L25.4945 15.1312L29.5625 11.0632L18.4997 0L7.44069 11.0596L11.5085 15.1276ZM0.5 17.9994L4.56813 13.9313L8.63598 17.9992L4.56789 22.0673L0.5 17.9994ZM11.5085 20.8724L18.4997 27.8635L25.4943 20.869L29.5645 24.9349L29.5625 24.937L18.4997 36L7.44033 24.9408L7.43457 24.935L11.5085 20.8724ZM28.3641 18.0017L32.4323 13.9336L36.5001 18.0014L32.432 22.0695L28.3641 18.0017Z" fill="#F3BA2F"></path>
                      <path d="M22.6259 17.9979H22.6277L18.4998 13.87L15.4492 16.9206H15.449L15.0985 17.2713L14.3756 17.9943L14.3699 17.9999L14.3756 18.0059L18.4998 22.1302L22.6277 18.0023L22.6297 17.9999L22.6259 17.9979Z" fill="#F3BA2F"></path>
                    </svg>
                      <span className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B"> BNB</span>
                    </div>
                  </div>
                </div>
                
                <div className="wallet_otherMethods__BOKMM">
                  <div className="wallet_otherCryptos__2TkU1">
                    <p onClick={handleOpenCurrencyModal} style={{ cursor: 'pointer' }}>
                      <img alt="Bitcoin" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/btc.svg" style={{color: "transparent"}} />
                    <img alt="Tether-Tron" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/usdttrc20.svg" style={{color: "transparent"}} />
                    <img alt="Tether USD (BSC)" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/usdtbsc.svg" style={{color: "transparent"}} />
                    <img alt="Kaspa" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/kas.svg" style={{color: "transparent"}} />
                    <img alt="DOGE" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/doge.svg" style={{color: "transparent"}} />
                    <img alt="Shiba Inu" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="https://purchase3.blockdag.network/images/coins/shib.svg" style={{color: "transparent"}} />
                    <img alt="extra" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" className="wallet_extra__ZLA9e" src="https://purchase3.blockdag.network/images/extra.svg" style={{color: "transparent"}} />
                    <span>Other Cryptos</span>
                    </p>
                  </div>
                </div>
                
                <div className="wallet_purchaseMethods__n4mDq">
                  <div className="style_input__d5JsO">
                    <div className="style_controller__nvybk">
                      <input 
                        translate="no" 
                        inputMode="decimal" 
                        min="0" 
                        className="wallet_input__RkQZe" 
                        placeholder="Enter amount" 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}  
                      />
                      <div className="wallet_selectedMethodCurrencyLabel__YO_mf">
                        <p className="style_text__Z44aT style_md__ZQhe4">{activePaymentMethod}</p>
                      </div>
                      <div className="wallet_max__JwT99">
                        <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">MAX</p>
                      </div>
                      <div className="style_right__R6XjJ"></div>
                    </div>
                    <p className="style_text__Z44aT style_sm__RimS5 style_infoDesc__MIj8g text-warning">
                      <span translate="no" className="errorBNB errorMin">Min. Amount to Purchase: 0.01413 ETH</span>
                    </p>
                  </div>
                  
                  <div className="wallet_purchaseMethodsTitle__SOQtE">
                    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">BDAG Worth </p>
                    <p className="style_text__Z44aT style_lg__AdDq0 style_font-700__9q48B">0.00 BDAG</p>
                  </div>
                  
                  <button
                    type="button"
                    disabled={!amount || amount <= 0 || transactionStatus.isLoading}
                    onClick={handleBuy}
                    className="style_button__C9H72 wallet_buyBtn___PtJa style_primary__FoPQF"
                  >
                    {transactionStatus.isLoading ? "Processing..." : "Buy Coins"}
                    <span className="style_wrap__yFGLp"></span>
                  </button>
                  
                  {transactionStatus.message && (
                    <p className={`mt-2 text-center text-sm ${
                      transactionStatus.isError ? "text-red-500" : "text-green-500"
                    }`}>
                      {transactionStatus.message}
                    </p>
                  )}
                </div>
                
                <div translate="no" className="promoCode_promocode__fp4Nm undefined">
                  <div className="promoCode_promoForm__0loMK">
                    <form action="" className="promoCode_active__AfYNo">
                      <div className="promoCode_formGroup__dhqfn">
                        <div className="style_input__d5JsO">
                          <div className="style_controller__nvybk">
                            <input id="promoInput" placeholder="Enter Your Special Key" type="text" value="" name="promoInput" readOnly />
                            <div className="style_right__R6XjJ">
                              <label className="style_customLabel__FJRk4">
                                <p className="style_text__Z44aT style_sm__RimS5 style_light__1UtMf">Apply</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <BuyMiner handleClickModal={handleOpenCurrencyModal} />
          )}
        </div>
      </div>
      
      <Transaction />
      {isModalOpen && <BeatVestingModal onClose={handleCloseModal} />}
      {isCurrencyModalOpen && <SelectCurrencyModal onClose={handleCloseCurrencyModal} />}
    </div>
  );
};