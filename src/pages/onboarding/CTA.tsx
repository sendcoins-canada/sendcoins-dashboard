// import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Header from "@/components/onboarding/shared/Header";
import { ArrowLeft2, ShieldTick } from "iconsax-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation */}
      
      <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
         <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
            </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center mt-12 px-4">
        <div className="bg-[#480355] text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
<ShieldTick size="32" color="#FFFFFF" variant="Bold"/>        </div>
        <h1 className="text-3xl font-extrabold mb-3 font-sans">Let’s Get You Verified & Secure</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Just a quick ID check and passcode setup, and you’ll be ready to send and receive money in minutes
        </p>

        {/* Options */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <button
            onClick={() => navigate("/setup-passcode")}
            className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer"
          >
            <div className="text-left">
              <h3 className="font-semibold">Create a passcode</h3>
              <p className="text-sm text-gray-500">
                Set a secure 4 digit code to keep your account safe and your transfers protected.
              </p>
            </div>
            <ChevronRight className="text-gray-400" />
          </button>

          <button
            onClick={() => navigate("/address")}
            className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer"
          >
            <div className="text-left">
              <h3 className="font-semibold">Complete KYC verification</h3>
              <p className="text-sm text-gray-500">
                We’ll run a quick check to verify your details and keep your account secure.
              </p>
            </div>
            <ChevronRight className="text-gray-400" />
          </button>
        </div>

        {/* Later button */}
        <Button
          variant="primary"
          className="mt-10 bg-[#0647F7] cursor-pointer text-white px-6 py-2 rounded-full"
          onClick={() => navigate("/welcome")}
        >
          I’ll do this later
        </Button>
      </div>
    </div>
    </>
  );
};

export default CTA;
