
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { Money, Money2, ArrowLeft2 } from "iconsax-react";
import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";
import { useGasFee } from "@/store/hooks/useGasFee";
import { useBalances } from "@/query/hooks/useBalances";


interface EnterAmountProps {
  asset: string;
  onBack: () => void;
  onNext: (amount: string, fee: string) => void;
  isFiat?: boolean;
  recipient: {
    name: string;
    address?: string;
    network?: string;
  };
}


const EnterAmount: React.FC<EnterAmountProps> = ({ asset, onBack, onNext, isFiat, recipient }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [sendAsset, _setSendAsset] = useState(asset);
  const [error, setError] = useState("");
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

// Server data via React Query
const { data: balancesData } = useBalances();

const walletAvailableBalance = useMemo(() => {
  if (!balancesData?.data) return 0;

  if (isFiat) {
    return parseFloat(balancesData.data.totalFiatBalance) || 0;
  } else {
    const key = asset.toLowerCase();
    const currentWallet = balancesData.data.balances?.[key];
    return currentWallet?.totalAvailableBalance || 0;
  }
}, [balancesData, asset, isFiat]);
// fetch gas fee (crypto only — fiat uses platform fee calculated locally)
const {
    gasFee: cryptoGasFee,
    loading: isCryptoGasLoading,
    error: cryptoGasError
  } = useGasFee(isFiat ? undefined : {
    amount: sendAmount,
    asset: 'crypto',
    symbol: asset.toLowerCase()
  });

// Fiat platform fee: 1.2% (matches backend payout handler)
const PLATFORM_FEE_PERCENTAGE = 1.2;
const fiatPlatformFee = useMemo(() => {
  const amountNum = Number(sendAmount);
  if (!amountNum || amountNum <= 0) return 0;
  return parseFloat(((amountNum * PLATFORM_FEE_PERCENTAGE) / 100).toFixed(2));
}, [sendAmount]);

const gasFee = isFiat ? fiatPlatformFee : cryptoGasFee;
const isGasLoading = isFiat ? false : isCryptoGasLoading;
const gasError = isFiat ? null : cryptoGasError;


 // 3. Calculation Logic

  // Determine amounts based on wallet balance
  const calculation = useMemo(() => {
    const amountNum = Number(sendAmount);
    // Use the fee (platform fee for fiat, gas fee for crypto)
    const currentFee = Number(gasFee) || 0;
    if (!amountNum || amountNum <= 0) {
      return { recipientGets: 0, totalDeducted: 0, status: 'idle' };
    }
    const recipientGets = Math.max(amountNum - currentFee);
    const totalNeeded = amountNum;

    // Case 1: Insufficient funds for amount itself
    if (amountNum > walletAvailableBalance) {
      return { recipientGets, totalDeducted: totalNeeded, status: 'insufficient' };
    }
    // Case 2: Enough for Amount but NOT Amount + Gas (User is sending Max)
    // We must deduct gas from the amount they entered so the total doesn't exceed balance.
    if (totalNeeded > walletAvailableBalance) {
       // Recipient gets: Entered Amount - Gas Fee
       // We safeguard against negative numbers if gas > amount
       return { 
         recipientGets, 
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

    const isBtc = asset.toLowerCase() === 'btc' || asset.toLowerCase() === 'bitcoin';
    const minCryptoSend = isBtc ? 0.00001 : 5; // BTC: very low frontend min, real $10 USD min enforced by backend gasFee
    if (!isFiat && Number(sendAmount) < minCryptoSend) {
      setError(isBtc ? `Minimum send amount is $10 worth of BTC.` : `Minimum send amount is ${minCryptoSend} ${asset.toUpperCase()}.`);
      return;
    }

    if (calculation.status === 'insufficient') {
      setError(`Insufficient ${asset.toUpperCase()} balance.`);
      return;
    }

    if (calculation.recipientGets <= 0) {
      setError("Amount is too low to cover gas fees.");
      return;
    }

    setError("");
    // Pass the actual amount the recipient will receive (sendAmount OR adjusted amount)
    onNext(calculation.recipientGets.toString(), gasFee.toString()); 
  };

   const handleWalletSelect = () => {
    setWalletModalOpen(false);
    onNext(sendAmount, gasFee.toString()); 
  };

  return (
    <>
       <div className="hidden md:block">
              <Header />
            </div>
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="flex items-center md:justify-center gap-6 mb-8">
                      <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={onBack}>
                        <ArrowLeft2 size="20" color="black" className="" />
                      </div>
                       <div className="absolute left-4 md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={onBack}>
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
<span className={`text-xs font-bold ${calculation.status === 'insufficient' ? 'text-red-500' : 'text-neutral-500'}`}>
   Available balance: {walletAvailableBalance.toLocaleString(undefined, { minimumFractionDigits: isFiat ? 2: 6 })} {asset.toUpperCase()}
  </span>
             
               {calculation.status === 'adjusted' && !error && (
                <p className="text-sm text-orange-500 mt-1 font-medium">
                  Note: Gas fees were deducted from the total amount.
                </p>
              )}
              {/* Error Message */}
{calculation.status === 'insufficient' && (
  <p className="text-xs text-red-500 mt-2 font-bold animate-shake">
    ⚠️ Insufficient funds. You only have {walletAvailableBalance} {asset.toUpperCase()} available.
  </p>
)}
              {!isFiat && (
                <p className="text-xs text-neutral-400 mt-1">
                  Min: {(asset.toLowerCase() === 'btc' || asset.toLowerCase() === 'bitcoin') ? '$10 worth of' : '5'} {asset.toUpperCase()} · Max: {(asset.toLowerCase() === 'btc' || asset.toLowerCase() === 'bitcoin') ? '1' : '10,000'} {asset.toUpperCase()} (verified) / {(asset.toLowerCase() === 'btc' || asset.toLowerCase() === 'bitcoin') ? '0.5' : '5,000'} (unverified)
                </p>
              )}
            </div>

            {/* Amount they'll receive */}
            <div className="bg-white rounded-2xl border border-transparent px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">
                  Amount they’ll receive
                </label>
                <p className="bg-[#F5F5F5] px-6 py-1 rounded-full text-primary">{isFiat ? asset.toUpperCase() : (recipient.network || asset.toUpperCase())}</p>
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
                value={calculation.recipientGets > 0 ? calculation.recipientGets.toFixed(isFiat ? 2 : 6) : "0.00"}
                // onChange={(e) => setReceiveAmount(e.target.value)}
                placeholder="2000"
                className="w-full bg-transparent outline-none text-[40px] font-semibold "
              />
            </div>

            {/* Summary section */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
             
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline"/> {isFiat ? "Platform fee" : "Gas fee"}</span>
                <span className="text-primary">
                  <span className="text-primary">
                  {isGasLoading 
                    ? "Calculating..." 
                    : `${Number(gasFee || 0).toFixed(isFiat ? 2 : 6)} ${asset.toUpperCase()}`
                  }
                </span>
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span><Money size="16" color="#0088FF" className="inline"/> Total amount</span>
               <span className="text-primary">
                  {/* Shows what leaves your wallet (Input amount + Gas OR Input amount if adjusted) */}
                  {calculation.totalDeducted > 0 ? calculation.totalDeducted.toFixed(isFiat ? 2 : 6) : "0.00"} {asset.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info & Continue button */}
          <div className="mt-6 text-center">
            {gasError && (
                 <p className="text-xs text-red-500 mb-2">{typeof gasError === 'string' ? gasError : 'Error calculating fees'}</p>
            )}
            <p className="text-xs text-green-700 bg-green-50 border border-green-300 border-dashed inline-block px-3 py-1 rounded-full">
              Usually takes less than 2 minutes
            </p>

            <div className="flex justify-center mt-5">
              <Button
                onClick={handleContinue}
                className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2"
                disabled={
      isGasLoading ||
      !sendAmount ||
      (!isFiat && Number(sendAmount) < ((asset.toLowerCase() === 'btc' || asset.toLowerCase() === 'bitcoin') ? 0.00001 : 5)) ||
      calculation.status === 'insufficient' ||
      calculation.recipientGets <= 0
    }
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
