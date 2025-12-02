
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { Select } from "@/components/ui/select";
import { assets } from "./SelectCryptoAsset";
import { useNavigate } from "react-router-dom";
import { Convert, Money, Money2, ArrowLeft2 } from "iconsax-react";
import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";

interface EnterAmountProps {
  asset: string;
  onBack: () => void;
  onNext: (amount: string) => void;
}

const EnterAmount: React.FC<EnterAmountProps> = ({ onNext }) => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [sendAsset, setSendAsset] = useState("cad");
  const [receiveAsset, setReceiveAsset] = useState("usdc");
  const [error, setError] = useState("");
    const [isWalletModalOpen, setWalletModalOpen] = useState(false);
console.log(sendAsset, receiveAsset)

  const balance = 1500;
  const exchangeRate = "$1 = ₦2000";
  const platformFee = 5;
  const total = Number(sendAmount || 0) + platformFee;

  const handleContinue = () => {
    if (!sendAmount.trim() || isNaN(Number(sendAmount))) {
      setError("Please enter a valid amount.");
      return;
    }

    if (Number(sendAmount) > balance) {
      setError("Not enough in this wallet");
      return;
    }

    setError("");
     setWalletModalOpen(true);
    // onNext(sendAmount);
  };
   const handleWalletSelect = () => {
    setWalletModalOpen(false);
    onNext(sendAmount); 
  };

  return (
    <>
       <div className="hidden md:block">
              <Header />
            </div>
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="flex items-center md:justify-center gap-6 mb-8">
                      <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
                        <ArrowLeft2 size="20" color="black" className="" />
                      </div>
          
                      <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">
                        Enter amount
                      </h2>
                    </div>

          {/* Outer container */}
          <div className="bg-[#F5F5F5] rounded-[20px] shadow-sm pb-5 pt-2 px-2 space-y-2">
            {/* Amount to send */}
            <div className="bg-white rounded-[20px] border border-neutral-200 px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">
                  Amount to send
                </label>
                <Select
                  value={sendAsset}
                  onChange={setSendAsset}
                  options={assets.map((a) => ({
                    value: a.id,
                    label: a.name,
                    icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
                  }))}
                  className="w-[150px]"
                />
              </div>

              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-900"
              />

              {error && (
                <p className="text-xs text-danger mt-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Amount they'll receive */}
            <div className="bg-white rounded-2xl border border-transparent px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">
                  Amount they’ll receive
                </label>
                <Select
                  value={receiveAsset}
                  onChange={setReceiveAsset}
                  options={assets.map((a) => ({
                    value: a.id,
                    label: a.name,
                    icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
                  }))}
                  className="w-[150px]"
                />
              </div>

              <input
                type="number"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                placeholder="2000"
                className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-400"
              />
            </div>

            {/* Summary section */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
              <div className="flex justify-between">
                <span><Convert size="16" color="#0088FF" className="inline"/> Exchange rate</span>
                <span className="text-primary">{exchangeRate}</span>
              </div>
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline"/> Platform fee</span>
                <span className="text-primary">
                  {platformFee} {receiveAsset.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span><Money size="16" color="#0088FF" className="inline"/> Total amount</span>
                <span className="text-primary">
                  {total || 0} {receiveAsset.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info & Continue button */}
          <div className="mt-6 text-center">
            <p className="text-xs text-green-700 bg-green-50 border border-green-300 border-dashed inline-block px-3 py-1 rounded-full">
              Usually takes less than 2 minutes
            </p>

            <div className="flex justify-center mt-5">
              <Button
                onClick={handleContinue}
                className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2"
              >
                Continue 
              </Button>
            </div>
          </div>
        </div>
      </div>
       {/* Wallet selection modal */}
      <WalletSelectionModal
        open={isWalletModalOpen}
        onOpenChange={setWalletModalOpen}
        onSelect={handleWalletSelect}
      />
    </>
  );
};

export default EnterAmount;
