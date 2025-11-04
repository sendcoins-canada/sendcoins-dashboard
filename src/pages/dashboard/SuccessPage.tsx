import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ConfettiImage from "@/assets/Confetti.svg"; 
import Verify from "@/assets/verify.svg"

interface SuccessPageProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  backgroundColor?: string;
  iconColor?: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  title = "Success!",
  subtitle = "Your action was completed successfully.",
  primaryButtonText = "Continue",
  secondaryButtonText = "Go back",
  onPrimaryClick,
  onSecondaryClick,
  backgroundColor = "#00E676",
  // iconColor = "#0647F7",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative"
      style={{
        backgroundColor,
       
      }}
    >
       <div
  className="absolute top-0 w-full h-48 bg-repeat-x"
  style={{ backgroundImage: `url(${ConfettiImage})`, backgroundSize: "contain" }}
></div>

      {/* Success Icon */}
      <img src={Verify} alt="verify-icon"  />

      {/* Title */}
      <h1 className="text-5xl font-bold text-black mb-2">{title}</h1>

      {/* Subtitle */}
      <p className=" text-[#777777] mb-12">{subtitle}</p>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={onPrimaryClick || (() => navigate("/"))}
          className="bg-[#262626] text-white rounded-full px-6 py-2 hover:bg-gray-800"
        >
          {primaryButtonText}
        </Button>

        <Button
          onClick={onSecondaryClick || (() => navigate(-1))}
          variant="ghost"
          className="rounded-full  text-black hover:bg-[#262626] hover:text-white px-6 py-2"
        >
          {secondaryButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
