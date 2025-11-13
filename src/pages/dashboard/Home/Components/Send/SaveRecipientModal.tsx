import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { showSuccess, showWarning } from "@/components/ui/toast"; // assuming shadcn toast
import { Coin, KyberNetwork, Wallet2 } from "iconsax-react";

interface SaveRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  network: string;
  asset: string;
}

const SaveRecipientModal: React.FC<SaveRecipientModalProps> = ({
  open,
  onOpenChange,
  address,
  network,
  asset,
}) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      showWarning("Please enter a recipient name.");
      return;
    }
    // Simulate API call or local save
    showSuccess(`Recipient "${name}" saved successfully.`);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="md:w-[546px] bg-[#F5F5F5]" showCloseIcon>
      <h2 className="text-[20px] md:text-[28px] font-semibold text-center mb-4 mt-8">Save this recipient</h2>

      <div className="space-y-4 bg-white p-4 rounded-2xl">
        <div>
          <label className="text-sm text-primary mb-1 block">Recipient name</label>
          <Input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="bg-[#F9FAFB] rounded-lg px-3 py-5 text-sm space-y-4">

          <div className="flex justify-between">
            <div className="flex justify-between gap-2">
              <Wallet2 size="16" color="#697689" />
              <span className="text-neutral">Wallet address</span>
            </div>
            <span className="font-medium text-gray-800 truncate max-w-[150px]">{address}</span>
          </div>

          <div className="flex justify-between">
            <div className="flex justify-between gap-2">
              <KyberNetwork size="16" color="#697689" />
              <span className="text-neutral">Network</span>
            </div>
            <span className="text-[#0052FF]">{network}</span>
          </div>

          <div className="flex justify-between">
            <div className="flex justify-between gap-2">
              <Coin size="16" color="#697689" />
              <span className="text-neutral">Asset</span>
            </div>            <span className="text-[#0052FF]">{asset}</span>
          </div>
        </div>

        <Button
          className="w-full rounded-full bg-[#0052FF] text-white hover:bg-[#0040CC]"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save this recipient
        </Button>
      </div>
    </Modal>
  );
};

export default SaveRecipientModal;
