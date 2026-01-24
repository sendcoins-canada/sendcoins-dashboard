import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { Scanner, ArrowLeft2 } from "iconsax-react";
import { Select } from "@/components/ui/select"; // Ensure this imports the file above
import SaveRecipientModal from "./SaveRecipientModal";
import WAValidator from 'multicoin-address-validator';
import { getSupportedNetwork } from "@/api/wallet";

type Props = {
  asset: string;
  onBack: () => void;
  onNext: (data: { network: string; address: string; keychain: string }) => void;
};

// 1. Add this helper function outside or inside your component
const getValidatorSymbol = (networkStr: string, assetStr: string) => {
  // Normalize strings
  const net = networkStr.toLowerCase();
  
  // Map your backend network names to library symbols
  if (net.includes("bitcoin") || net === "btc") return "btc";
  if (net.includes("ethereum") || net.includes("erc20") || net === "eth") return "eth";
  if (net.includes("tron") || net.includes("trc20") || net === "trx") return "trx";
  if (net.includes("bsc") || net.includes("binance") || net.includes("bep20")) return "eth"; // BSC uses ETH address format
  if (net.includes("solana") || net === "sol") return "sol";
  if (net.includes("polygon") || net === "matic") return "eth"; // Polygon uses ETH address format
  
  // Fallback: try using the asset name if network isn't clear (e.g. for native coins like "LTC")
  return assetStr.toLowerCase();
};

const RecipientDetails: React.FC<Props> = ({ asset, onNext }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [supportedNetworks, setSupportedNetworks] = useState<any[]>([]);
    const [networkValue, setNetworkValue] = useState<string>("");

  const [loadingNetworks, setLoadingNetworks] = useState(false);
  // const dispatch = useDispatch<AppDispatch>();
  // const token = useSelector((state: RootState) => state.auth.token?.azer_token);
  // const recipients = useSelector((state: RootState) => state.recipients.recipients);

  
  // 1. Fetch Supported Networks when Asset changes
  useEffect(() => {
    const fetchNetworks = async () => {
      setLoadingNetworks(true);
      try {
        const response = await getSupportedNetwork((asset).toLowerCase());
        // Assuming response.data is an array of strings or objects like { network: "ERC20" }
        const networks = response.data.data || []; 
        console.log(networks)
        setSupportedNetworks(networks);
        
        // Optional: Auto-select first network
        if (networks.length > 0) {
           const firstNet = typeof networks[0] === 'string' ? networks[0] : networks[0].network;
           setNetworkValue(firstNet);
        }
      } catch (error) {
        console.error("Failed to fetch supported networks", error);
      } finally {
        setLoadingNetworks(false);
      }
    };

    if (asset) {
      fetchNetworks();
    }
  }, [asset]);

  // 2. Prepare Options for Standard Select
  const selectOptions = supportedNetworks.map((net: any) => {
    const netName = typeof net === 'string' ? net : net.network_id;
    return {
      value: netName,
      label: netName,
    };
  });


  // Validation Logic
  useEffect(() => {
    if (address.trim() === "") {
      setIsValid(false);
      return;
    }

    // Get the correct symbol for validation 
    const validatorSymbol = getValidatorSymbol(networkValue, asset);

    try {
      const valid = WAValidator.validate(address, validatorSymbol);
      setIsValid(valid);
      
      // Console log for debugging
      console.log(`Validating ${address} against ${validatorSymbol}: ${valid}`);
    } catch (e) {
      console.warn("Validator error:", e);
      // Fallback for unsupported coins
      setIsValid(address.length > 20); 
    }
  }, [address, networkValue, asset]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch {
      alert("Clipboard access denied. Please paste manually.");
    }
  };

  // Helper to determine what to show in the UI for the label
  // const getNetworkLabel = () => {
  //   // If it matches a saved ID, return the label
  //   const existing = availableNetworks.find(n => n.value === networkValue);
  //   if (existing) return existing.label;
  //   // Otherwise, it's a custom created network, return the raw value
  //   return networkValue; 
  // };

 

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
        <ArrowLeft2 size="16" color="black" /><p className="text-sm ml-1">Back</p>
      </div>

      <div className="flex flex-col items-center min-h-[75vh] px-4">
        <div className="w-full max-w-sm md:mt-0 mt-20">
          
          <div className="flex items-center md:justify-center gap-6 mb-8">
            <div className="md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
              <ArrowLeft2 size="20" color="black" />
            </div>
            <h2 className="md:text-2xl font-semibold text-center">
              Enter recipient details
            </h2>
          </div>

          {/* --- Network Select (Creatable) --- */}
          <div className="mt-6">
            <label className="text-sm text-neutral-600">Network</label>
            <Select
              placeholder={loadingNetworks ? "Loading..." : "Select network"}
              value={networkValue}
              onChange={(selectedValue: string) => {
                setNetworkValue(selectedValue);
              }}
              options={selectOptions}
            />
          </div>

          {/* --- Wallet Address Input --- */}
          <div className="w-full mt-4">
            <div className="relative">
              <div className="flex flex-col bg-[#F5F5F5] rounded-xl px-3 py-[10px] border border-transparent focus-within:border-[#0052FF] transition-colors">
                <label className="text-xs text-neutral mb-2">Wallet address</label>
                <div className="flex items-center justify-between bg-[#F5F5F5] transition-colors">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste or scan wallet address"
                    className="w-full bg-transparent outline-none placeholder:text-base placeholder:text-primary"
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 text-xs text-[#6A91FB] hover:underline shrink-0 ml-2"
                  >
                    <Scanner size={14} color="#0539C7" />
                    Paste
                  </button>
                </div>
              </div>
              {!isValid && address.length > 0 && (
                <p className="text-red-500 text-[10px] mt-1 ml-1">This is not a valid {networkValue || asset} address.</p>
              )}
            </div>
          </div>

          {/* --- Save address Trigger --- */}
          <p 
            className={`text-sm mt-3 flex items-center gap-1 cursor-pointer transition-colors ${isValid && address ? "text-[#0052FF] font-medium" : "text-[#BBBBBB]"}`} 
            onClick={() => setOpenSaveModal(true)}
          >
            Save this address <span className="">+</span>
          </p>

          <div className="flex justify-center mt-20">
            <Button
              // If it's a known ID (e.g., 'ERC20-USDT'), extract the real network name ('ERC20'). 
              // If it's custom ('MyNetwork'), use as is.
              onClick={() => {

                onNext({ 
                  network: networkValue, 
                  address, 
                  keychain: '' 
                });
              }}
              disabled={!isValid || !address || !networkValue}
              className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2 w-full md:w-auto"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      <SaveRecipientModal
        open={openSaveModal}
        onOpenChange={setOpenSaveModal}
        address={address}
        // Ensure we pass the clean network name to the modal
        network={networkValue}
        asset={asset}
      />
    </>
  );
};

export default RecipientDetails;