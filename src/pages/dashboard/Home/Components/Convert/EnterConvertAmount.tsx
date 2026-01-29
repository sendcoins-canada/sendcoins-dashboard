// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Header from "@/components/onboarding/shared/Header";
// import { Select } from "@/components/ui/select";
// // import { assets } from "../Send/SelectCryptoAsset";
// import { useNavigate } from "react-router-dom";
// import { Convert, Money, Money2, FlashCircle, ArrowLeft2 } from "iconsax-react";
// import SuccessPage from "@/pages/dashboard/SuccessPage";
// import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";
// import Btc from "@/assets/Btc.svg";
// import Eth from "@/assets/Eth.svg";
// import Usdc from "@/assets/Usdc.svg";
// import Matic from "@/assets/matic.svg";


// type Asset = {
//   id: string;
//   name: string;
//   icon: string;
//   balance?: string;
// };

// export const assets: Asset[] = [

//   { id: "bnb", name: "BNB", icon: Btc },

//   { id: "eth", name: "Ethereum", icon: Eth },

//   { id: "polygon", name: "Polygon", icon: Matic },

//   { id: "usdc", name: "USDC", icon: Usdc },

//   { id: "eth2", name: "Ethereum", icon: Eth },

//   { id: "polygon2", name: "Polygon", icon: Matic },

//   { id: "usdc2", name: "USDC", icon: Usdc },

// ];

// const ConvertFlow: React.FC = () => {
//   const navigate = useNavigate();

//   // Step management
//   const [step, setStep] = useState<"amount" | "details" | "success">("amount");

//   // State for amount entry
//   const [sendAmount, setSendAmount] = useState("");
//   const [receiveAmount, setReceiveAmount] = useState("");
//   const [sendAsset, setSendAsset] = useState("cad");
//   const [receiveAsset, setReceiveAsset] = useState("usdc");
//   const [error, setError] = useState("");
//       const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  

//   const balance = 1500;
//   const exchangeRate = "$1 = ₦2000";
//   const platformFee = 5;
//   const total = Number(sendAmount || 0) + platformFee;

//    const recipient = {
//     name: "John Doe",
//     address: "0x89f8...a1C3",
//   };
//   // const estimatedArrival = "Less than 2 minutes";

//   const handleContinue = () => {
//     if (!sendAmount.trim() || isNaN(Number(sendAmount))) {
//       setError("Please enter a valid amount.");
//       return;
//     }

//     if (Number(sendAmount) > balance) {
//       setError("Not enough in this wallet");
//       return;
//     }

//     setError("");
//     setWalletModalOpen(true);

//   };

//   const handleConfirm = () => {
//     // Here we can later trigger the actual conversion API
//     setStep("success");
//   };
//    const handleWalletSelect = () => {
//     setWalletModalOpen(false);
//     setStep("details");
//   };

//   if (step === "success") {
//     return (
//       <SuccessPage
//         title="Conversion successful!"
//         subtitle={`You’ve exchanged ${sendAmount} ${sendAsset.toUpperCase()} to ${receiveAsset.toUpperCase()}.`}
//         primaryButtonText="Done"
//         showSecondaryButton={false}
//         onPrimaryClick={() => {
//           navigate('/dashboard/home')
//         }}
//         backgroundColor="#35FD82"
//         iconColor="#0647F7"
//       />
//     );
//   }

//   if (step === "details") {
//     return (
//       <>
//  <div className="hidden md:block">
//               <Header />
//             </div>
//                    <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
//                  <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm">Back</p>
//                     </div>
//         <div className="flex flex-col items-center min-h-[75vh] px-4">
//           <div className="w-full max-w-md text-center mt-10">
//              <div className="flex items-center md:justify-center gap-6 mb-8">
//                                <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
//                                  <ArrowLeft2 size="20" color="black" className="" />
//                                </div>
                   
//                                <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">
//                                  Transaction details
//                                </h2>
//                              </div>
//             <Convert size="64" color="#0647F7" variant="Bold" className="text-center mx-auto mb-4"/>

//            <p className="text-[28px] font-semibold mb-4">50 USDC → 49.85 USDT</p>
//            <p className="text-[#0647F7]">(50 USD)</p>
//             <div className="p-2 rounded-2xl bg-[#F5F5F5]">

            
//                 <div className="w-full bg-white rounded-2xl">
//               <div className="p-4 flex flex-col gap-2">
//                 <div className="flex justify-between">
//                   <p className="text-sm text-gray-500">From</p>
//                   <p className="text-sm font-medium text-gray-900">
//                     Your Wallet
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-400 text-right">ETH | 0x89f8...a1C3</p>
//               </div>

//               <div className="px-4 py-2 flex justify-between items-center">
//                 <p className="text-sm text-gray-500">Network</p>
//                 <div className="flex items-center gap-2">
//                   <img
//                     src="/ethereum-icon.svg"
//                     alt="Ethereum"
//                     className="w-4 h-4"
//                   />
//                   <span className="text-sm font-medium text-gray-800">
//                     Ethereum
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl mt-2">
//               <div className="p-4 flex flex-col">
//                 <div className="flex justify-between">
//                   <p className="text-sm text-gray-500">To</p>
//                   <p className="text-sm font-medium text-primary">
//                     Your wallet
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-400 text-right">{recipient.address}</p>
//               </div>

//             </div>
//              <div className="pt-2 space-y-2 text-sm text-neutral bg-white rounded-2xl mt-2 p-2">
//                           <div className="flex justify-between">
//                             <span><Convert size="16" color="#777777" className="inline"/>Amount received</span>
//                             <span className="text-primary">{platformFee}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span><Money2 size="16" color="#777777" className="inline"/> Platform fee</span>
//                             <span className="text-primary">
//                               {platformFee} {receiveAsset.toUpperCase()}
//                             </span>
//                           </div>
                          
//                         </div>
//             </div>


//             <div className="mt-8 flex flex-col gap-3 w-fit mx-auto">
//               <Button
//                 onClick={handleConfirm}
//                 className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2"
//               >
//                 Convert
//               </Button>
             
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // STEP 1: ENTER AMOUNT
//   return (
//     <>
//  <div className="hidden md:block">
//               <Header />
//             </div>
//                    <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
//                  <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
//                     </div>
                     

//       <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">

//         <div className="w-full max-w-md mt-10">
//          <div className="flex items-center md:justify-center gap-6 mb-8">
//                                <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
//                                  <ArrowLeft2 size="20" color="black" className="" />
//                                </div>
                   
//                                <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">
//                                  Enter amount
//                                </h2>
//                              </div>

//           {/* Outer container */}
//           <div className="bg-[#F5F5F5] rounded-2xl shadow-sm pb-5 pt-2 px-2 space-y-2">
//             {/* Amount to send */}
//             <div className="bg-white rounded-2xl border border-neutral-200 px-4 py-3">
//               <div className="flex justify-between items-center mb-2">
//                 <label className="text-sm text-neutral-500">
//                   From
//                 </label>
//                 <Select
//                   value={sendAsset}
//                   onChange={setSendAsset}
//                   options={assets.map((a) => ({
//                     value: a.id,
//                     label: a.name,
//                     icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
//                   }))}
//                   className="w-[150px]"
//                 />
//               </div>

//               <input
//                 type="number"
//                 value={sendAmount}
//                 onChange={(e) => setSendAmount(e.target.value)}
//                 placeholder="0.00"
//                 className="w-full bg-transparent outline-none text-[40px] font-semibold"
//               />

//               {error && (
//                 <p className="text-xs text-danger mt-1 font-medium">
//                   {error}
//                 </p>
//               )}
//             </div>

//             {/* Amount they'll receive */}
//             <div className="bg-white rounded-2xl border border-transparent px-4 py-3">
//               <div className="flex justify-between items-center mb-2">
//                 <label className="text-sm text-neutral-500">
//                   To
//                 </label>
//                 <Select
//                   value={receiveAsset}
//                   onChange={setReceiveAsset}
//                   options={assets.map((a) => ({
//                     value: a.id,
//                     label: a.name,
//                     icon: <img src={a.icon} alt={a.name} className="w-4 h-4" />,
//                   }))}
//                   className="w-[150px]"
//                 />
//               </div>

//               <input
//                 type="number"
//                 value={receiveAmount}
//                 onChange={(e) => setReceiveAmount(e.target.value)}
//                 placeholder="2000"
//                 className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-400"
//               />
//             </div>

//             {/* Summary section */}
//             <div className="pt-2 space-y-2 text-sm text-neutral">
//               <div className="flex justify-between">
//                 <span>
//                   <Convert size="16" color="#0088FF" className="inline" /> Exchange rate
//                 </span>
//                 <span className="text-primary">{exchangeRate}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>
//                   <Money2 size="16" color="#0088FF" className="inline" /> Platform fee
//                 </span>
//                 <span className="text-primary">
//                   {platformFee} {receiveAsset.toUpperCase()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>
//                   <Money size="16" color="#0088FF" className="inline" /> Total amount
//                 </span>
//                 <span className="text-primary">
//                   {total || 0} {receiveAsset.toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Info & Continue button */}
//           <div className="mt-6 text-center">
//             <p className="text-xs text-[#34C759] bg-[#EFFBF2] w-fit mx-auto px-3 py-2 rounded-full flex gap-1">
//               <FlashCircle size="16" color="#34C759" variant="Bold"/>
//               Usually takes less than 2 minutes
//             </p>

//             <div className="flex justify-center mt-5">
//               <Button
//                 onClick={handleContinue}
//                 className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2"
//               >
//                 Continue
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <WalletSelectionModal
//         open={isWalletModalOpen}
//         onOpenChange={setWalletModalOpen}
//         onSelect={handleWalletSelect}
//       />
//     </>
//   );
// };

// export default ConvertFlow;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import the updated service functions and types
import { 
  getCoins, 
  getCurrency, 
} from "@/api/wallet";
import type { Coin, Currency } from "@/types/wallet"; 
import { convertCryptoToFiat } from "@/api/convert";
import type { ConversionResponse } from "@/api/convert";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { Select } from "@/components/ui/select";
import { Convert, Money, Money2, FlashCircle, ArrowLeft2 } from "iconsax-react";
import SuccessPage from "@/pages/dashboard/SuccessPage";
// import WalletSelectionModal from "@/pages/dashboard/WalletSelectionModal";

const ConvertFlow: React.FC = () => {
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState<"amount" | "details" | "success">("amount");

  // --- API Data State ---
  const [coins, setCoins] = useState<Coin[]>([]);
  const [currencies, setCurrencies] =useState<Currency[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- Transaction State ---
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>(""); 
  const [selectedCurrencyName, setSelectedCurrencyName] = useState<string>("");

  // const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  // Mock constants for fees/rates
  const balance = 1500;
  const exchangeRate = "1 Crypto = 2000 Fiat"; // You might fetch this dynamically later
  const platformFee = 5;
  
  // Calculate total (Logic might need adjustment based on if fee is deducted or added)
  const total = Number(sendAmount || 0); 

  const recipient = {
    name: "John Doe",
    address: "0x89f8...a1C3",
  };

  // --- 1. Fetch Coins and Currencies on Mount ---
  // --- Fetch Data ---
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        setIsLoadingData(true);
        const [coinsData, currencyData] = await Promise.all([
          getCoins(),
          getCurrency()
        ]);

        // 1. Transform Coins Object to Array
        // The API returns { coins: { "USDC": {...}, ... } }
        const coinsArray = coinsData.coins ? Object.values(coinsData.coins) : [];
        
        // 2. Extract Currency Array
        // The API returns { data: [...] }
        const currencyArray = currencyData.data || [];

        setCoins(coinsArray);
        setCurrencies(currencyArray);

        // Set defaults
        if (coinsArray.length > 0) setSelectedCoinSymbol(coinsArray[0].symbol);
        if (currencyArray.length > 0) setSelectedCurrencyName(currencyArray[0].currency_name);

      } catch (err) {
        console.error("Failed to load assets", err);
        setError("Failed to load supported assets");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitData();
  }, []);
  // Helper to get full objects based on ID
 // --- Derived State ---
  const selectedCoinObj = coins.find(c => c.symbol === selectedCoinSymbol);
  const selectedCurrencyObj = currencies.find(c => c.currency_name === selectedCurrencyName);
console.log(selectedCoinObj, selectedCurrencyObj)
  // 3. Store the successful conversion response
  const [_successData, setSuccessData] = useState<ConversionResponse['data'] | null>(null);

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
        setStep("details");

    // setWalletModalOpen(true);
  };

  // const handleWalletSelect = () => {
  //   setWalletModalOpen(false);
  //   setStep("details");
  // };

  // --- 2. Execute Conversion ---
  const handleConfirm = async () => {
    if (!selectedCoinObj || !selectedCurrencyObj) {
      setError("Invalid asset selection");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const authToken = localStorage.getItem("token") || "";
      const network = selectedCoinObj.network || selectedCoinObj.name; // fallback if missing

      const response = await convertCryptoToFiat({
        token: authToken,
        sourceAsset: selectedCoinObj.symbol,   // e.g., 'eth'
        sourceNetwork: network,            // e.g., 'ethereum' (from API)
        sourceAmount: sendAmount,
        destinationCurrency: selectedCurrencyObj.currency_name // e.g., 'ngn'
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
        subtitle={`You’ve exchanged ${sendAmount} ${selectedCoinObj?.symbol.toUpperCase()} to ${selectedCurrencyObj?.currency_name.toUpperCase()}.`}
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
              {sendAmount} {selectedCoinObj?.symbol} → {receiveAmount || "..."} {selectedCurrencyObj?.currency_sign}
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
                    {selectedCoinObj?.name} | {selectedCoinObj?.network}
                  </p>
                </div>
                <div className="px-4 py-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Network</p>
                  <div className="flex items-center gap-2">
                    {selectedCoinObj && <img src={selectedCoinObj.logo} alt="Network" className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-800">
                      {selectedCoinObj?.network}
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
                  <span className="text-primary">{sendAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span><Money2 size="16" color="#777777" className="inline" /> Platform fee</span>
                  <span className="text-primary">{platformFee} {selectedCurrencyObj?.currency_name}</span>
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
                {isLoadingData ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  <Select
                    value={selectedCoinSymbol}
                    onChange={setSelectedCoinSymbol}
                    options={coins.map((coin) => ({
                      value: coin.symbol,
                      label: coin.name_display, // or coin.symbol
                      icon: <img src={coin.logo} alt={coin.name} className="w-4 h-4 object-contain" />,
                    }))}
                    className="w-[150px]"
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
                {isLoadingData ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  <Select
                    value={selectedCurrencyName}
                    onChange={setSelectedCurrencyName}
                    options={currencies.map((curr) => ({
                      value: curr.currency_name,
                      label: curr.currency_init, // or curr.symbol
                      icon: <img src={curr.image} alt={curr.currency_name} className="w-4 h-4 object-contain" />,
                    }))}
                    className="w-[150px]"
                  />
                )}
              </div>
              <input 
                type="number" 
                value={receiveAmount} 
                onChange={(e) => setReceiveAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full bg-transparent outline-none text-[40px] font-semibold text-neutral-400" 
              />
            </div>

            {/* Summary */}
            <div className="pt-2 space-y-2 text-sm text-neutral">
              <div className="flex justify-between">
                <span><Convert size="16" color="#0088FF" className="inline" /> Exchange rate</span>
                <span className="text-primary">{exchangeRate}</span>
              </div>
              <div className="flex justify-between">
                <span><Money2 size="16" color="#0088FF" className="inline" /> Platform fee</span>
                <span className="text-primary">{platformFee} {selectedCurrencyObj?.currency_name || "Fiat"}</span>
              </div>
              <div className="flex justify-between">
                <span><Money size="16" color="#0088FF" className="inline" /> Total amount</span>
                <span className="text-primary">{total || 0} {selectedCurrencyObj?.currency_name || "Fiat"}</span>
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