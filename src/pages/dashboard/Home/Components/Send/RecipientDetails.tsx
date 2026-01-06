// src/components/send/RecipientDetails.tsx
import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { Scanner, ArrowLeft2 } from "iconsax-react";
import { Select } from "@/components/ui/select";
import SaveRecipientModal from "./SaveRecipientModal";
import { getRecipientsThunk } from "@/store/recipients/asyncThunks/getAllRecipients";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
// import { showSuccess } from "@/components/ui/toast";

type Props = {
  asset: string;
  onBack: () => void;
  onNext: (data: { network: string; address: string; keychain: string }) => void;
};

const RecipientDetails: React.FC<Props> = ({ asset, onNext }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);
  const recipients = useSelector((state: RootState) => state.recipients.recipients);
  
  // extract unique networks
const availableNetworks = Array.from(
  new Map(recipients.map(r => [`${r.network}-${r.asset}`, r])).values()
).map(r => ({
  label: `${r.network} (${r.asset})`,
  value: `${r.network}-${r.asset}`,
  network: r.network,
  walletAddress: r.walletAddress,
  asset: r.asset
}));

  const [network, setNetwork] = useState<string>(availableNetworks[0]?.value ?? "");
  
  const valid = address.trim() !== "";

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch {
      alert("Clipboard access denied. Please paste manually.");
    }
  };
  useEffect(() => {
    if (token) {
      dispatch(getRecipientsThunk({ token }));
    }
  }, [dispatch, token]);

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
              onChange={(value: string) => {
                setNetwork(value);
                // auto-fill wallet address
                const recipient = availableNetworks.find(r => r.value === value);
                if (recipient) setAddress(recipient.walletAddress);
              }}
              options={availableNetworks.map(r => ({
                value: r.value,
                label: r.label,
              }))}
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
              onClick={() => onNext({ network, address, keychain: '' })}
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
