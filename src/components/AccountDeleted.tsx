import React from "react";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShieldTick } from "iconsax-react";

const AccountDeleted: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    
    window.location.href= "https://sendcoins.ca/"
    
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 p-6 bg-white min-h-screen">
<ShieldTick size="32" color="white" variant="Bold" className="bg-[#34D257] mx-auto p-2 w-18 h-18 rounded-2xl"/>
      <h2 className="text-2xl font-semibold text-green-600">
        Account deleted successfully
      </h2>
      <p className="text-[#777777] max-w-xs">
        We’re grateful for the time you spent with us, and we hope to serve you again in the future.
      </p>

      <Button
        variant="secondary"
        size="default"
        onClick={handleClose}
        className="mt-4"
      >
        Visit website
      </Button>
    </div>
  );
};

export default AccountDeleted;
