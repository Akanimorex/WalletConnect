import { createContext,useContext,useState,useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext("");


export const WalletProvider = ({ children }) => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState(null);
    const [chainId, setChainId] = useState("");


    useEffect(() => {
        if (window.ethereum) {
          setProvider(window.ethereum);
          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", handleChainChanged);
    
          // Cleanup event listeners on unmount
          return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
          };
        }
      }, [address]);


      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
            setAddress("");
            setBalance("");
        }
      };

      const handleChainChanged = async (chainId) => {
        const convertedChainId = Number(chainId);
        setChainId(convertedChainId);
        if (address) fetchBalance(address);
        // const newChainId = await provider.request({ method: "eth_chainId" });
        // setChainId(newChainId);
        setProvider(new ethers.BrowserProvider(window.ethereum));
      };

      const connectWallet = async () => {
        if (provider) {
          try {
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            const chainId = await provider.request({ method: "eth_chainId" });
            setChainId(Number(chainId));
            handleAccountsChanged(accounts);
          } catch (error) {
            console.error("Failed to connect wallet", error);
          }
        }
      };


  const disconnectWallet = () => {
    setAddress("");
    setBalance("");
    setChainId("");
    setProvider(null);
  };

  const fetchBalance = async (addr) => {
    if (provider) {
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });
      setBalance(ethers.formatEther(balance));
    }
  };

  const value = {
    address,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;

};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
      throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
  };