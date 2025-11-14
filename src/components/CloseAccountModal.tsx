import React, { useState } from "react";
import Modal from "./ui/Modal";
import {
  LogoutCurve,
  ProfileDelete,
  TickCircle,
} from "iconsax-react";
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

  const handleBack = () => {
    if (step === "profile") {
      onOpenChange(false);
    } else {
      setStep("profile");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className={`md:w-fit ${step === "profile" ? "md:min-w-[546px] bg-neutral-100" : step === "warning" ? "md:min-w-[448px] bg-neutral-100" : "md:min-w-[378px] bg-white"} w-full  border-4 border-white`}
      showBackArrow={true}
      onBack={handleBack}
      title={step === "profile" ? "Profile" : undefined}
      showCloseIcon={true}
    >
      {/* STEP 1 — PROFILE OVERVIEW */}
      {step === "profile" && (
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="w-[150px] border-2 border-white h-[150px] rounded-full bg-[#F6F0FF] flex items-center justify-center text-[32px] font-[700] text-[#8739FE]">
            {initials}
          </div>

          {/* Name + Email */}
          <div>
            <p className="font-semibold text-[#262626] text-xl">{userName}</p>
            <p className="text-body-md-regular text-gray-500">{userEmail}</p>
          </div>

          {/* Info Fields */}
          <div className="w-full mt-6 space-y-3 bg-white pt-4 px-4 pb-16 rounded-2xl">
            <div className="flex justify-between border-b-[.5px] border-[#EAECF0] pb-4">
              <span className="text-body-md-regular text-gray-500">First name</span>
              <span className="text-body-md-strong text-gray-700">
                {firstName}
              </span>
            </div>
            <div className="flex justify-between border-b-[.5px] border-[#EAECF0] pb-4">
              <span className="text-sm text-gray-500">Last name</span>
              <span className="text-body-md-strong text-gray-700">
                {lastName}
              </span>
            </div>
            <div className="flex justify-between border-b-[.5px] border-[#EAECF0] pb-4">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-body-md-strong text-gray-700">
                {userEmail}
              </span>
            </div>
          </div>

          {/* Close Account Button */}
          <Button
            onClick={handleCloseAccount}
            variant="destructive"
            size="default"
            className="mt-4 text-body-sm-regular font-[300] bg-[#FFDBDB] text-[#FF4D4F] hover:bg-[#ffcccc]"
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
            className="mx-auto bg-[#FFE5E6] p-2 w-[66px] h-[66px] rounded-2xl"
          />
          <h2 className="text-xl font-[600] text-[#262626]">
            Close your account?
          </h2>
          <p className="text-body-md-regular text-[#777777] max-w-xs text-center mx-auto">
            We’re sad to see you go. Deleting your Sendcoins account will
          </p>
          <ul className="text-body-sm-regular text-[#777777] space-y-2 text-left bg-white py-3 px-5 rounded-2xl">
            <li className="flex gap-2">
              <TickCircle size="16" color="#9C51E1" variant="Bold" />
              Permanently erase your data and transaction history
            </li>
            <li className="flex gap-2">
              <TickCircle size="16" color="#9C51E1" variant="Bold" />
              Close all active wallets and balances
            </li>
            <li className="flex gap-2">
              <TickCircle size="16" color="#9C51E1" variant="Bold" />
              Remove your access to the app
            </li>
          </ul>
          <div className="flex justify-center space-x-3 pt-4">
            <Button
              variant="outline"
              //   size="sm"
              className="border-none"
              onClick={() => setStep("profile")}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              //   size="sm"
              onClick={handleContinueClose}
              className="bg-[#FF4D4F] text-body-sm-strong text-white py-4 "
            >
              Close account
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — FINAL CONFIRMATION */}
      {step === "confirm" && (
        <div className="text-center space-y-4">
          <h2 className="text-body-lg-strong text-[#262626]">Are you sure?</h2>
          <p className="text-[#777777] w-[80%] mx-auto text-body-sm-regular">
            Once deleted, your account and funds cannot be recovered
          </p>
          <div className="flex justify-center space-x-3 pt-4">
            <Button
              variant="outline"
              //   size="sm"
              onClick={() => setStep("profile")}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
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
