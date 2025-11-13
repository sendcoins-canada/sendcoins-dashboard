// src/components/send/RecipientDetails.tsx
import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { Scanner, ArrowLeft2 } from "iconsax-react";
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
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
        <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm ">Back</p>
      </div>

      <div className="flex flex-col items-center min-h-[75vh] px-4">

        <div className="w-full max-w-sm md:mt-0 mt-20">
          {/* Page Title */}
          <div className="flex items-center md:justify-center gap-6 mb-8">
            <div className="md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2  w-fit" onClick={() => navigate(-1)}>
              <ArrowLeft2 size="20" color="black" className="" />
            </div>

            <h2 className="md:text-2xl font-semibold text-center">
              Enter recipient details
            </h2>
          </div>

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
                <label className="text-xs text-neutral mb-2">Wallet address</label>
                <div className="flex items-center justify-between bg-[#F5F5F5] transition-colors">

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste or scan wallet address"
                    className="w-full bg-transparent outline-none placeholder:text-base placeholder:text-primary"
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 text-xs text-[#6A91FB] hover:underline shrink-0 ml-2"
                  >
                    <Scanner size={14} color="#0539C7" />
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save address text */}

          <p className={`text-sm text-[#BBBBBB] mt-3 flex items-center gap-1 cursor-pointer  ${address ? "text-primary font-medium" : "text-[#BBBBBB]"}`} onClick={() => setOpenSaveModal(true)}>
            Save this address <span className="">+</span>
          </p>


          {/* Continue button */}
          <div className="flex justify-center mt-30">
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
