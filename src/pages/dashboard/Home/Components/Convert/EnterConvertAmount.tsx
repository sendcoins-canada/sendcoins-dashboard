import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { convertCryptoToFiat, getConvertQuote } from "@/api/convert";
import type { ConversionResponse } from "@/api/convert";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { Select } from "@/components/ui/select";
import { Convert, Money, Money2, FlashCircle, ArrowLeft2 } from "iconsax-react";
import SuccessPage from "@/pages/dashboard/SuccessPage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { showDanger } from "@/components/ui/toast";
import type { WalletBalance } from "@/types/wallet";
import NGN from '@/assets/nigerianflag.svg'
// import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";

const ConvertFlow: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);
const { allBalances, loading } = useSelector((state: RootState) => state.wallet);
  // Step management
  const [step, setStep] = useState<"amount" | "details" | "success">("amount");



  // --- Transaction State ---
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  
  // We store the Symbols (e.g., "BTC", "NGN")
  const [selectedSourceSymbol, setSelectedSourceSymbol] = useState<string>(""); 
  const [selectedDestSymbol, setSelectedDestSymbol] = useState<string>("");

  // --- Quote State ---
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState({
    exchangeRate: "0",
    platformFee: "0",
    destinationAmount: "0",
    finalAmount: "0"
  });

  // const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");


  const recipient = {
    name: "John Doe",
    address: "0x89f8...a1C3",
  };

// --- 2. Derive Wallets from Redux ---
  // Safely convert the balances object into an array
  const wallets = React.useMemo(() => {
    const balancesObj = allBalances?.data?.balances as Record<string, WalletBalance> | undefined;
    if (!balancesObj) return [];

return Object.values(balancesObj).filter((w: any) => w.isWalletAvailable === true);  
}, [allBalances]);

  const fiatWallets = React.useMemo(() => {
    // Access the fiatAccounts array from your console log structure
    const accounts = allBalances?.data?.fiatAccounts;
    if (!accounts || !Array.isArray(accounts)) return [];
    return accounts;
  }, [allBalances]);

  // Set defaults on mount if available
  useEffect(() => {
    if (wallets.length > 0 && !selectedSourceSymbol) {
      // Default Source: First wallet found
      setSelectedSourceSymbol(wallets[0].symbol);
    }
    // Default Dest: First Fiat Account
    if (fiatWallets.length > 0 && !selectedDestSymbol) {
       // Assuming fiat account has 'currency' or 'symbol' property
      setSelectedDestSymbol(fiatWallets[0].currency || fiatWallets[0].symbol);
    }
  }, [wallets, selectedSourceSymbol, selectedDestSymbol]);

  // --- Helpers to get full objects ---
  const selectedSourceWallet = wallets.find(w => w.symbol === selectedSourceSymbol);
const selectedDestWallet = fiatWallets.find(w => w.currency === selectedDestSymbol);// --- 2. Live Quote Calculation (Debounced) ---

  useEffect(() => {
    // Reset if input is empty
    if (!sendAmount || isNaN(Number(sendAmount)) || Number(sendAmount) === 0) {
      setReceiveAmount("");
      setQuoteDetails({ exchangeRate: "0", platformFee: "0", destinationAmount: "0", finalAmount:"0" });
      return;
    }

    if (!selectedSourceWallet || !selectedDestWallet) return;

    // Debounce timer to prevent API spam while typing
    const timer = setTimeout(async () => {
      setIsFetchingQuote(true);
      setError("");
      if (!token) {
  showDanger("Please login again");
  setIsFetchingQuote(false);
  return;
}

      try {
       const network = selectedSourceWallet.network || selectedSourceWallet.name 
        // Call the quote endpoint
        const quoteData = await getConvertQuote({
          token ,
          sourceAsset: selectedSourceWallet.symbol,
          sourceNetwork: network, // Use fallback if network missing
          sourceAmount: sendAmount,
          destinationCurrency: selectedDestWallet.currency
        });

        // Assuming response.data contains these fields based on your previous 'success' response structure
        // Adjust these keys (e.g. quoteData.data.destinationAmount) based on your actual API response shape
        if (quoteData && quoteData.data) {
           const { destinationAmount, exchangeRate, platformFeeAmount, finalAmount } = quoteData.data;
           
           setReceiveAmount(destinationAmount);
           setQuoteDetails({
             exchangeRate: exchangeRate,
             platformFee: platformFeeAmount,
             destinationAmount: destinationAmount,
             finalAmount: finalAmount
           });
        }

      } catch (err) {
        console.error("Failed to get quote", err);
        // Optional: don't block the UI with an error alert while typing, just log it
        // or set a subtle inline error
      } finally {
        setIsFetchingQuote(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [sendAmount, selectedSourceSymbol, selectedDestSymbol, selectedSourceWallet, selectedDestWallet, token]);
  // 3. Store the successful conversion response
  const [_successData, setSuccessData] = useState<ConversionResponse['data'] | null>(null);

  const handleContinue = () => {
    if (!sendAmount.trim() || isNaN(Number(sendAmount))) {
      setError("Please enter a valid amount.");
      return;
    }
    // --- 4. Validation against Redux Balance ---
    const availableBalance = Number(selectedSourceWallet?.totalAvailableBalance || 0);

    if (Number(sendAmount) > availableBalance) {
      setError("Not enough in this wallet");
      return;
    }
    setError("");
        setStep("details");

    // setWalletModalOpen(true);
  };

  // const handleWalletSelect = () => {
  //   setWalletModalOpen(false);
  //   setStep("details");
  // };

  // --- 2. Execute Conversion ---
  const handleConfirm = async () => {
    if (!selectedSourceWallet || !selectedDestWallet) {
      setError("Invalid asset selection");
      return;
    }

    setIsConverting(true);
    setError("");

    if (!token) {
  showDanger("Please login again");
  return;
}

    try {
      // const authToken = localStorage.getItem("token") || "";
      const network = selectedSourceWallet.network || selectedSourceWallet.name; // fallback if missing

      const response = await convertCryptoToFiat({
        token,
        sourceAsset: selectedSourceWallet.symbol,   // e.g., 'eth'
        sourceNetwork: network,            // e.g., 'ethereum' (from API)
        sourceAmount: sendAmount,
        destinationCurrency: selectedDestWallet.symbol // e.g., 'ngn'
      });

if (response.success && response.data) {
        // 6. Save the actual backend response data
        setSuccessData(response.data);
        setStep("success");
      } else {
        setError("Conversion failed. No data returned.");
      }    } catch (err: any) {
      console.error("Conversion failed:", err);
      setError(err.response?.data?.message || "Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  if (step === "success") {
    return (
      <SuccessPage
        title="Conversion successful!"
        subtitle={`You’ve exchanged ${sendAmount} ${selectedSourceSymbol?.toUpperCase()} to ${selectedDestSymbol?.toUpperCase()}.`}
        primaryButtonText="Done"
        showSecondaryButton={false}
        onPrimaryClick={() => navigate("/dashboard/home")}
        backgroundColor="#35FD82"
        iconColor="#0647F7"
      />
    );
  }

  // --- Step 2: Details View ---
  if (step === "details") {
    return (
      <>
        <div className="hidden md:block"><Header /></div>
        <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
          <ArrowLeft2 size="16" color="black" /><p className="text-sm">Back</p>
        </div>
        <div className="flex flex-col items-center min-h-[75vh] px-4">
          <div className="w-full max-w-md text-center mt-10">
            <div className="flex items-center md:justify-center gap-6 mb-8">
              <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => setStep('amount')}>
                <ArrowLeft2 size="20" color="black" />
              </div>
              <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">Transaction details</h2>
            </div>
            
            <Convert size="64" color="#0647F7" variant="Bold" className="text-center mx-auto mb-4" />
            <p className="text-[28px] font-semibold mb-4">
              {sendAmount} {selectedSourceSymbol} → {receiveAmount || "..."} {selectedDestSymbol}
            </p>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}

            <div className="p-2 rounded-2xl bg-[#F5F5F5]">
              <div className="w-full bg-white rounded-2xl">
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-sm font-medium text-gray-900">Your Wallet</p>
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {selectedSourceWallet?.name} | {selectedSourceWallet?.network}
                  </p>
                </div>
                <div className="px-4 py-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Network</p>
                  <div className="flex items-center gap-2">
                    {selectedSourceWallet && <img src={selectedSourceWallet.logo} alt="Network" className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-800">
                      {selectedSourceWallet?.network}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl mt-2">
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="text-sm font-medium text-primary">{recipient.name}</p>
                  </div>
                  <p className="text-xs text-gray-400 text-right">{recipient.address}</p>
                </div>
              </div>

              <div className="pt-2 space-y-2 text-sm text-neutral bg-white rounded-2xl mt-2 p-2">
                <div className="flex justify-between">
                  <span><Convert size="16" color="#777777" className="inline" />Amount received</span>
                  <span className="text-primary">{quoteDetails.finalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span><Money2 size="16" color="#777777" className="inline" /> Platform fee</span>
                  <span className="text-primary">{quoteDetails.platformFee} {selectedDestSymbol}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 w-fit mx-auto">
              <Button onClick={handleConfirm} disabled={isConverting} className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2 disabled:opacity-50">
                {isConverting ? "Processing..." : "Convert"}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Step 1: Enter Amount View ---
  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
        <ArrowLeft2 size="16" color="black" /><p className="text-sm font-semibold">Back</p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
        <div className="w-full max-w-md mt-10">
          <div className="flex items-center md:justify-center gap-6 mb-8">
            <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
              <ArrowLeft2 size="20" color="black" />
            </div>
            <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">Enter amount</h2>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl shadow-sm pb-5 pt-2 px-2 space-y-2">
            
            {/* FROM: Select Coin */}
            <div className="bg-white rounded-2xl border border-neutral-200 px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">From</label>
                {loading ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  <Select
                    value={selectedSourceSymbol}
                    onChange={setSelectedSourceSymbol}
                    options={wallets.map((wallet: any) => ({
                      value: wallet.symbol,
                      label: wallet.symbol.toUpperCase(),
                      // Use logo from wallet object
                      icon: <img src={wallet.logo} alt={wallet.symbol} className="w-4 h-4 object-contain rounded-full" />,
                    }))}
                    className="w-[150px]"
                    disabled={loading}
                  />
                )}
              </div>
              <input 
                type="number" 
                value={sendAmount} 
                onChange={(e) => setSendAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full bg-transparent outline-none text-[40px] font-semibold" 
              />
              {error && <p className="text-xs text-danger mt-1 font-medium">{error}</p>}
            </div>

            {/* TO: Select Currency */}
            <div className="bg-white rounded-2xl border border-transparent px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-neutral-500">To</label>
                {loading ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  <Select
                    value={selectedDestSymbol}
                    onChange={setSelectedDestSymbol}
                    options={fiatWallets.map((wallet: any) => ({
                      value: wallet.currency,
                      label: wallet.currency.toUpperCase(),
                      // Use logo from wallet object
                      icon: <img src={wallet.logo || NGN } alt={wallet.symbol} className="w-4 h-4 object-contain rounded-full" />,
                    }))}
                    className="w-[150px]"
                    disabled={loading}
                  />
                )}
              </div>
              <div className="flex flex-col">
              <input 
                type="number" 
                value={receiveAmount} 
                onChange={(e) => setReceiveAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-400" 
              />
              {isFetchingQuote && (
                   <span className="text-xs text-primaryblue px-2">
                     Calculating...
                   </span>
                )}
                </div>
            </div>

            {/* Summary */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
              <div className="flex justify-between">
                <span><Convert size="16" color="#0088FF" className="inline" /> Exchange rate</span>
                <span className="text-primary">{quoteDetails.exchangeRate}</span>
              </div>
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline" /> Platform fee</span>
                <span className="text-primary">{quoteDetails.platformFee} {selectedDestSymbol || "Fiat"}</span>
              </div>
              <div className="flex justify-between">
                <span><Money size="16" color="#0088FF" className="inline" /> Total amount</span>
                <span className="text-primary">{quoteDetails.finalAmount} {selectedDestSymbol || "Fiat"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#34C759] bg-[#EFFBF2] w-fit mx-auto px-3 py-2 rounded-full flex gap-1">
              <FlashCircle size="16" color="#34C759" variant="Bold" /> Usually takes less than 2 minutes
            </p>
            <div className="flex justify-center mt-5">
              <Button onClick={handleContinue} className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2">Continue</Button>
            </div>
          </div>
        </div>
      </div>
      {/* <WalletSelectionModal open={isWalletModalOpen} onOpenChange={setWalletModalOpen} onSelect={handleWalletSelect} /> */}
    </>
  );
};

export default ConvertFlow;