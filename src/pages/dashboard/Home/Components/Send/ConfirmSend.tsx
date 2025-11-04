import React from "react";
import { Button } from "@/components/ui/button";
import { TransmitSqaure2 } from "iconsax-react";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { Convert, Money, Money2 } from "iconsax-react";
import Eth from "@/assets/Eth.svg"


type Props = {
  asset: string;
  recipient: { name: string; address: string };
  amount: string;
  onBack: () => void;
  onConfirm: () => void;
};

const ConfirmSend: React.FC<Props> = ({
  asset,
  recipient,
  amount,
  onConfirm,
}) => {
  const exchangeRate = "$1 = 1 USDC";
  const platformFee = "Not applied";
  const estimatedArrival = "3 mins";

  return (
    <>
    <HeaderWithCancel />
    <div className=" flex flex-col items-center justify-center px-4 py-10">
      {/* Back button */}
      {/* <div className="absolute top-6 left-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div> */}

      {/* Header */}
      <div className="flex flex-col items-center mb-6">

        
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Transaction details
        </h2>
          <TransmitSqaure2 size="64" color="#0647F7" variant="Bold"/>
        <p className="text-[#777777] text-sm">You sent</p>
        <p className="text-4xl font-bold text-gray-900">{amount} {asset}</p>
        <p className="text-sm text-[#0052FF] mt-1">~5 USD</p>
      </div>

<div className="bg-[#F5F5F5] max-w-md w-full p-2 rounded-2xl">
      {/* Card */}
      <div className="w-full max-w-md bg-white  rounded-2xl ">
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">From</p>
            <p className="text-sm font-medium text-gray-900">
              Your Wallet
            </p>
          </div>
            <p className="text-xs text-gray-400 text-right">ETH | 0x89f8...a1C3</p>
        </div>

        <div className="px-4 py-2 flex justify-between items-center">
          <p className="text-sm text-gray-500">Network</p>
          <div className="flex items-center gap-2">
            <img
              src={Eth}
              alt="Ethereum"
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-800 capitalize">
            {asset}
            </span>
          </div>
        </div>

       
      </div>

      <div className="bg-white rounded-2xl mt-2">
         <div className="p-4 flex flex-col ">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">To</p>
            <p className="text-sm font-medium text-gray-900">
              {recipient.name || "—"}
            </p>
          </div>
            <p className="text-xs text-gray-400 text-right">{recipient.address}</p>
        </div>

        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Estimated Arrival</p>
          <p className="text-sm font-medium text-gray-900">
            {estimatedArrival}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="w-full max-w-md bg-white rounded-2xl mt-4 divide-y divide-gray-200">
        <div className="flex items-center justify-between p-3 text-sm">
          <span className="flex items-center gap-2">
            <Convert size="16" color="#777777" className="inline"/> Exchange rate
          </span>
          <span>{exchangeRate}</span>
        </div>
        <div className="flex items-center justify-between p-3 text-sm">
          <span className="flex items-center gap-2">
             <Money2 size="16" color="#777777" className="inline"/> Platform fee
          </span>
          <span>{platformFee}</span>
        </div>
        <div className="flex items-center justify-between p-3 text-sm font-semibold">
          <span className="flex items-center gap-2">
             <Money size="16" color="#777777" className="inline"/> Amount Received
          </span>
          <span>
            {amount} {asset}
            <span className="text-xs text-gray-500 ml-1">(≈5 USD)</span>
          </span>
        </div>
      </div>

      </div>

      {/* Continue button */}
      <Button
        onClick={onConfirm}
        className="mt-8 bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full px-12 py-2"
      >
        Continue
      </Button>
    </div>
    </>
  );
};

export default ConfirmSend;
