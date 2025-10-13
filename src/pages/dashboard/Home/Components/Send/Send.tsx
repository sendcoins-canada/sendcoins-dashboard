// src/components/send/SendFlow.tsx
import React, { useState } from "react";
import SendOptionsModal from "./SendModal";
import SelectCryptoAsset from "./SelectCryptoAsset";
import RecipientDetails from "./RecipientDetails";
import ConfirmSend from "./ConfirmSend";
import { useNavigate } from "react-router-dom";
import EnterAmount from "./EnterAmount";
import EnterPasscode from "./EnterPasscode";
import SuccessPage from "@/pages/dashboard/SuccessPage";

/**
 * Place this component on route /send or render it in a page.
 * It supports starting from the modal (isSendModalOpen) or from a direct route.
 */
const SendFlow: React.FC = () => {
  const navigate = useNavigate();

  // flow state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false); // if triggered from Home
  const [step, setStep] = useState<"options" | "select-asset" | "recipient" | "amount" | "confirm" | "passcode" | "success">(
    "select-asset"
  );

  // data collected through the flow
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [recipient, setRecipient] = useState({ name: "", address: "" });
  const [amount, setAmount] = useState<string>("");

  const openFromHome = () => {
    setIsSendModalOpen(true);
    setStep("options");
  };

  // called when SendOptionsModal option is chosen
  const handleSelectOption = (option: "crypto" | "fiat") => {
    setIsSendModalOpen(false);
    if (option === "crypto") {
      setStep("select-asset");
      // If you want to route instead: navigate("/send/select-asset")
    } else {
      // handle fiat flow or navigate to fiat route
      navigate("/send/fiat");
    }
  };

  // continue handlers
  const handleAssetContinue = (asset: string) => {
    setSelectedAsset(asset);
    setStep("recipient");
  };

  const handleRecipientNext = (data: { name: string; address: string; amount: string }) => {
    setRecipient({ name: data.name, address: data.address });
    // setAmount(data.amount);
    setStep("amount");
  };

  const handleAmountNext = (amountValue: string) => {
    setAmount(amountValue);
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Do API call to create/send transaction
    console.log("Sending", { selectedAsset, recipient, amount });
      setStep("passcode");
  };


  const handlePasscodeSuccess = () => {
    // After successful passcode entry, show success page
     setStep("success");
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
      {/* If you want to trigger modal from some button externally, call openFromHome */}
      {/* Example: <button onClick={openFromHome}>Open send modal</button> */}

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
          onNext={(data) => handleRecipientNext(data)}
        />
      )}

      {step === "amount" && selectedAsset && (
  <EnterAmount
    asset={selectedAsset}
    onBack={() => setStep("recipient")}
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

      {step === "passcode" && (
        <EnterPasscode onSuccess={handlePasscodeSuccess}  />
      )}
    </>
  );
};

export default SendFlow;
