import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowCircleLeft2 } from "iconsax-react";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import SuccessPage from "../../SuccessPage";

// ✅ Currency Options
import Btc from "@/assets/Btc.svg";
import Eth from "@/assets/Eth.svg";
import Usdc from "@/assets/Usdc.svg";
import Matic from "@/assets/matic.svg";

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();

  const [currency, setCurrency] = useState("");
  const [network, setNetwork] = useState("");
   const [isSuccess, setIsSuccess] = useState(false);

  const currencyOptions = [
    { value: "btc", label: "Bitcoin (BTC)", icon: <img src={Btc} alt="btc" className="w-5 h-5" /> },
    { value: "eth", label: "Ethereum (ETH)", icon: <img src={Eth} alt="eth" className="w-5 h-5" /> },
    { value: "usdc", label: "USDC", icon: <img src={Usdc} alt="usdc" className="w-5 h-5" /> },
    { value: "matic", label: "Matic", icon: <img src={Matic} alt="matic" className="w-5 h-5" /> },
  ];

  const networkOptions = [
    { value: "mainnet", label: "Mainnet" },
    { value: "testnet", label: "Testnet" },
    { value: "polygon", label: "Polygon" },
    { value: "bsc", label: "Binance Smart Chain" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     // Simulate wallet creation success
    setTimeout(() => {
      setIsSuccess(true);
    }, 80);
    console.log({
      walletName: (e.target as any).walletName.value,
      currency,
      network,
    });
  };

    // Success State: show success screen
  if (isSuccess) {
    return (
      <SuccessPage
        title="Your wallet is ready!"
        subtitle="Safe, secure, and waiting for your first transaction."
        primaryButtonText="Fund your new wallet 💰"
        secondaryButtonText="Go home"
        onPrimaryClick={() => navigate("/dashboard/home")}
        onSecondaryClick={() => navigate("/dashboard/home")}
        backgroundColor="#35FD82"
        iconColor="#0647F7"
      />
    );
  }

  return (
    <>
      {/* Header with Cancel */}
      <HeaderWithCancel onCancel={() => navigate(-1)} />

      {/* Back Button */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-6 self-start md:ml-24 ml-6"
        onClick={() => navigate(-1)}
      >
        <ArrowCircleLeft2 size="24" color="black" />
        <p>Back</p>
      </div>

      {/* Form */}
      <div className="w-full md:w-[30%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create New Wallet
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Wallet Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Wallet Name
            </label>
            <Input
              name="walletName"
              type="text"
              placeholder="Enter wallet name"
              className="w-full"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Currency
            </label>
            <Select
              value={currency}
              onChange={setCurrency}
              options={currencyOptions}
              placeholder="Select currency"
            />
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Network
            </label>
            <Select
              value={network}
              onChange={setNetwork}
              options={networkOptions}
              placeholder="Select network"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-[60%] mx-auto text-center rounded-full bg-[#0647F7] hover:bg-blue-700 text-white"
          >
            Create Wallet
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreateWallet;
