import React from "react";
// import { ArrowLeft2 } from "iconsax-react";
import Modal from "@/components/ui/Modal";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface WalletSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (wallet: string) => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {

  const { allBalances } = useSelector((state: RootState) => state.wallet);

const shortenAddress = (address: string, chars = 6) => {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const parsedWallets = Object.values(allBalances?.data?.balances || {})
  .filter((wallet: any) => wallet?.isWalletAvailable)
  .map((wallet: any) => ({
    name: wallet.name,
    address: shortenAddress(wallet.walletAddress),
    usd: wallet.TotalAvailableBalancePrice,
    amount: `${wallet.totalAvailableBalance} ${wallet.symbol}`,
    color: "bg-gray-200", // or dynamic if available
    icon: wallet.logo,
  }));


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      showCloseIcon
      className="md:max-w-md max-h-[80vh] overflow-y-auto bg-[#F5F5F5] pb-6"
    >
      {/* Title */}
      <h2 className="md:text-2xl text-xl font-semibold text-center text-neutral-900 mb-4 mx-auto max-w-[60%]">
        Choose wallet to pay with
      </h2>

      {/* Wallet List */}
      <div className="space-y-3 bg-white p-3 rounded-2xl">
        {parsedWallets.map((wallet, index) => (
          <div
            key={index}
            onClick={() => onSelect(wallet.name)}
            className="flex justify-between items-center bg-[#F5F5F5] hover:bg-[#EBEBEB] p-3 rounded-2xl cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              {/* Wallet Icon */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full ${wallet.color}`}
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Wallet Info */}
              <div>
                <p className="font-semibold text-neutral-900">{wallet.name}</p>
                <p className="text-xs text-gray-500">{wallet.address}</p>
              </div>
            </div>

            {/* Balance Info */}
            <div className="text-right">
              <p className="font-semibold text-neutral-900">
                {wallet.usd}
              </p>
              <p className="text-xs text-gray-500">{wallet.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default WalletSelectionModal;
