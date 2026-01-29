// src/components/send/SendFlow.tsx
import React, { useState, useEffect } from "react";
import SendOptionsModal from "./SendModal";
import SelectCryptoAsset from "./SelectCryptoAsset";
import RecipientDetails from "./RecipientDetails";
import ConfirmSend from "./ConfirmSend";
import { useNavigate, useLocation } from "react-router-dom";
import EnterAmount from "./EnterAmount";
import EnterPasscode from "./EnterPasscode";
import SuccessPage from "@/pages/dashboard/SuccessPage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import FiatRecipientSelect from "./FiatRecipientSelection";
import FiatCountrySelection from "./FiatCountrySelect";
import EnterBankDetails from "./FiatBankDetails";
import { sendFiat } from "@/api/sendfiat";
import { sendCrypto } from "@/api/authApi";
import { showSuccess, showDanger } from "@/components/ui/toast";

/**
 * Place this component on route /send or render it in a page.
 * It supports starting from the modal (isSendModalOpen) or from a direct route.
 */
const SendFlow: React.FC = () => {
  const navigate = useNavigate();
   const location = useLocation();

 const isFiatRoute = location.pathname.includes('send-fiat');
 const userSlice = useSelector((state: RootState) => state.user) as any;
// 3. Safely drill down to the actual user data
  // Structure: state.user -> user -> data -> isPinAvailable -> found
  const userData = userSlice?.user?.data;
  // 4. Check if PIN exists
  const hasPin = userData?.isPinAvailable?.found ?? false;

 // flow state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false); // if triggered from Home
  const [step, setStep] = useState<"options" | "select-asset" | "recipient" | "amount" | "confirm"| "fiat-country" 
  | "fiat"
    | "fiat-bank-details"
    | "confirm-fiat" | "passcode" | "success">(isFiatRoute ? "fiat" : "select-asset");


  // data collected through the flow
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
   const [notes, _setNotes] = useState<string>(""); 
  const [recipient, setRecipient] = useState({name: "", network: "", address: "", keychain: "", transitNumber: "" });
  const [amount, setAmount] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null); 
   const token = useSelector((state: RootState) => state.auth.token?.azer_token);

   useEffect(() => {
    if (isFiatRoute && (step === "select-asset" || step === "options")) {
      setStep("fiat");
    } else if (!isFiatRoute && step === "fiat") {
      setStep("select-asset");
    }
  }, [isFiatRoute]);

  // called when SendOptionsModal option is chosen
  const handleSelectOption = (option: "crypto" | "fiat") => {
    setIsSendModalOpen(false);
    if (option === "crypto") {
      setStep("select-asset");
      navigate("/dashboard/send-crypto");
      // If you want to route instead: navigate("/send/select-asset")
    } else {
      // handle fiat flow or navigate to fiat route
      setStep("fiat")
      navigate("/dashboard/send-fiat");
    }
  };

  // continue handlers
  const handleAssetContinue = (asset: string) => {
    setSelectedAsset(asset);
    setStep("recipient");
  };

  const handleRecipientNext = (data: { network: string; address: string; keychain: string }) => {
    setRecipient({ name: "", network: data.network, address: data.address, keychain: data.keychain, transitNumber: ""  });
    // setAmount(data.amount);
    setStep("amount");
  };

  const handleConfirm = () => {
    // Do API call to create/send transaction
      setStep("passcode");
  };

  
  // --- FIAT FLOW HANDLERS ---
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedAsset(countryCode);
    setStep("fiat-bank-details"); 
    // The country code acts as the currency/asset code (e.g., CAD, NGN)
  };

  const handleFiatRecipientSelect = (data: {
    keychain: string;
    name: string;
    network: string; // Bank Name
    address: string; // Account Number
  }) => {
setRecipient({
      ...data,
      transitNumber: "" 
    });    setSelectedAsset(selectedCountry || "CAD");
    setStep("amount");
  };

  const handleNewRecipientStart = () => {
    setStep("fiat-country");
  };

  const handleBankDetailsSubmit = (data: {
    name: string;
    bankName: string;
    accountNumber: string;
    transitNumber: string; // Not used in state but passed to API later
    country: string;
  }) => {
    // Generate a temporary keychain for a new, unsaved recipient
    const newRecipientKeychain = `new-fiat-${Date.now()}`;
    setRecipient({
      keychain: newRecipientKeychain,
      name: data.name,
      network: data.bankName,
      address: data.accountNumber, 
       transitNumber: data.transitNumber
    });
    setSelectedAsset(data.country);
    setStep("amount");
  };

  // --- COMMON HANDLERS ---

  // const handleAmountNext = (amount: string) => {
  //   setAmount(amount);
  //   // Determine which confirm step to go to
  //   if (selectedCountry) {
  //     setStep("confirm-fiat");
  //   } else {
  //     setStep("confirm"); // Crypto flow confirm
  //   }
  // };

  // const handleFiatConfirm = () => {
  //   setStep("passcode");
  // };


const handlePasscodeSuccess = async (capturedPasscode: string) => {
    if (!token) return;

    // Note: 'capturedPasscode' is already verified by the backend in EnterPasscode component
    // We now just need to execute the transaction.

    try {
      if (isFiatRoute) {
        // --- 1. FIAT FLOW ---
        const result = await sendFiat({
          token,
          passcode: capturedPasscode,
          destinationCountry: selectedCountry || "",
          currency: selectedAsset || "",
          amount: amount,
          fullName: recipient.name,
          bankName: recipient.network,
          accountNumber: recipient.address,
          transitNumber: recipient.transitNumber, 
          notes: notes, 
        });

        if (result.data.isSuccess) {
           setStep("success");
        }
      } else {
        // --- 2. CRYPTO FLOW ---
        // Payload: token, asset, network, walletAddress, amount
        const result = await sendCrypto({
          token,
          asset: selectedAsset || "", 
          network: recipient.network, 
          walletAddress: recipient.address,
          amount: amount
        });

        // The endpoint returns { data: { isSuccess: true, ... } } based on your JSON
        if (result.isSuccess || result.data?.isSuccess) {
           showSuccess(result.message || "Crypto sent successfully");
           setStep("success");
        } else {
           throw new Error(result.message || "Transfer failed");
        }
      }

    } catch (error: any) {
      console.error("Transfer error:", error);
      showDanger(error.response?.data?.message || error.message || "Transaction failed");
      // Throw error to EnterPasscode to stop it from proceeding/closing if needed
      throw error; 
    }
  };




    //  Final Success Page
  if (step === "success") {
    return (
      <SuccessPage
        title="Money Sent!"
        subtitle="Dwight will receive 50 USD shortly via ethereum. Your transfer is on its way"
        primaryButtonText="Send Again"
        secondaryButtonText="Go Home"
        onPrimaryClick={() => navigate("/dashboard/home")}
        onSecondaryClick={() => navigate("/dashboard/home")}
        backgroundColor="#35FD82"
        iconColor="#0647F7"
      />
    );
  }


  return (
    <>
     
      {/* 1) Send Options Modal */}
      <SendOptionsModal
        open={isSendModalOpen}
        onOpenChange={setIsSendModalOpen}
        onSelectOption={handleSelectOption}
      />

      {/* 2) In-app flow pages (single-page stepper) */}
      {step === "select-asset" && (
        <SelectCryptoAsset onContinue={(asset) => handleAssetContinue(asset)} />
      )}

      {step === "recipient" && selectedAsset && (
        <RecipientDetails
          asset={selectedAsset}
          onBack={() => setStep("select-asset")}
onNext={(data: { network: string; address: string; keychain: string }) => 
      handleRecipientNext(data)
    }        />
      )}

      {step === "amount" && selectedAsset && (
  <EnterAmount
    asset={selectedAsset}
    onBack={() => setStep("recipient")}
    recipient={recipient}
    onNext={(amount) => {
      setAmount(amount);
      setStep("confirm");
    }}
  />
)}


      {step === "confirm" && selectedAsset && (
        <ConfirmSend
          asset={selectedAsset}
          recipient={recipient}
          amount={amount}
          onBack={() => setStep("recipient")}
          onConfirm={handleConfirm}
        />
      )}

       {/* --------------------------- FIAT FLOW STEPS --------------------------- */}
 {step === "fiat" && (
          <FiatRecipientSelect
            country={selectedCountry || ""}
            onBack={() => setStep("options")}
            onSelectRecipient={handleFiatRecipientSelect}
            onAddNew={handleNewRecipientStart}
          />
        )}

        {step === "fiat-country" && (
          <FiatCountrySelection
            onBack={() => setStep("fiat")}
            onCountrySelect={handleCountrySelect}
          />
        )}

       

        {step === "fiat-bank-details" && selectedCountry && (
          <EnterBankDetails
            country={selectedCountry}
            onBack={() => setStep("fiat-country")}
            onSubmit={handleBankDetailsSubmit}
          />
        )}

      {/* {step === "passcode" && (
        <EnterPasscode onSuccess={handlePasscodeSuccess}  />
      )} */}
      {step === "passcode" && (
        <EnterPasscode 
          // If hasPin is true, we go to 'verify' mode. Else 'create' mode.
          mode={hasPin ? "verify" : "create"}
          onSuccess={handlePasscodeSuccess} 
        />
      )}
    </>
  );
};

export default SendFlow;
