'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

export default function EthBuyWidget() {
  const [usdValue, setUsdValue] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = "0x43D033C19eA0A9f8F2459b9A51dC97f59B7725bB";
  const abi = [
    "function buyWithETH(uint256 usdEquivalent) external payable",
    "event TokensPurchasedWithETH(address buyer, uint256 tokens, uint256 usdValue, uint256 ethAmount)"
  ];

  const buyWithETH = async () => {
    if (!usdValue || parseFloat(usdValue) <= 0) {
      setStatus('Please enter a valid USD amount');
      return;
    }

    if (!window.ethereum) {
      setStatus('MetaMask is required for this transaction');
      return;
    }

    setIsLoading(true);
    setStatus('Initializing transaction...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Conversion rates
      const ethPerUSD = 0.00002067;
      const usdAmount = parseFloat(usdValue);
      const ethToSend = usdAmount * ethPerUSD;

      setStatus('Confirm transaction in your wallet...');
      
      const tx = await contract.buyWithETH(
        Math.floor(usdAmount * 1e6), // USD equivalent with 6 decimals
        { value: ethers.parseEther(ethToSend.toString()) }
      );

      setStatus('Transaction sent, waiting for confirmation...');
      await tx.wait();
      
      setStatus('✅ Purchase successful!');
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = 'Transaction failed';
      
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction cancelled by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance';
      }
      
      setStatus(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Buy Tokens (ETH)</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          value={usdValue}
          onChange={(e) => setUsdValue(e.target.value)}
          placeholder="USD value (e.g. 5)"
          style={{
            padding: '0.75rem',
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
          disabled={isLoading}
        />
      </div>
      
      <button
        onClick={buyWithETH}
        disabled={isLoading || !usdValue}
        style={{
          padding: '0.75rem 1.5rem',
          background: isLoading ? '#ccc' : '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isLoading ? 'Processing...' : 'Buy with ETH'}
      </button>
      
      {status && (
        <p 
          style={{
            marginTop: '1rem',
            color: status.includes('✅') ? 'green' : status.includes('❌') ? 'red' : 'inherit',
            textAlign: 'center'
          }}
        >
          {status}
        </p>
      )}
      
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#666' }}>
        <p>Current rate: 1 USD = {0.00002067} ETH</p>
        <p>Contract address: {contractAddress}</p>
      </div>
    </div>
  );
}