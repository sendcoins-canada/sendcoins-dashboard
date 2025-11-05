import React, { useState } from "react";
import  Modal  from "@/components/ui/Modal";
import { Apple, ArrowRight2, Bank, BuyCrypto } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
// import { BuyCrypto, Moneys } from "iconsax-react";
import { assets } from "../Send/SelectCryptoAsset";
import QR from "@/assets/QR Code.svg"

interface FundOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FundOptionsModal: React.FC<FundOptionsModalProps> = ({
  open,
  onOpenChange,
}) => {
     const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<"bank" | "crypto" | "apple" | null>(null);
   const [fundNetwork, setFundNetwork] = useState("usdc");

  const handleSelect = (option: "bank" | "crypto" | "apple") => {
    setSelected(option);
    // onSelectOption(option);
    setStep(2);
  };

    const handleBack = () => {
    setStep(1);
    setSelected(null);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-md w-[90%] bg-[#F5F5F5]"
    >
      {step === 1 && (
        <>
          <h2 className="text-[28px] font-semibold text-center">
            Choose a funding method
          </h2>

          <div className="flex flex-col gap-3 mt-3 bg-white p-2 rounded-2xl">
            {/* Bank */}
            <button
              onClick={() => handleSelect("bank")}
              className={`flex justify-between items-start border rounded-xl px-2 py-4 text-left hover:bg-[#F5F5F5] transition ${
                selected === "bank" ? "bg-[#F5F5F5]" : "border-gray-200"
              }`}
            >
              <div className="flex gap-2">
                <Bank color="#0088FF" size={16} />
                <div>
                  <p className="font-medium text-gray-800">Bank Transfer</p>
                  <p className="text-sm text-gray-500">
                    Send funds from your bank directly.
                  </p>
                </div>
              </div>
              <ArrowRight2 size="18" color="black" />
            </button>

            {/* Crypto */}
            <button
              onClick={() => handleSelect("crypto")}
              className={`flex justify-between items-start border rounded-xl px-2 py-4 text-left hover:bg-[#F5F5F5] transition ${
                selected === "crypto" ? "bg-[#F5F5F5]" : "border-gray-200"
              }`}
            >
              <BuyCrypto color="#0088FF" size={16} />
              <div>
                <p className="font-medium text-gray-800">Crypto</p>
                <p className="text-sm text-gray-500">
                  Send directly to their local bank account. Fast and reliable.
                </p>
              </div>
              <ArrowRight2 size="18" color="black" />
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSelect("apple")}
              className={`flex justify-between items-start border rounded-xl px-2 py-4 text-left hover:bg-[#F5F5F5] transition ${
                selected === "apple" ? "bg-[#F5F5F5]" : "border-gray-200"
              }`}
            >
              <div className="flex gap-2">
                <Apple color="#0088FF" size={16} variant="Bold" />
                <div>
                  <p className="font-medium text-gray-800">Apple</p>
                  <p className="text-sm text-gray-500">
                    Add money to your wallet in one tap.
                  </p>
                </div>
              </div>
              <ArrowRight2 size="18" color="black" />
            </button>
          </div>
        </>
      )}

      {step === 2 && selected === "bank" && (
        <>
        <h2 className="text-[28px] font-semibold text-center">
            Bank Details
          </h2>
          <button onClick={handleBack} className="pl-2 text-gray-600 mb-3">
             Back
          </button>
        <div className="p-2 bg-white rounded-2xl text-center">
          <div className="bg-[#F5F5F5] rounded-2xl py-2">
          
          <div className="flex-col gap-4 space-y-4">

          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Bank name</p>
            <p>Scotiabank</p>
          </div>
          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Account name</p>
            <p>Michael Scott</p>
          </div>
          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Account Number</p>
            <p>1234567812</p>
          </div>
          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Transit Number</p>
            <p>23123</p>
          </div>
          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Institution Number</p>
            <p>995</p>
          </div>
          <div className="flex justify-between px-4">
            <p className="text-sm text-[#777777]">Reference Code</p>
            <p>SC-99GT43G3</p>
          </div>
          </div>
          <p className="text-sm text-[#777777] mt-4 mb-2">Expires in <span className="text-[#21963B]">29:50</span></p>

          </div>
         <Button className="bg-[#F5F5F5] my-2">I have sent the money</Button>
        </div>
        </>
      )}

      {step === 2 && selected === "crypto" && (
         <>
        <h2 className="text-[28px] font-semibold text-center">
            Wallet Details
          </h2>
          <button onClick={handleBack} className="pl-2 text-gray-600 mb-3">
             Back
          </button>
        <div className="p-2 bg-white rounded-2xl text-center">
          <div className="bg-[#F5F5F5] rounded-2xl p-2">
          
          <div className="flex items-center justify-between gap-4 space-y-4 bg-white p-2 rounded-xl">

         <p className="text-[#777777] text-sm">Network</p>
                    <Select
                  value={fundNetwork}
                  onChange={setFundNetwork}
                  options={assets.map((a) => ({
                    value: a.id,
                    label: a.name,
                    icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
                  }))}
                  className="w-[150px]"
                />
                          </div>

            <img src={QR} alt="QR code"  className="mx-auto mt-4"/>

          <p className="text-sm text-[#777777] mt-4 mb-2">Your USDC wallet address</p>
          <p className="text-sm ">0x89f830x89f8a1C30x89f830x89f8a1C3</p>

          </div>
          <div className="flex justify-center gap-4">

         <Button className="bg-[#F5F5F5] my-2">Share</Button>
         <Button className="bg-[#0647F7] my-2 text-white">Copy</Button>
          </div>
        </div>
        </>
      )}
    </Modal>
  );
};

export default FundOptionsModal;
