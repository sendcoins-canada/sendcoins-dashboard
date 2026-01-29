import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordCheck } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import { requestPasscodeReset, confirmPasscodeReset, verifyOtp } from "@/api/authApi"; // Adjust paths

// Steps for the new flow
type FlowStep = "new" | "confirm" | "otp";

const ResetPasscode: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth); 
  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;
  const [step, setStep] = useState<FlowStep>("new");
  const [passcode, setPasscode] = useState<string[]>([]); 
  const [newCode, setNewCode] = useState<number>(0);
  // const [authHash, setAuthHash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    // OTP might be 6 digits, PIN is 4. Adjust maxLength dynamically
    const limit = step === "otp" ? 6 : 4;
    if (value.length > limit) value = value.slice(0, limit);
    setPasscode(value.split(""));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const currentCodeAsString = passcode.join("");
    const currentCodeAsNumber = Number(currentCodeAsString);
      if (step === "new") {
        setNewCode(currentCodeAsNumber);
        setPasscode([]);
        setStep("confirm");
      } 
      
      else if (step === "confirm") {
        // const confirmedCode = passcode.join("");
        if (currentCodeAsNumber !== newCode) {
          showDanger("PINs do not match.");
          setPasscode([]);
          return;
        }

        // Trigger Request Reset (Step 1)
        // Note: Using 'token' from user session or previous state if required by your API
        await requestPasscodeReset({
          token: token?.azer_token || "", 
          newPasscode: newCode,
          confirmPasscode: currentCodeAsNumber
        });

        showSuccess("OTP sent to your email.");
        setPasscode([]);
        setStep("otp");
      } 
      
      else if (step === "otp") {
        // Verify OTP (Step 2)
        const otpResult = await verifyOtp({
          email: userData?.user_email || "",
          code: currentCodeAsNumber,
          purpose: "passcode_reset"
        });

        const hash = otpResult.data.authHash || ""; // Adjust based on your API response structure
        
        // Confirm Reset (Step 3)
        await confirmPasscodeReset({
          authHash: hash,
          newPasscode: newCode
        });

        showSuccess("Passcode updated successfully!");
        navigate("/dashboard/home");
      }
    } catch (error: any) {
      showDanger(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isComplete = step === "otp" ? passcode.length === 6 : passcode.length === 4;

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center bg-white px-4">
        <div className="flex flex-col items-center text-center mt-20">
          <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <PasswordCheck color="#480355" size="32" variant="Bold" />
          </div>

          <h2 className="text-[28px] font-semibold mb-2">
            {step === "new" ? "Setup new passcode" : step === "confirm" ? "Confirm new passcode" : "Verify OTP"}
          </h2>
          <p className="text-gray-500 mb-8 md:w-[70%]">
            {step === "otp" ? `Check your inbox for a 6-digit code to verify your email. This helps keep your account secure.` : "Setup your new passcode so you can send and receive money securely."}
          </p>

          <input
            ref={inputRef}
            type="tel"
            value={passcode.join("")}
            onChange={handleChange}
            className="absolute opacity-0 -z-10"
            autoFocus
          />

          {/* PIN/OTP Dots Display */}
          <div className="flex gap-4 mb-10 cursor-pointer" onClick={() => inputRef.current?.focus()}>
            {(step === "otp" ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]).map((index) => (
              <div key={index} 
              className={`w-4 h-4 rounded-full ${passcode[index] ? "bg-[#212121] scale-110" : "bg-[#F5F5F5]"} `}
              />
            ))}
          </div>

          <Button
            onClick={handleFinalSubmit}
            disabled={!isComplete || loading}
            className="w-full max-w-xs rounded-full py-6 text-white"
          >
            {loading ? "Processing..." : step === "otp" ? "Verify & Save" : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPasscode;
