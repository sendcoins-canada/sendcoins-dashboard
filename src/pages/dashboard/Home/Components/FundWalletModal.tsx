import React from "react";
import { useNavigate } from "react-router-dom";
import Btc from "@/assets/Btc.svg"
import Eth from "@/assets/Eth.svg"
import matic from "@/assets/matic.svg"
import usdc from "@/assets/Usdc.svg"

const wallets = [
  {
    name: "My Bitcoin wallet",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-orange-500",
    icon: Btc,
  },
  {
    name: "Default wallet 1",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-gray-400",
    icon: Eth,
  },
  {
    name: "USDC Wallet",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-blue-500",
    icon: usdc,
  },
  {
    name: "Savings Eth wallet",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-purple-500",
    icon: Eth,
  },
  {
    name: "Matic",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-indigo-500",
    icon: matic,
  },
  {
    name: "Ethereum wallet 3",
    address: "Dw49Rt...aJC3",
    amountUSD: "$1,000",
    amountBTC: "0.05 BTC",
    color: "bg-blue-600",
    icon: Eth,
  },
];


const WalletModal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mt-4 ">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-semibold">Your wallets</h2>
        <button
          onClick={() => navigate("/dashboard/create-wallet")}
          className="bg-black text-white text-sm px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
        >
          + Add Wallet
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {wallets.map((wallet, i) => (
          <div
            key={i}
            className="flex justify-between items-center border bg-secondarygray hover:bg-[#CDDAFE] p-3 rounded-xl cursor-pointer"
          >
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src={wallet.icon}
                  alt={`${wallet.name} icon`}
                  className="w-7 h-7"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{wallet.name}</p>
                <p className="text-xs text-gray-500">{wallet.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{wallet.amountUSD}</p>
              <p className="text-xs text-gray-500">{wallet.amountBTC}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletModal;
