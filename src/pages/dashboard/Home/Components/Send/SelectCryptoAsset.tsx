import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Btc from "@/assets/Btc.svg";
import Eth from "@/assets/Eth.svg";
import Usdc from "@/assets/Usdc.svg";
import Matic from "@/assets/matic.svg";
import { TickCircle } from "iconsax-react";
import { HeaderWithCancel } from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";

type Asset = {
  id: string;
  name: string;
  icon: string;
  balance?: string;
};

type Props = {
  onContinue: (asset: string) => void;
};

export const assets: Asset[] = [
  { id: "bnb", name: "BNB", icon: Btc },
  { id: "eth", name: "Ethereum", icon: Eth },
  { id: "polygon", name: "Polygon", icon: Matic },
  { id: "usdc", name: "USDC", icon: Usdc },
  { id: "eth2", name: "Ethereum", icon: Eth },
  { id: "polygon2", name: "Polygon", icon: Matic },
  { id: "usdc2", name: "USDC", icon: Usdc },
];

const SelectCryptoAsset: React.FC<Props> = ({ onContinue }) => {
    const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <HeaderWithCancel onCancel={() => (navigate(-1))}/>
    <div className=" flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h2 className="text-center text-[28px] font-semibold mb-4">
          Select crypto asset
        </h2>

        {/* Search input */}
        <Input
          placeholder="Search for assets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        {/* Asset list */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelected(asset.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition `}
            >
              <div className="flex items-center gap-3">
                <img src={asset.icon} alt={asset.name} className="w-5 h-5" />
                <span className="text-sm font-medium">{asset.name}</span>
              </div>
              {selected === asset.id && (
                // <div className="w-2 h-2 bg-green-500 rounded-full" />
                <TickCircle size="24" color="#34C759" variant="Bold"/>
              )}
            </button>
          ))}
        </div>

        {/* Continue button */}
        <Button
          onClick={() => selected && onContinue(selected)}
          disabled={!selected}
          className="w-full mt-6 bg-[#0647F7] text-white rounded-full hover:bg-blue-700"
        >
          Continue 
        </Button>
      </div>
    </div>
    </>
  );
};

export default SelectCryptoAsset;
