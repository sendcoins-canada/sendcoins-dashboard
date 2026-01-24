
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { Money, Money2, ArrowLeft2 } from "iconsax-react";
import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";
import { useGasFee } from "@/store/hooks/useGasFee";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface EnterAmountProps {
  asset: string;
  onBack: () => void;
  onNext: (amount: string) => void;
  recipient: {
    name: string;
    address?: string;
    network?: string;
  };
}


const EnterAmount: React.FC<EnterAmountProps> = ({ asset, onNext, recipient }) => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState("");
  const [sendAsset, _setSendAsset] = useState(asset);
  const [error, setError] = useState("");
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);



// 1. Get Wallet Balance from Redux
  const { allBalances } = useSelector((state: RootState) => state.wallet);
  
  // Find the specific wallet balance for the selected asset (e.g., 'BTC')
  const currentWallet = useMemo(() => {
    if (!allBalances?.data?.balances) return null;
    const key = asset.toLowerCase();
    return allBalances.data.balances[key];
  }, [allBalances, asset]);

  const walletAvailableBalance = currentWallet?.totalAvailableBalance || 0;
  
// fetch gas fee
const { 
    gasFee,      
    loading: isGasLoading, 
    error: gasError 
  } = useGasFee({
    amount: sendAmount,
    asset: 'crypto',
    symbol: asset.toLowerCase()
  });


 // 3. Calculation Logic

  // Determine amounts based on wallet balance
  const calculation = useMemo(() => {
    const amountNum = Number(sendAmount);
    // Use the gasFee from the hook, default to 0 if not loaded yet
    const currentGasFee = Number(gasFee) || 0;
    if (!amountNum || amountNum <= 0) {
      return { recipientGets: 0, totalDeducted: 0, status: 'idle' };
    }

    const totalNeeded = amountNum + currentGasFee;

    // Case 1: Insufficient funds for amount itself
    if (amountNum > walletAvailableBalance) {
      return { recipientGets: amountNum, totalDeducted: totalNeeded, status: 'insufficient' };
    }

    // Case 2: Enough for Amount but NOT Amount + Gas (User is sending Max)
    // We must deduct gas from the amount they entered so the total doesn't exceed balance.
    if (totalNeeded > walletAvailableBalance) {
       // Recipient gets: Entered Amount - Gas Fee
       // We safeguard against negative numbers if gas > amount
       const adjustedReceive = Math.max(0, amountNum - currentGasFee);
       return { 
         recipientGets: adjustedReceive, 
         totalDeducted: amountNum, // The entered amount acts as the total cap
         status: 'adjusted' // Inform UI we deducted fees
       };
    }

    // Case 3: Enough for Amount + Gas (Standard)
    return { 
      recipientGets: amountNum, 
      totalDeducted: totalNeeded, 
      status: 'sufficient' 
    };

  }, [sendAmount, gasFee, walletAvailableBalance]);

const handleContinue = () => {
    if (!sendAmount.trim() || isNaN(Number(sendAmount))) {
      setError("Please enter a valid amount.");
      return;
    }

    // if (calculation.status === 'insufficient') {
    //   setError(`Insufficient ${asset.toUpperCase()} balance.`);
    //   return;
    // }

    if (calculation.recipientGets <= 0) {
      setError("Amount is too low to cover gas fees.");
      return;
    }

    setError("");
    // Pass the actual amount the recipient will receive (sendAmount OR adjusted amount)
    onNext(calculation.recipientGets.toString()); 
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
                       <div className="absolute left-4 md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
                              <ArrowLeft2 size="16" color="black" /><p className="text-sm ml-1">Back</p>
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
                <p className="bg-[#F5F5F5] px-6 py-1 rounded-full text-primary">{sendAsset}</p>

                {/* <Select
                  value={sendAsset}
                  onChange={setSendAsset}
                  // options={assets.map((a) => ({
                  //   value: a.id,
                  //   label: a.name,
                  //   icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
                  // }))}
                  
                  className="w-[150px]"
                  disabled={true}                 
                /> */}
              </div>

              <input
                type="number"
                value={sendAmount}
                onChange={(e) => {
                    setSendAmount(e.target.value);
                    setError("");
                }}                
                placeholder="0.00"
                className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-900"
              />

             {/* Warnings / Errors */}
              {error && (
                <p className="text-sm text-danger mt-1 font-medium">{error}</p>
              )}
               {calculation.status === 'adjusted' && !error && (
                <p className="text-sm text-orange-500 mt-1 font-medium">
                  Note: Gas fees were deducted from the total amount.
                </p>
              )}
            </div>

            {/* Amount they'll receive */}
            <div className="bg-white rounded-2xl border border-transparent px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">
                  Amount they’ll receive
                </label>
                <p className="bg-[#F5F5F5] px-6 py-1 rounded-full text-primary">{recipient.network || asset.toUpperCase()}</p>
                {/* <Select
                  value={receiveAsset}
                  onChange={setReceiveAsset}
                  // options={assets.map((a) => ({
                  //   value: a.id,
                  //   label: a.name,
                  //   icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
                  // }))}
                  className="w-[150px]"
                  disabled={true}
                /> */}
              </div>

              <input
                type="number"
                value={calculation.recipientGets > 0 ? calculation.recipientGets.toFixed(6) : "0.00"}
                // onChange={(e) => setReceiveAmount(e.target.value)}
                placeholder="2000"
                className="w-full bg-transparent outline-none text-[40px] font-semibold "
              />
            </div>

            {/* Summary section */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
             
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline"/> Gas fee</span>
                <span className="text-primary">
                  <span className="text-primary">
                  {isGasLoading 
                    ? "Calculating..." 
                    : `${Number(gasFee || 0).toFixed(6)} ${asset.toUpperCase()}`
                  }
                </span>
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span><Money size="16" color="#0088FF" className="inline"/> Total amount</span>
               <span className="text-primary">
                  {/* Shows what leaves your wallet (Input amount + Gas OR Input amount if adjusted) */}
                  {calculation.totalDeducted > 0 ? calculation.totalDeducted.toFixed(6) : "0.00"} {asset.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info & Continue button */}
          <div className="mt-6 text-center">
            {gasError && (
                 <p className="text-xs text-red-500 mb-2">Error calculating fees</p>
            )}
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
