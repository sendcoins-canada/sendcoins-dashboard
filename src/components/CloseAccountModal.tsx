import React, { useState } from "react";
import Modal from "./ui/Modal";
import { LogoutCurve, ProfileDelete, TickCircle } from "iconsax-react";
import { Button } from "./ui/button"; 
import { useNavigate } from "react-router-dom";


type CloseAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  initials: string;
  onDeleteAccount?: () => Promise<void> | void;
};

const CloseAccountModal: React.FC<CloseAccountModalProps> = ({
  open,
  onOpenChange,
  userName,
  userEmail,
  firstName,
  lastName,
  initials,
  onDeleteAccount,
}) => {
  const [step, setStep] = useState<
    "profile" | "warning" | "confirm" | "success"
  >("profile");

  const handleCloseAccount = () => setStep("warning");
  const handleContinueClose = () => setStep("confirm");
    const navigate = useNavigate();

  const handleFinalClose = async () => {
  try {
    if (onDeleteAccount) await onDeleteAccount();
    onOpenChange(false); // close modal
    navigate("/account-deleted"); // navigate to success page
  } catch (err) {
    console.error("Error deleting account:", err);
  }
};


  // const handleModalClose = () => {
  //   onOpenChange(false);
  //   setTimeout(() => setStep("profile"), 300);
  // };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="md:w-[25%] w-full bg-white/90"
    >
      {/* STEP 1 — PROFILE OVERVIEW */}
      {step === "profile" && (
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="font-semibold text-sm text-gray-500 mt-2">Profile</h2>

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-700">
            {initials}
          </div>

          {/* Name + Email */}
          <div>
            <p className="font-semibold text-gray-800 text-lg">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>

          {/* Info Fields */}
          <div className="w-full mt-6 space-y-3 bg-white pt-4 px-4 pb-16 rounded-2xl">
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-gray-500">First name</span>
              <span className="text-sm font-medium text-gray-700">
                {firstName}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-gray-500">Last name</span>
              <span className="text-sm font-medium text-gray-700">
                {lastName}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-700">
                {userEmail}
              </span>
            </div>
          </div>

          {/* Close Account Button */}
          <Button
            onClick={handleCloseAccount}
            variant="destructive"
            size="default"
            className="mt-6 bg-[#FFDBDB] text-[#FF4D4F] hover:bg-[#ffcccc]"
          >
            <LogoutCurve size="16" color="#FF4D4F" />
            Close account
          </Button>
        </div>
      )}

      {/* STEP 2 — WARNING */}
      {step === "warning" && (
        <div className="text-center space-y-4">
          <ProfileDelete
            size="16"
            color="#FF383C"
            variant="Bold"
            className="mx-auto bg-[#FFE5E6] p-2 w-18 h-18 rounded-2xl"
          />
          <h2 className="text-xl font-bold text-[#262626]">
            Close your account?
          </h2>
          <p className="text-sm text-gray-600">
            We’re sad to see you go. Deleting your Sendcoins account will
          </p>
          <ul className=" text-sm text-gray-600 space-y-2 text-left bg-white py-3 px-5 rounded-2xl">
            <li className="flex gap-2"><TickCircle size="16" color="#9C51E1" variant="Bold"/>Permanently erase your data and transaction history</li>
            <li className="flex gap-2"><TickCircle size="16" color="#9C51E1" variant="Bold"/>Close all active wallets and balances</li>
            <li className="flex gap-2"><TickCircle size="16" color="#9C51E1" variant="Bold"/>Remove your access to the app</li>
          </ul>
          <div className="flex justify-center space-x-3 pt-4">
            <Button
            //   variant="outline"
            //   size="sm"
              onClick={() => setStep("profile")}
            >
              Cancel
            </Button>
            <Button
            //   variant="destructive"
            //   size="sm"
              onClick={handleContinueClose}
              className="bg-[#FF4D4F] text-white py-3"
            >
              Close account
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — FINAL CONFIRMATION */}
      {step === "confirm" && (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-[#262626]">Are you sure?</h2>
          <p className="text-[#777777] w-[80%] mx-auto ">
            Once deleted, your account and funds cannot be recovered
          </p>
          <div className="flex justify-center space-x-3 pt-4">
            <Button
            //   variant="outline"
            //   size="sm"
              onClick={() => setStep("profile")}
            >
              Cancel
            </Button>
            <Button
            //   variant="destructive"
            //   size="sm"
              onClick={handleFinalClose}
              className="bg-[#FF4D4F] text-white"
            >
              Yes, close account
            </Button>
          </div>
        </div>
      )}

    </Modal>
  );
};

export default CloseAccountModal;
