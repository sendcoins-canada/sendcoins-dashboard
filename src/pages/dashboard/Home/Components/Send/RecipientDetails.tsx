// src/components/send/RecipientDetails.tsx
import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { Clipboard } from "iconsax-react";
import { Select } from "@/components/ui/select";
import { assets } from "./SelectCryptoAsset";
import SaveRecipientModal from "./SaveRecipientModal";
// import { showSuccess } from "@/components/ui/toast";

type Props = {
  asset: string;
  onBack: () => void;
  onNext: (data: { network: string; address: string }) => void;
};

const RecipientDetails: React.FC<Props> = ({ asset, onNext }) => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("eth");
  const [address, setAddress] = useState("");
  const [openSaveModal, setOpenSaveModal] = useState(false);

  const valid = address.trim() !== "";

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch {
      alert("Clipboard access denied. Please paste manually.");
    }
  };

  return (
    <>
      {/* Keep your existing header */}
      <HeaderWithCancel onCancel={() => navigate(-1)} />

      <div className="flex flex-col items-center min-h-[75vh] px-4">
        <div className="w-full max-w-sm">
          {/* Page Title */}
          <h2 className="text-center text-[28px] font-semibold text-neutral-900 mb-1">
            Enter recipient details
          </h2>

          {/* Network Select */}
          <div className="mt-6">
            <label className="text-sm text-neutral-600">Network</label>
            <Select
              value={network}
              onChange={setNetwork}
              options={assets.map((a) => ({
                value: a.id,
                label: a.name,
                icon: <img src={a.icon} alt={a.name} className="w-5 h-5" />,
              }))}
              className="mt-1"
            />
          </div>

          {/* Wallet Address Input */}
         
           <div className="w-full">
      <div className="relative mt-1">
        <div className="flex flex-col bg-[#F5F5F5] rounded-xl px-3 py-[10px] border border-transparent focus-within:border-[#0052FF] transition-colors">
      <label className="text-sm text-neutral-600 mb-2">Wallet address</label>
      <div className="flex items-center justify-between bg-[#F5F5F5] transition-colors">

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste or scan wallet address"
            className="w-full bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
            />
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline shrink-0 ml-2"
            >
            <Clipboard size={14} color="#2563eb" />
            Paste
          </button>
              </div>
        </div>
      </div>
    </div>

          {/* Save address text */}
          <p className="text-xs text-neutral-400 mt-3 flex items-center gap-1 cursor-pointer"  onClick={() => setOpenSaveModal(true)}>
            Save this address <span className="text-neutral-500">+</span>
          </p>

          {/* Continue button */}
          <div className="flex justify-center mt-10">
            <Button
              onClick={() => onNext({ network, address })}
              disabled={!valid}
              className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2"
            >
              Continue 
            </Button>
          </div>
        </div>
      </div>
      
      <SaveRecipientModal
        open={openSaveModal}
        onOpenChange={setOpenSaveModal}
        address={address}
        network={network}
        asset={asset}
      />
    </>
  );
};

export default RecipientDetails;
