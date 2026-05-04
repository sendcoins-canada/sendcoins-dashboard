import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { convertCryptoToFiat, executeBuyCrypto, getBuyCryptoQuote, getConvertQuote } from "@/api/convert";
import type { ConversionResponse } from "@/api/convert";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { Select } from "@/components/ui/select";
import { Convert, Money, Money2, FlashCircle, ArrowLeft2, ArrowSwapVertical } from "iconsax-react";
import SuccessPage from "@/pages/dashboard/SuccessPage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { showDanger } from "@/components/ui/toast";
import type { WalletBalance } from "@/types/wallet";
import NGN from '@/assets/nigerianflag.svg'
import { formatCryptoAmount, formatFiatAmount } from "@/utils/formatAmount";
// import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";

type ConvertDirection = "CRYPTO_TO_FIAT" | "FIAT_TO_CRYPTO";

type FiatAccount = {
  currency: string;
  availableBalance: number | string;
  bankName?: string;
  logo?: string;
};

const ConvertFlow: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);
  const { allBalances, loading } = useSelector((state: RootState) => state.wallet);
  // Step management
  const [step, setStep] = useState<"amount" | "details" | "success">("amount");

  const [direction, setDirection] = useState<ConvertDirection>("CRYPTO_TO_FIAT");



  // --- Transaction State ---
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  // We store the Symbols (e.g., "BTC", "NGN")
  const [selectedSourceSymbol, setSelectedSourceSymbol] = useState<string>("");
  const [selectedDestSymbol, setSelectedDestSymbol] = useState<string>("");

  // --- Quote State ---
  const [timeLeft, setTimeLeft] = useState(30);
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


  const user = useSelector((state: RootState) => state.user.user);
  const userFullName =
    `${user?.data?.first_name ?? ""} ${user?.data?.last_name ?? ""}`.trim() || "You";

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
    return accounts as FiatAccount[];
  }, [allBalances]);

  const cryptoOptions = wallets.map((wallet: any) => ({
    value: wallet.symbol,
    label: wallet.symbol.toUpperCase(),
    icon: <img src={wallet.logo} alt={wallet.symbol} className="w-4 h-4 object-contain rounded-full" />,
  }));

  const fiatOptions = fiatWallets.map((wallet: any) => ({
    value: wallet.currency,
    label: wallet.currency.toUpperCase(),
    icon: <img src={wallet.logo || NGN} alt={wallet.currency} className="w-4 h-4 object-contain rounded-full" />,
  }));

  const sourceOptions = direction === "CRYPTO_TO_FIAT" ? cryptoOptions : fiatOptions;
  const destOptions = direction === "CRYPTO_TO_FIAT" ? fiatOptions : cryptoOptions;

  const toggleDirection = () => {
    setDirection((prev) => (prev === "CRYPTO_TO_FIAT" ? "FIAT_TO_CRYPTO" : "CRYPTO_TO_FIAT"));
    setSendAmount("");
    setReceiveAmount("");
    setQuoteDetails({ exchangeRate: "0", platformFee: "0", destinationAmount: "0", finalAmount: "0" });
    setTimeLeft(30);
    setError("");
  };

  // Set defaults on mount / direction change if available
  useEffect(() => {
    if (direction === "CRYPTO_TO_FIAT") {
      if (wallets.length > 0 && (!selectedSourceSymbol || !wallets.some(w => w.symbol === selectedSourceSymbol))) {
        setSelectedSourceSymbol(wallets[0].symbol);
      }
      if (fiatWallets.length > 0 && (!selectedDestSymbol || !fiatWallets.some((w: any) => w.currency === selectedDestSymbol))) {
        setSelectedDestSymbol((fiatWallets[0] as any).currency || (fiatWallets[0] as any).symbol);
      }
    } else {
      if (fiatWallets.length > 0 && (!selectedSourceSymbol || !fiatWallets.some((w: any) => w.currency === selectedSourceSymbol))) {
        setSelectedSourceSymbol((fiatWallets[0] as any).currency || (fiatWallets[0] as any).symbol);
      }
      if (wallets.length > 0 && (!selectedDestSymbol || !wallets.some(w => w.symbol === selectedDestSymbol))) {
        setSelectedDestSymbol(wallets[0].symbol);
      }
    }
  }, [direction, wallets, fiatWallets, selectedSourceSymbol, selectedDestSymbol]);

  // --- Helpers to get full objects ---
  const selectedSourceCryptoWallet = wallets.find(w => w.symbol === selectedSourceSymbol);
  const selectedDestCryptoWallet = wallets.find(w => w.symbol === selectedDestSymbol);
  const selectedSourceFiatWallet = fiatWallets.find((w: any) => w.currency === selectedSourceSymbol);
  const selectedDestFiatWallet = fiatWallets.find((w: any) => w.currency === selectedDestSymbol);

  const selectedSourceWallet = direction === "CRYPTO_TO_FIAT" ? selectedSourceCryptoWallet : selectedSourceFiatWallet;
  const selectedDestWallet = direction === "CRYPTO_TO_FIAT" ? selectedDestFiatWallet : selectedDestCryptoWallet;

  // Safely derive display fields for source wallet depending on whether it's crypto or fiat
  const selectedSourceName = direction === "CRYPTO_TO_FIAT"
    ? (selectedSourceCryptoWallet as WalletBalance | undefined)?.name
    : (selectedSourceFiatWallet as FiatAccount | undefined)?.bankName || (selectedSourceFiatWallet as FiatAccount | undefined)?.currency;

  const selectedSourceNetwork = direction === "CRYPTO_TO_FIAT"
    ? (selectedSourceCryptoWallet as WalletBalance | undefined)?.network
    : undefined;

  const recipient = React.useMemo(() => {
    if (direction === "CRYPTO_TO_FIAT") {
      const bankName = (selectedDestFiatWallet as any)?.bankName;
      const accountNumber = (selectedDestFiatWallet as any)?.accountNumber;
      return {
        name: userFullName,
        address: bankName && accountNumber ? `${bankName} | ${accountNumber}` : (selectedDestSymbol || "Fiat account"),
      };
    }

    // FIAT_TO_CRYPTO
    const network = (selectedDestCryptoWallet as any)?.network || (selectedDestCryptoWallet as any)?.name;
    const addr = (selectedDestCryptoWallet as any)?.walletAddress;
    return {
      name: userFullName,
      address: addr ? String(addr) : (network ? String(network) : (selectedDestSymbol || "Crypto wallet")),
    };
  }, [
    direction,
    selectedDestFiatWallet,
    selectedDestCryptoWallet,
    selectedDestSymbol,
    userFullName,
  ]);
  // useEffect(() => {
  //   // Reset if input is empty
  //   if (!sendAmount || isNaN(Number(sendAmount)) || Number(sendAmount) === 0) {
  //     setReceiveAmount("");
  //     setQuoteDetails({ exchangeRate: "0", platformFee: "0", destinationAmount: "0", finalAmount: "0" });
  //     return;
  //   }

  //   if (!selectedSourceWallet || !selectedDestWallet) return;

  //   // Debounce timer to prevent API spam while typing
  //   const timer = setTimeout(async () => {
  //     setIsFetchingQuote(true);
  //     setError("");
  //     if (!token) {
  //       showDanger("Please login again");
  //       setIsFetchingQuote(false);
  //       return;
  //     }

  //     try {
  //       const network = selectedSourceWallet.network || selectedSourceWallet.name
  //       // Call the quote endpoint
  //       const quoteData = await getConvertQuote({
  //         token,
  //         sourceAsset: selectedSourceWallet.symbol,
  //         sourceNetwork: network, // Use fallback if network missing
  //         sourceAmount: sendAmount,
  //         destinationCurrency: selectedDestWallet.currency
  //       });

  //       // Assuming response.data contains these fields based on your previous 'success' response structure
  //       // Adjust these keys (e.g. quoteData.data.destinationAmount) based on your actual API response shape
  //       if (quoteData && quoteData.data) {
  //         const { destinationAmount, exchangeRate, platformFeeAmount, finalAmount } = quoteData.data;

  //         setReceiveAmount(destinationAmount);
  //         setQuoteDetails({
  //           exchangeRate: exchangeRate,
  //           platformFee: platformFeeAmount,
  //           destinationAmount: destinationAmount,
  //           finalAmount: finalAmount
  //         });
  //       }

  //     } catch (err) {
  //       console.error("Failed to get quote", err);
  //       // Optional: don't block the UI with an error alert while typing, just log it
  //       // or set a subtle inline error
  //     } finally {
  //       setIsFetchingQuote(false);
  //     }
  //   }, 500); // 500ms delay

  //   return () => clearTimeout(timer);
  // }, [sendAmount, selectedSourceSymbol, selectedDestSymbol, selectedSourceWallet, selectedDestWallet, token]);
  // 3. Store the successful conversion response

  // --- Helper for Quote Fetching ---
  const fetchQuote = async (amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) === 0) return;
    if (!selectedSourceWallet || !selectedDestWallet || !token) return;

    setIsFetchingQuote(true);
    try {
      if (direction === "CRYPTO_TO_FIAT") {
        const source = selectedSourceCryptoWallet;
        const dest = selectedDestFiatWallet;
        if (!source || !dest) return;

        const network = (source as any).network || (source as any).name;
        const quoteData = await getConvertQuote({
          token,
          sourceAsset: (source as any).symbol,
          sourceNetwork: network,
          sourceAmount: amount,
          destinationCurrency: (dest as any).currency
        });

        if (quoteData && quoteData.data) {
          const { destinationAmount, exchangeRate, platformFeeAmount, finalAmount } = quoteData.data;
          setReceiveAmount(String(destinationAmount));
          setQuoteDetails({
            exchangeRate: String(exchangeRate),
            platformFee: String(platformFeeAmount),
            destinationAmount: String(destinationAmount),
            finalAmount: String(finalAmount)
          });
          setTimeLeft(30);
        }
      } else {
        const source = selectedSourceFiatWallet;
        const dest = selectedDestCryptoWallet;
        if (!source || !dest) return;

        const destinationNetwork = (dest as any).network || (dest as any).name || "";
        const quoteData = await getBuyCryptoQuote({
          token,
          sourceCurrency: (source as any).currency,
          sourceAmount: amount,
          destinationAsset: (dest as any).symbol,
          destinationNetwork
        });

        if (quoteData && quoteData.data) {
          const destinationAmount = quoteData.data.destinationAmount;
          const exchangeRate = quoteData.data.exchangeRate;
          const platformFeeAmount = quoteData.data.feeFiat;
          setReceiveAmount(String(destinationAmount));
          setQuoteDetails({
            exchangeRate: String(exchangeRate),
            platformFee: String(platformFeeAmount),
            destinationAmount: String(destinationAmount),
            finalAmount: String(destinationAmount)
          });
          setTimeLeft(30);
        }
      }
    } catch (err) {
      console.error("Failed to refresh quote", err);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  // --- 1. Debounced Quote Effect (User Typing) ---
  useEffect(() => {
    if (!sendAmount) {
      setReceiveAmount("");
      setQuoteDetails({ exchangeRate: "0", platformFee: "0", destinationAmount: "0", finalAmount: "0" });
      return;
    }

    const timer = setTimeout(() => {
      fetchQuote(sendAmount);
    }, 500);

    return () => clearTimeout(timer);
  }, [sendAmount, selectedSourceSymbol, selectedDestSymbol]);

  // --- 2. 30-Second Auto-Refresh Effect ---
  useEffect(() => {
    if (step !== "amount" || !sendAmount || Number(sendAmount) <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchQuote(sendAmount); // Trigger refresh at 0
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, sendAmount, selectedSourceSymbol, selectedDestSymbol]);
  const [_successData, setSuccessData] = useState<ConversionResponse['data'] | null>(null);

  const handleContinue = () => {
    if (!sendAmount.trim() || isNaN(Number(sendAmount))) {
      setError("Please enter a valid amount.");
      return;
    }
    // --- 4. Validation against Redux Balance ---
    if (direction === "CRYPTO_TO_FIAT") {
      const availableBalance = Number((selectedSourceCryptoWallet as any)?.totalAvailableBalance || 0);
      if (Number(sendAmount) > availableBalance) {
        setError("Not enough in this wallet");
        return;
      }
    } else {
      const availableBalance = Number((selectedSourceFiatWallet as any)?.availableBalance || 0);
      if (Number(sendAmount) > availableBalance) {
        setError("Not enough in this account");
        return;
      }
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
      if (direction === "CRYPTO_TO_FIAT") {
        const source = selectedSourceCryptoWallet;
        const dest = selectedDestFiatWallet;
        if (!source || !dest) {
          setError("Invalid asset selection");
          return;
        }

        const network = (source as any).network || (source as any).name;
        const response = await convertCryptoToFiat({
          token,
          sourceAsset: (source as any).symbol,
          sourceNetwork: network,
          sourceAmount: sendAmount,
          destinationCurrency: (dest as any).currency
        });

        if (response.success && response.data) {
          setSuccessData(response.data);
          setStep("success");
        } else {
          setError("Conversion failed. No data returned.");
        }
      } else {
        const source = selectedSourceFiatWallet;
        const dest = selectedDestCryptoWallet;
        if (!source || !dest) {
          setError("Invalid asset selection");
          return;
        }

        const destinationNetwork = (dest as any).network || (dest as any).name || "";
        const response = await executeBuyCrypto({
          token,
          sourceCurrency: (source as any).currency,
          sourceAmount: sendAmount,
          destinationAsset: (dest as any).symbol,
          destinationNetwork
        });

        if (response?.isSuccess && response.data) {
          setStep("success");
        } else {
          setError(response?.message || "Conversion failed. Please try again.");
        }
      }
    } catch (err: any) {
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
              {direction === "CRYPTO_TO_FIAT"
                ? `${formatCryptoAmount(sendAmount, selectedSourceSymbol || "", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} → ${formatFiatAmount(
                    receiveAmount || 0,
                    { currencyCode: selectedDestSymbol || "NGN", currencySign: selectedDestSymbol || "NGN" }
                  )}`
                : `${formatFiatAmount(sendAmount || 0, { currencyCode: selectedSourceSymbol || "NGN", currencySign: selectedSourceSymbol || "NGN" })} → ${formatCryptoAmount(
                    receiveAmount || 0,
                    selectedDestSymbol || "",
                    { minimumFractionDigits: 2, maximumFractionDigits: 8 }
                  )}`}
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
                    {selectedSourceName} {selectedSourceNetwork ? `| ${selectedSourceNetwork}` : ""}
                  </p>
                </div>
                <div className="px-4 py-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Network</p>
                  <div className="flex items-center gap-2">
                    {selectedSourceWallet && <img src={(selectedSourceWallet as any).logo} alt="Network" className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-800">
                      {selectedSourceNetwork ?? (direction === "FIAT_TO_CRYPTO" ? (selectedSourceWallet as any).network : "")}
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
                  <span className="text-primary">
                    {direction === "CRYPTO_TO_FIAT"
                      ? formatFiatAmount(quoteDetails.finalAmount, { currencyCode: selectedDestSymbol || "NGN", currencySign: selectedDestSymbol || "NGN" })
                      : formatCryptoAmount(quoteDetails.finalAmount, selectedDestSymbol || "", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span><Money2 size="16" color="#777777" className="inline" /> Platform fee</span>
                  <span className="text-primary">
                    {direction === "CRYPTO_TO_FIAT"
                      ? formatFiatAmount(quoteDetails.platformFee, { currencyCode: selectedDestSymbol || "NGN", currencySign: selectedDestSymbol || "NGN" })
                      : formatFiatAmount(quoteDetails.platformFee, { currencyCode: selectedSourceSymbol || "NGN", currencySign: selectedSourceSymbol || "NGN" })}
                  </span>
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
                    options={sourceOptions}
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
              {/* WALLET BALANCE DISPLAY */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                <div className="flex flex-col">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Available Balance</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {direction === "CRYPTO_TO_FIAT" ? (
                      <>
                        {(selectedSourceCryptoWallet as any)?.totalAvailableBalance} {selectedSourceSymbol.toUpperCase()}
                        <span className="text-gray-400 font-normal ml-2">
                          ≈ {(selectedSourceCryptoWallet as any)?.TotalAvailableBalancePrice || "0.00"}
                        </span>
                      </>
                    ) : (
                      <>
                        {(selectedSourceFiatWallet as any)?.availableBalance} {selectedSourceSymbol.toUpperCase()}
                      </>
                    )}
                  </p>
                </div>
                {/* Max Button Helper */}
                <button
                  onClick={() => {
                    if (direction === "CRYPTO_TO_FIAT") {
                      setSendAmount(String((selectedSourceCryptoWallet as any)?.totalAvailableBalance || ""));
                    } else {
                      setSendAmount(String((selectedSourceFiatWallet as any)?.availableBalance || ""));
                    }
                  }}
                  className="text-[10px] bg-primaryblue/10 text-primaryblue px-2 py-1 rounded font-bold hover:bg-primaryblue/20 transition-colors"
                >
                  MAX
                </button>
              </div>

              {error && <p className="text-xs text-danger mt-1 font-medium">{error}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleDirection}
                aria-label="Swap conversion direction"
                className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:bg-[#F7F9FF] transition-colors"
              >
                <ArrowSwapVertical size="18" color="black" variant="Outline" />
              </button>
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
                    options={destOptions}
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
                <div className="flex items-center justify-between mt-1">
                  {isFetchingQuote ? (
                    <span className="text-[10px] text-primaryblue font-bold animate-pulse">
                      UPDATING RATE...
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div
                        className={`
  w-1.5 h-1.5 rounded-full animate-pulse
  ${timeLeft < 10 ? "bg-orange-500" : "bg-green-500"}
`}
                      />
                      <span className="text-[10px] font-medium text-gray-500">
                        Rate refreshes in <span className="font-bold text-gray-700">{timeLeft}s</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
              <div className="flex justify-between">
                <span><Convert size="16" color="#0088FF" className="inline" /> Exchange rate</span>
                <span className="text-primary">
                  {Number(quoteDetails.exchangeRate || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline" /> Platform fee</span>
                <span className="text-primary">
                  {direction === "CRYPTO_TO_FIAT"
                    ? formatFiatAmount(quoteDetails.platformFee, { currencyCode: selectedDestSymbol || "NGN", currencySign: selectedDestSymbol || "NGN" })
                    : formatFiatAmount(quoteDetails.platformFee, { currencyCode: selectedSourceSymbol || "NGN", currencySign: selectedSourceSymbol || "NGN" })}
                </span>
              </div>
              <div className="flex justify-between">
                <span><Money size="16" color="#0088FF" className="inline" /> Total amount</span>
                <span className="text-primary">
                  {direction === "CRYPTO_TO_FIAT"
                    ? formatFiatAmount(quoteDetails.finalAmount, { currencyCode: selectedDestSymbol || "NGN", currencySign: selectedDestSymbol || "NGN" })
                    : formatCryptoAmount(quoteDetails.finalAmount, selectedDestSymbol || "", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#34C759] bg-[#EFFBF2] w-fit mx-auto px-3 py-2 rounded-full flex gap-1">
              <FlashCircle size="16" color="#34C759" variant="Bold" /> Usually takes less than 2 minutes
            </p>
            <div className="flex justify-center mt-5">
              <Button onClick={handleContinue} className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2" disabled={isFetchingQuote}>Continue</Button>
            </div>
          </div>
        </div>
      </div>
      {/* <WalletSelectionModal open={isWalletModalOpen} onOpenChange={setWalletModalOpen} onSelect={handleWalletSelect} /> */}
    </>
  );
};

export default ConvertFlow;