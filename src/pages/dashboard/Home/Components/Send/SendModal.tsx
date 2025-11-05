import React, { useState } from "react";
import  Modal  from "@/components/ui/Modal";
import { ArrowRight2 } from "iconsax-react";
import { BuyCrypto, Moneys } from "iconsax-react";

interface SendOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOption: (option: "crypto" | "fiat") => void;
}

const SendOptionsModal: React.FC<SendOptionsModalProps> = ({
  open,
  onOpenChange,
  onSelectOption,
}) => {
  const [selected, setSelected] = useState<"crypto" | "fiat" | null>(null);

  const handleSelect = (option: "crypto" | "fiat") => {
    setSelected(option);
    onSelectOption(option);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
    //   title="How do you want to send?"
      className="max-w-md w-[90%] bg-[#F5F5F5]"
    >
        <h2 className="text-[28px] font-semibold text-center">How do you want to send?</h2>
      <div className="flex flex-col gap-3 mt-3 bg-white p-2 rounded-2xl">
        {/*  Crypto Option */}
        <button
          onClick={() => handleSelect("crypto")}
          className={`flex justify-between items-start border rounded-xl px-2 py-4 text-left hover:bg-[#F5F5F5] transition gap-2 ${
            selected === "crypto" ? "bg-[#F5F5F5]" : "border-gray-200"
          }`}
        >
            <BuyCrypto color="#0088FF" size={16}/>
          <div>
            <p className="font-medium text-gray-800">Crypto wallet</p>
            <p className="text-sm text-gray-500">
              Send to their crypto wallet. Ideal for cross-border transfers.
            </p>
          </div>
          <ArrowRight2 size="18" color="black" />
        </button>

        {/*  Fiat Option */}
        <button
          onClick={() => handleSelect("fiat")}
          className={`flex justify-between items-start border rounded-xl px-2 py-4 text-left hover:bg-[#F5F5F5] transition ${
            selected === "fiat" ? "bg-[#F5F5F5]" : "border-gray-200"
          }`}
        >
        <Moneys color="#0088FF" size={16}/>
          <div>
            <p className="font-medium text-gray-800">Fiat</p>
            <p className="text-sm text-gray-500">
              Send directly to their local bank account. Fast and reliable.
            </p>
          </div>
          <ArrowRight2 size="18" color="black" />
        </button>
      </div>
    </Modal>
  );
};

export default SendOptionsModal;
