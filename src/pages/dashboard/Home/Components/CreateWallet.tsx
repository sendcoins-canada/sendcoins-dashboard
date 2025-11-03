import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft2 } from "iconsax-react";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import SuccessPage from "../../SuccessPage";
import { getCurrency, getSupportedNetwork, createWallet, getCoins } from "@/api/wallet";
import type { Coin } from "@/types/wallet";
import { showDanger } from "@/components/ui/toast";

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
   const [walletName, setWalletName] = useState("");
  const [currency, setCurrency] = useState("");
  const [network, setNetwork] = useState("");
   const [isSuccess, setIsSuccess] = useState(false);
    const [coins, setCoins] = useState<Record<string, Coin>>({});
  const [networks, setNetworks] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);
  

  
  //  Fetch currencies when component mounts
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await getCoins(); // should return { coins: {...} }
        if (res?.coins) {
          setCoins(res.coins);
        } else {
          showDanger("No coins data received from backend.");
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
        showDanger("Failed to fetch currencies.");
      }
    };
    fetchCoins();
  }, []);

  //  Fetch supported networks for selected currency
  useEffect(() => {
    const fetchNetworks = async () => {
      if (!currency) return;
      try {
        const res = await getSupportedNetwork(currency);
        setNetworks(res?.data || []);
      } catch (err) {
        console.error("Error fetching networks:", err);
        showDanger("Failed to fetch supported networks.");
      }
    };
    fetchNetworks();
  }, [currency]);

   //  Handle wallet creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currency || !network || !walletName) return;

    setIsLoading(true);
     try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("No token found in localStorage");
      return;
    }

    // Parse the token object
    const parsed = JSON.parse(storedToken);
    const token = parsed.azer_token; //  extract the actual token string

      const payload = {
        symbol: currency,
        network,
        token,
        name: walletName,
      };

      const res = await createWallet(payload);
      console.log("Wallet created:", res);

      if (res?.data?.isSuccess) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Error creating wallet:", err);
    } finally {
      setIsLoading(false);
    }
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
     <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
                <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
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
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)} 
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Currency
            </label>
            {/* <Select
              value={currency}
              onChange={setCurrency}
              options={currencyOptions}
              placeholder="Select currency"
            /> */}
            <Select
  value={currency}
  onChange={setCurrency}
  options={Object.values(coins).map((coin) => ({
    value: coin.symbol.toLowerCase(), // e.g. "btc"
    // label: coin.currency_name.toUpperCase(), 
    label: (
      <div className="flex items-center gap-2">
        <img
          src={coin.logo}
          alt={coin.name}
          className="w-5 h-5 rounded-full"
        />
        <span className="capitalize">
          {coin.symbol} ({coin.name_display.toUpperCase()})
        </span>
      </div>
    ),
  }))}
  placeholder="Select currency"
/>
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Network
            </label>
            {/* <Select
              value={network}
              onChange={setNetwork}
              options={networkOptions}
              placeholder="Select network"
            /> */}
            <Select
  value={network}
  onChange={setNetwork}
  options={networks.map((net: any) => ({
    value: net.network_name.toLowerCase(), // e.g. "trc20"
    label: net.network_name.toUpperCase(), // e.g. "TRC20"
  }))}
  placeholder="Select network"
/>
          </div>

          {/* Submit Button */}
          <div className=" flex mt-20">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-[40%] mx-auto text-center rounded-full bg-primaryblue hover:bg-blue-700 text-white "
              disabled={isLoading} 
          >
            Create Wallet
          </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateWallet;
