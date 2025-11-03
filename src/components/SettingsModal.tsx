import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Logout, ShieldTick, Lock, MessageQuestion } from "iconsax-react";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  user?: {
    initials?: string;
    name?: string;
    email?: string;
  };
};


const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange, user }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl p-4 w-72">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile header */}
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg">
            {user?.initials}
          </div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>

          {/* Options */}
          <div className="w-full space-y-3 text-sm text-left">
            <div className="flex items-center gap-2">
              <ShieldTick size="18" /> KYC
            </div>
            <div className="flex items-center gap-2">
              <Lock size="18" /> Change PIN
            </div>
            <div className="flex items-center gap-2">
              <MessageQuestion size="18" /> Contact support
            </div>
            <div className="flex items-center gap-2 text-red-600 mt-2 cursor-pointer">
              <Logout size="18" /> Logout
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
