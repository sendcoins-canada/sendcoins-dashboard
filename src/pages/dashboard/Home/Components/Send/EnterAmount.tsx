
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { Select } from "@/components/ui/select";
import { assets } from "./SelectCryptoAsset";
import { useNavigate } from "react-router-dom";
import { Convert, Money, Money2 } from "iconsax-react";

interface EnterAmountProps {
  asset: string;
  onBack: () => void;
  onNext: (amount: string) => void;
}

const EnterAmount: React.FC<EnterAmountProps> = ({ asset, onBack, onNext }) => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [sendAsset, setSendAsset] = useState("cad");
  const [receiveAsset, setReceiveAsset] = useState("usdc");
  const [error, setError] = useState("");

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
    onNext(sendAmount);
  };

  return (
    <>
      <HeaderWithCancel onCancel={() => navigate(-1)} />

      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
        <div className="w-full max-w-md">
          <h2 className="text-center text-[28px] font-semibold text-neutral-900 mb-6">
            Enter amount
          </h2>

          {/* Outer container */}
          <div className="bg-[#F9FAFB] rounded-2xl shadow-sm p-5 space-y-4">
            {/* Amount to send */}
            <div className="bg-white rounded-2xl border border-neutral-200 px-4 py-3">
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
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Amount they'll receive */}
            <div className="bg-[#F5F5F5] rounded-2xl border border-transparent px-4 py-3">
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
            <div className="pt-2 space-y-2 text-sm text-neutral-700">
              <div className="flex justify-between">
                <span><Convert size="16" color="#0088FF" className="inline"/> Exchange rate</span>
                <span>{exchangeRate}</span>
              </div>
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline"/> Platform fee</span>
                <span>
                  {platformFee} {receiveAsset.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span><Money size="16" color="#0088FF" className="inline"/> Total amount</span>
                <span>
                  {total || 0} {receiveAsset.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info & Continue button */}
          <div className="mt-6 text-center">
            <p className="text-xs text-green-700 bg-green-50 border border-green-300 inline-block px-3 py-1 rounded-full">
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
    </>
  );
};

export default EnterAmount;
