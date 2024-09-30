/* eslint-disable no-unused-vars */
import { useState } from "react";
import useWallet from "./hooks/useWallet";
import { WalletProvider } from "./context/MyContext";


const App = () => {
  const { address, balance, connectWallet, setAddress, fetchBalance, chainId, disconnectWallet } = useWallet();

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleFetchBalance = () => {
    fetchBalance(address);
  };

  return (
    <WalletProvider>
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-black">
            {address &&  <blockquote className="border-l-4 border-gray-400 italic text-gray-600 bg-gray-100 p-4 text-xs rounded-md shadow-lg my-2">chainID:{chainId}</blockquote>}
            {address &&  <blockquote className="border-l-4 border-gray-400  italic text-gray-600 bg-gray-100 p-4 text-xs rounded-md shadow-lg my-2">Connected address: {address}</blockquote>}
            {
              address ?
              <button className="bg-black text-white w-full py-2 mb-4 rounded" onClick={disconnectWallet}>Disconnect</button>
              :
              <button className="bg-black text-white w-full py-2 px-3 mb-4 rounded" onClick={connectWallet}>Connect Wallet</button>

            }
            <div className="flex flex-col space-y-4">
              {address &&
              
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter address"
                className="border p-2 rounded w-full bg-transparent"
              />
            }
            {address && <button onClick={handleFetchBalance} className="bg-blue-500 text-white p-2 rounded w-full">Get Balance</button>}
            </div>
            {balance && <div className="mt-4 text-center text-black">Balance: {balance} ETH</div>}
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default App;
