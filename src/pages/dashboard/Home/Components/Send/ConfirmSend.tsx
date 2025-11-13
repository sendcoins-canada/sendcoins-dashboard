import React from "react";
import { Button } from "@/components/ui/button";
import { TransmitSqaure2, ArrowLeft2, Edit2 } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { Convert, Money, Money2 } from "iconsax-react";
import Eth from "@/assets/Eth.svg"
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate()

  return (
    <>
<div className="hidden md:block">
              <Header />
            </div>    
            <div className=" flex flex-col items-center justify-center px-4 py-10 md:py-0">
          <div className="flex flex-col items-center mb-6">

        
        <div className="flex items-center md:justify-center gap-6 mb-8 md:mb-2">
                             <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2  w-fit" onClick={() => navigate(-1)}>
                               <ArrowLeft2 size="20" color="black" className="" />
                             </div>
                 
                             <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">
                               Transaction summary
                             </h2>
                           </div>
          <TransmitSqaure2 size="64" color="#0647F7" variant="Bold"/>
        <p className="text-[#777777] text-sm">You are sending</p>
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
      <div className="w-full max-w-md bg-white rounded-2xl mt-4 divide-y divide-gray-200 text-neutral">
        <div className="flex items-center justify-between p-3 text-sm">
          <span className="flex items-center gap-2">
            <Convert size="16" color="#777777" className="inline"/> Exchange rate
          </span>
          <span className="text-primary">{exchangeRate}</span>
        </div>
        <div className="flex items-center justify-between p-3 text-sm">
          <span className="flex items-center gap-2">
             <Money2 size="16" color="#777777" className="inline"/> Platform fee
          </span>
          <span className="text-primary">{platformFee}</span>
        </div>
        <div className="flex items-center justify-between p-3 text-sm font-semibold">
          <span className="flex items-center gap-2">
             <Money size="16" color="#777777" className="inline"/> Amount Received
          </span>
          <span className="text-primary">
            {amount} {asset}
            <span className="text-xs text-neutral ml-1">(≈5 USD)</span>
          </span>
        </div>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl mt-4 divide-y divide-gray-200 text-neutral">
        <div className="flex flex-col justify-between p-3 text-sm">
            <p className="inline"> Write memo <Edit2 size="16" color="#777777" className="inline"/></p>
          
          <span className="text-primary">Write Memo</span>
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
