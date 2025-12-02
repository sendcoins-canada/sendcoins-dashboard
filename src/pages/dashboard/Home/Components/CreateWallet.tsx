import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { ArrowLeft2 } from "iconsax-react";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import SuccessPage from "../../SuccessPage";
import { getSupportedNetwork, getCoins } from "@/api/wallet";
import { showDanger } from "@/components/ui/toast";
import { createWalletThunk } from "@/store/wallet/asyncThunks/createWallet";
import { setCoins, setNetworks } from "@/store/wallet/slice";

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [walletName, setWalletName] = useState("");
  const [currency, setCurrency] = useState("");
  const [network, setNetwork] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Get coins and loading state from Redux
  const { coins, networks, loading } = useSelector((state: RootState) => state.wallet);
  

  //  Fetch currencies when component mounts (kept as GET request)
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await getCoins(); // should return { coins: {...} }
        if (res?.coins) {
          dispatch(setCoins(res.coins));
        } else {
          showDanger("No coins data received from backend.");
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
        showDanger("Failed to fetch currencies.");
      }
    };
    fetchCoins();
  }, [dispatch]);

  //  Fetch supported networks for selected currency (kept as GET request)
  useEffect(() => {
    const fetchNetworks = async () => {
      if (!currency) return;
      try {
        const res = await getSupportedNetwork(currency);
        dispatch(setNetworks(res?.data?.data || []));
      } catch (err) {
      const errorMessage =
        (typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as any).response?.data?.data?.message) ||
        "Failed to fetch supported networks.";

      console.error("Error fetching networks:", errorMessage);
      showDanger(errorMessage);
    }
  };
    fetchNetworks();
  }, [currency, dispatch]);

  //  Handle wallet creation via Redux thunk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currency || !network || !walletName) return;

    const result = await dispatch(createWalletThunk({
      symbol: currency,
      network,
      name: walletName,
    }));

    if (createWalletThunk.fulfilled.match(result)) {
      console.log("Wallet created successfully:", result.payload);
      setIsSuccess(true);
    } else {
      console.error("Error creating wallet:", result.payload);
      showDanger(result.payload || "Failed to create wallet");
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
      <div className="hidden md:block">
        <HeaderWithCancel onCancel={() => navigate(-1)} />
      </div>

      {/* Back Button */}
      <div className="hidden md:flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
        <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
      </div>

      {/* Form */}
      <div className="w-[90%] md:w-[25%] mx-auto mt-20">
        <div className="flex items-center md:justify-center gap-6 mb-8">
          <div className="md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2  w-fit" onClick={() => navigate(-1)}>
            <ArrowLeft2 size="20" color="black" className="" />
          </div>

          <h2 className="md:text-2xl font-semibold text-center">
            Create New Wallet
          </h2>
        </div>

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
                      {coin.symbol} ({coin.name_display})
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

            <Select
              value={network}
              onChange={setNetwork}
              options={networks.map((net) => ({
                value: net.network_id,
                label: (
                  <div className="flex items-center gap-2">
                    <img src={net.network_logo} alt={net.network_full_name} className="w-5 h-5 rounded-full" />
                    <span>{net.network_full_name} ({net.network_id})</span>
                  </div>
                ),
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
              disabled={loading}
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
