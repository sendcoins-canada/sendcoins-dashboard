import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Btc from "@/assets/Btc.svg";
import Eth from "@/assets/Eth.svg";
import Usdc from "@/assets/Usdc.svg";
import Matic from "@/assets/matic.svg";
import { TickCircle, SearchNormal1, ArrowLeft2 } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";

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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate()
  const filtered = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <div className="hidden md:block">
            <Header/>
          </div>
    <div className=" flex flex-col items-center justify-center bg-white px-4 ">
      <div className="w-full md:w-[25%] mx-auto text-center mt-20 md:mt-0">
        <div className="flex items-center md:justify-center gap-6 mb-8">
                  <div className="md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2  w-fit" onClick={() => navigate(-1)}>
                    <ArrowLeft2 size="20" color="black" className="" />
                  </div>
        
                  <h2 className="md:text-2xl font-semibold text-center">
                    Select crypto asset
                  </h2>
                </div>

        {/* Search input */}
        <Input
          placeholder="Search for assets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
          startIcon={<SearchNormal1 color="#262626"/>} 
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
                <span className=" text-primary">{asset.name}</span>
              </div>
              {selected === asset.id && (
                // <div className="w-2 h-2 bg-green-500 rounded-full" />
                <TickCircle size="16" color="#34C759" variant="Bold"/>
              )}
            </button>
          ))}
        </div>

        {/* Continue button */}
        <Button
          onClick={() => selected && onContinue(selected)}
          disabled={!selected}
          className="mx-auto text-center mt-6 bg-[#0647F7] text-white rounded-full px-[20px]"
        >
          Continue
        </Button>
      </div>
    </div>
    </>
  );
};

export default SelectCryptoAsset;
