"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  useAppKitAccount,
  useAppKitBalance,
  useAppKitNetwork,
  useAppKitState,
} from "@reown/appkit/react";
import { usePublicClient, useSendTransaction } from "wagmi";
import { parseUnits, formatUnits, encodeFunctionData } from "viem";

const DESTINATION_WALLET = "0xecB518e9D8a14e74DFBa3Ba044D7be9951A95395";
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Mainnet USDT
const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

export const MainArea = () => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { fetchBalance } = useAppKitBalance({ address });
  const { sendTransaction, error, isError } = useSendTransaction();
  const [balance, setBalance] = useState(null);
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
  const [walletAddress, setWalletAddress] = useState("");

  const { data: sheetData } = useSheetData(walletAddress);
  const { data: constantsData } = useSheetData("Constants");
  const { profile } = parseSheetData(sheetData);
  const constants = parseConstantsData(constantsData);
  const publicClient = usePublicClient();
  const { initialized, loading, open, selectedNetworkId, activeChain } =
    useAppKitState();

  useEffect(() => {
    fetchBalance().then((balance) => {
      setBalance(balance.data);
    });
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } else {
      setWalletAddress("");
      localStorage.removeItem("walletAddress");
    }
  }, [isConnected, address]);

  // useEffect(() => {
  //   if (!isPending) {
  //     if (isSuccess) {
  //       successHandler(sendData);
  //     }
  //     if (isError) {
  //       setTransactionStatus({
  //         isLoading: false,
  //         message: `Transaction failed: ${error.message || error}`,
  //         isError: true,
  //       });
  //     }
  //   }
  // }, [isPending, isSuccess, isError, sendData, error]);

  const successHandler = async (result) => {
    console.log(result);

    if (result) {
      const txHash = result;

      setTransactionStatus({
        isLoading: true,
        message: `Transaction sent! Hash: ${txHash.substring(
          0,
          10
        )}... Waiting for confirmation...`,
        isError: false,
      });

      // In most cases with wagmi/reown, we don't need to manually check confirmation
      // as the hooks handle this for us. But we'll keep this structure for consistency.
      setTransactionStatus({
        isLoading: false,
        message: `Transaction sent! Hash: ${txHash.substring(0, 10)}...`,
        isError: false,
      });
    } else {
      setTransactionStatus({
        isLoading: false,
        message:
          "Transaction sent successfully! Please check your wallet for confirmation.",
        isError: false,
      });
    }
  };

  const handleBuy = useCallback(async () => {
    if (!isConnected) {
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
      if (activePaymentMethod === "ETH" || activePaymentMethod === "BNB") {
        // Balance checking using wagmi hooks
        // if (balance) {
        //   const balanceInEth = parseFloat(formatUnits(balance));
        //   const transactionAmount = parseFloat(amount);
        //   const estimatedGasFee = 0.002;
        //   const totalNeeded = transactionAmount + estimatedGasFee;

        //   if (balanceInEth < totalNeeded) {
        //     throw new Error(
        //       `Insufficient funds. You have ${balanceInEth} ETH but need approximately ${totalNeeded} ETH (${transactionAmount} + ~${estimatedGasFee} gas fees)`
        //     );
        //   }
        // }

        // Send transaction using wagmi
        sendTransaction({
          to: DESTINATION_WALLET,
          value: parseUnits(amount, 18), // Assuming 18 decimals for ETH
        });
      } else if (activePaymentMethod === "USDT") {
        if (chainId !== 1) {
          throw new Error(
            "Please switch to Ethereum mainnet for USDT transactions."
          );
        }

        // // For USDT we'll use the raw contract interaction
        // const amountInSmallestUnit = parseUnits(amount, 6); // USDT has 6 decimals
        const amountInUnits = parseUnits(amount, 6);

        // // Check USDT balance first
        // const balanceUSDT = await publicClient.readContract({
        //   address: USDT_CONTRACT,
        //   abi: USDT_ABI,
        //   functionName: "balanceOf",
        //   args: [address],
        // });
        // console.log(balanceUSDT, amountInUnits);

        // if (parseFloat(balance.balance) < amountInUnits) {
        //   throw new Error(
        //     `Insufficient USDT balance. You have ${formatUnits(
        //       balance.balance,
        //       6
        //     )} USDT`
        //   );
        // }

        sendTransaction(
          {
            to: USDT_CONTRACT,
            data: encodeFunctionData({
              abi: USDT_ABI,
              functionName: "transfer",
              args: [DESTINATION_WALLET, amountInUnits],
            }),
            // Add gas estimate (optional but recommended)
            gas: 100000n, // 100,000 gas units
          },
          {
            onSuccess: (hashData) => successHandler(hashData),
            onError: (error) => {
              console.error("USDT transaction error:", error);
              setTransactionStatus({
                isLoading: false,
                message: `Transaction failed: ${error.message || error}`,
                isError: true,
              });
            },
          }
        );
      }
    } catch (error) {
      console.error("Transaction error:", error);
      let errorMessage = "";

      if (error.message?.includes("Wallet not properly connected")) {
        errorMessage =
          "Wallet connection lost. Please reconnect your wallet and try again.";
      } else if (error.message?.includes("cancelled by user")) {
        errorMessage = "Transaction was cancelled.";
      } else if (error.message?.includes("Insufficient")) {
        errorMessage = error.message;
      } else if (error.message?.includes("switch to Ethereum mainnet")) {
        errorMessage = error.message;
      } else if (error.code === 4001 || error.code === "ACTION_REJECTED") {
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
  }, [
    isConnected,
    address,
    amount,
    activePaymentMethod,
    sendTransaction,
    balance,
    chainId,
  ]);

  const handleOpenCurrencyModal = () => setIsCurrencyModalOpen(true);
  const handleCloseCurrencyModal = () => setIsCurrencyModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  useEffect(() => {
    console.log("Transaction Status:", isError);

    if (isError) {
      console.log("===>" + error.message);
    }
  }, [isError]);
  if (loading) {
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
        profile={profile}
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
            <div className="style_icon__jwMyF">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 14H16.51M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7L5 7C3.89543 7 3 6.10457 3 5ZM3 5C3 3.89543 3.89543 3 5 3H17M17 14C17 14.2761 16.7761 14.5 16.5 14.5C16.2239 14.5 16 14.2761 16 14C16 13.7239 16.2239 13.5 16.5 13.5C16.7761 13.5 17 13.7239 17 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
          <div className="style_balanceBox___25FT">
            <p className="style_text__Z44aT style_sm__RimS5 style_primary__o7qgw">
              Your Coin Worth at Launch
            </p>
            <p className="style_title__VJGg6 __className_665d18 style_sm__fI_bB">
              {profile["your coin worth at launch"] || "0.00"}
            </p>
            <div className="style_icon__jwMyF">
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 15.5627C8.5 16.8513 9.54467 17.896 10.8333 17.896H13C14.3807 17.896 15.5 16.7767 15.5 15.396C15.5 14.0153 14.3807 12.896 13 12.896H11C9.61929 12.896 8.5 11.7767 8.5 10.396C8.5 9.01528 9.61929 7.896 11 7.896H13.1667C14.4553 7.896 15.5 8.94067 15.5 10.2293M12 6.396V7.896M12 17.896V19.396M22 12.896C22 18.4188 17.5228 22.896 12 22.896C6.47715 22.896 2 18.4188 2 12.896C2 7.37315 6.47715 2.896 12 2.896C17.5228 2.896 22 7.37315 22 12.896Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
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
                      ${constants["price for purchase"] || "0.00"}
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
