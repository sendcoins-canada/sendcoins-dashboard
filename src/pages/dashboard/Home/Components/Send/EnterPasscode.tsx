// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/store";
// import { ArrowLeft2, PasswordCheck } from "iconsax-react";
// import { Button } from "@/components/ui/button";
// import Header from "@/components/onboarding/shared/Header";
// import { showSuccess, showDanger } from "@/components/ui/toast";
// import { requestPasscodeCreate, finalizePasscodeCreate, verifyOtp, verifyPasscode } from "@/api/authApi";

// interface EnterPasscodeProps {
//   onSuccess?: (code: string) => void;
//   mode?: "create" | "verify";
// }

// const EnterPasscode: React.FC<EnterPasscodeProps> = ({ onSuccess, mode = 'create' }) => {
//   const navigate = useNavigate();
//   const token = useSelector((state: RootState) => state.auth.token?.azer_token);
//   // Using 'any' here as well to avoid conflicts if User types are strict
//   const userSlice = useSelector((state: RootState) => state.user) as any;
//   const userData = userSlice?.user?.data;

//   // Initialize step based on mode
//   const [step, setStep] = useState<"create" | "confirm" | "otp" | "verify">(
//     mode === "verify" ? "verify" : "create"
//   );
//   // const [step, setStep] = useState<"create" | "confirm" | "otp">("create");
//   const [passcode, setPasscode] = useState<string[]>([]);
//   const [firstPasscode, setFirstPasscode] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // Determine if we need 4 digits (PIN) or 6 digits (OTP)
//   const requiredLength = step === "otp" ? 6 : 4;
//   const isComplete = passcode.length === requiredLength;

//   const handleNumberClick = (num: string) => {
//     if (passcode.length < requiredLength) setPasscode((prev) => [...prev, num]);
//   };

//   const handleDelete = () => {
//     setPasscode((prev) => prev.slice(0, -1));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/\D/g, "");
//     if (value.length > requiredLength) value = value.slice(0, requiredLength);
//     setPasscode(value.split(""));
//   };

//   const handleSubmit = async () => {
//     if (!isComplete) return;
//     // --- VERIFY MODE (For Transactions) ---
//     if (step === "verify") {
//       setLoading(true);
//       try {
//         if (!token) throw new Error("Authentication missing");

//         // 1. Verify Passcode with Backend
//         const verifyRes = await verifyPasscode({
//           token: token,
//           passcode: passcode.join("")
//         });

//         // 2. Check response success
//         if (verifyRes?.data?.isSuccess) {
//            // 3. If valid, proceed to execute the actual transaction (SendFlow logic)
//            if (onSuccess) {
//               await onSuccess(passcode.join(""));
//            }
//         } else {
//            throw new Error("Invalid passcode");
//         }
//       } catch (error: any) {
//         console.error("Passcode verification failed:", error);
//         showDanger(error.response?.data?.message || "Incorrect passcode. Please try again.");
//         setPasscode([]); // Clear input on error
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     if (step === "create") {
//       setFirstPasscode(passcode);
//       setPasscode([]);
//       setStep("confirm");
//     } 
//     else if (step === "confirm") {
//       if (passcode.join("") !== firstPasscode.join("")) {
//         showDanger("Passcodes do not match");
//         setPasscode([]);
//         setStep("create");
//         return;
//       }

//       setLoading(true);
//       try {
//         const tokenData = JSON.parse(localStorage.getItem("token") || "{}");
//         await requestPasscodeCreate({
//           token: tokenData.azer_token,
//           passcode: firstPasscode.join(""),
//           // confirmPasscode: passcode.join(""),
//         });
//         showSuccess("OTP sent to your email");
//         setPasscode([]);
//         setStep("otp");
//       } catch (err: any) {
//         showDanger(err.response?.data?.message || "Failed to initiate request");
//       } finally {
//         setLoading(false);
//       }
//     } 
//     else if (step === "otp") {
//       setLoading(true);
//       try {
//         // 1. Verify OTP
        
//         const otpRes = await verifyOtp({
//           email: userData.user_email,
//           code: Number(passcode.join("")),
//           purpose: "passcode_create",
//         });

//         // 2. Finalize with authHash
//         await finalizePasscodeCreate(
//           firstPasscode.join(""),
//           otpRes?.data?.authHash || "",
//         );

//         showSuccess("Passcode created successfully!");
//         onSuccess?.(firstPasscode.join(""));
//         navigate("/dashboard/home");
//       } catch (err: any) {
//         showDanger(err.response?.data?.message || "Verification failed");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, [step]);

//   const keypad = [
//     ["1", "2", "3"],
//     ["4", "5", "6"],
//     ["7", "8", "9"],
//     ["", "0", "←"],
//   ];

//   return (
//     <>
//       <div className="hidden md:block">
//         <Header />
//       </div>
//       <div
//         className="flex items-center cursor-pointer border rounded-full w-fit ml-6 p-2 mt-10 md:mt-0"
//         onClick={() => navigate(-1)}
//       >
//         <ArrowLeft2 size="16" color="black" />
//       </div>

//       <div className="min-h-screen flex flex-col items-center bg-white py-6 md:pt-16">
//         <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//           <PasswordCheck color="#480355" size="32" variant="Bold" />
//         </div>

//         <p className="text-2xl font-extrabold mb-2 text-center">
//           {step === "create" ? "Create passcode" : step === "confirm" ? "Confirm passcode" : "Verify OTP"}
//         </p>
//         <p className="text-gray-500 mb-8 text-center px-4">
//           {step === "create"
//             ? "Set a 4-digit PIN for your transactions"
//             : step === "confirm"
//             ? "Re-enter your passcode to confirm."
//             : "Enter the 6-digit code sent to your email."}
//         </p>

//         {/* Passcode Display */}
//         <div className="flex gap-4 mb-10">
//           {Array.from({ length: requiredLength }).map((_, i) => (
//             <div
//               key={i}
//               className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                 passcode[i] ? "bg-black" : "bg-gray-200"
//               }`}
//             >
//                {step === "otp" && passcode[i] && <span className="text-[8px] text-white">{passcode[i]}</span>}
//             </div>
//           ))}
//         </div>

//         {/* MOBILE KEYPAD */}
//         <div className="md:hidden flex flex-col items-center w-full">
//           <div className="grid grid-cols-3 gap-y-8 gap-x-12 text-2xl font-semibold mb-10">
//             {keypad.flat().map((key, i) => (
//               <div
//                 key={i}
//                 className="flex justify-center items-center h-12 w-12 rounded-full cursor-pointer active:bg-gray-100"
//                 onClick={() => {
//                   if (key === "←") handleDelete();
//                   else if (key) handleNumberClick(key);
//                 }}
//               >
//                 {key}
//               </div>
//             ))}
//           </div>

//           <Button
//             onClick={handleSubmit}
//             disabled={!isComplete || loading}
//             className={`w-[80%] py-3 rounded-full text-white ${
//               isComplete ? "bg-primaryblue" : "bg-blue-100 text-gray-400"
//             }`}
//           >
//             {loading ? "Processing..." : step === "otp" ? "Verify" : "Continue"}
//           </Button>
//         </div>

//         {/* DESKTOP INPUT */}
//         <div className="hidden md:flex flex-col items-center">
//           <input
//             ref={inputRef}
//             type="tel"
//             maxLength={requiredLength}
//             value={passcode.join("")}
//             onChange={handleChange}
//             className="absolute opacity-0 pointer-events-none"
//           />
//           <Button
//             onClick={handleSubmit}
//             disabled={!isComplete || loading}
//             className={`px-10 py-2 rounded-full mt-4 ${
//               isComplete ? "bg-primaryblue text-white" : "bg-blue-100 text-gray-400"
//             }`}
//           >
//             {loading ? "Processing..." : step === "otp" ? "Verify OTP" : "Continue"}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EnterPasscode;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { ArrowLeft2, PasswordCheck } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { showDanger } from "@/components/ui/toast";
import { verifyPasscode } from "@/api/authApi";

interface EnterPasscodeProps {
  // onSuccess is the function passed from SendFlow that handles the API transfer
  onSuccess: (code: string) => Promise<void> | void;
}

const EnterPasscode: React.FC<EnterPasscodeProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);
  
  const [passcode, setPasscode] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const requiredLength = 4;
  const isComplete = passcode.length === requiredLength;

  // 1. Add this useEffect to keep focus locked
useEffect(() => {
  const keepFocus = () => inputRef.current?.focus();
  
  // Focus on mount
  keepFocus();

  // Re-focus if the user clicks anywhere on the passcode screen
  window.addEventListener("click", keepFocus);
  return () => window.removeEventListener("click", keepFocus);
}, []);

  const handleNumberClick = (num: string) => {
    if (passcode.length < requiredLength) setPasscode((prev) => [...prev, num]);
  };

  const handleDelete = () => setPasscode((prev) => prev.slice(0, -1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, requiredLength);
    setPasscode(value.split(""));
  };

  const handleSubmit = async () => {
    if (!isComplete || !token) return;

    setLoading(true);
    try {
      // 1. Verify the passcode first
      const verifyRes = await verifyPasscode({
        token: token,
        passcode: passcode.join("")
      });
      // 2. Check backend response (adjust based on your API's success key)
      if (verifyRes?.isSuccess || verifyRes?.data?.isSuccess) {
        // 3. Execute the transaction logic from SendFlow
        await onSuccess(passcode.join(""));
        // Note: Success navigation is handled inside SendFlow.tsx's handlePasscodeSuccess
      } else {
        throw new Error("Incorrect passcode");
      }
    } catch (error: any) {
      // 1. Clear state
    setPasscode([]);
     showDanger(error.response?.data?.message || "Incorrect passcode.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when 4 digits are entered
  useEffect(() => {
    if (isComplete && !loading) {
      handleSubmit();
    }
  }, [passcode]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "←"],
  ];

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <div
        className="flex items-center cursor-pointer border rounded-full w-fit ml-6 p-2 mt-10 md:mt-0"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft2 size="16" color="black" />
      </div>

      <div className="min-h-screen flex flex-col items-center bg-white py-6 md:pt-16">
        <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <PasswordCheck color="#480355" size="32" variant="Bold" />
        </div>

        <p className="text-2xl font-extrabold mb-2 text-center">Enter Passcode</p>
        <p className="text-gray-500 mb-8 text-center px-4">
          Enter your 4-digit transaction PIN to authorize this transfer.
        </p>

        {/* Passcode Display Dots */}
        <div className="flex gap-4 mb-10">
          {Array.from({ length: requiredLength }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                passcode[i] ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* MOBILE KEYPAD */}
        <div className="md:hidden flex flex-col items-center w-full">
          <div className="grid grid-cols-3 gap-y-8 gap-x-12 text-2xl font-semibold mb-10">
            {keypad.flat().map((key, i) => (
              <div
                key={i}
                className="flex justify-center items-center h-12 w-12 rounded-full cursor-pointer active:bg-gray-100"
                onClick={() => {
                  if (key === "←") handleDelete();
                  else if (key) handleNumberClick(key);
                }}
              >
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP HIDDEN INPUT */}
        <div className="hidden md:block">
          <input
            ref={inputRef}
            type="tel"
            maxLength={requiredLength}
            value={passcode.join("")}
            onChange={handleChange}
            className="absolute opacity-0 pointer-events-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          className="w-[80%] md:w-auto md:px-20 py-3 rounded-full text-white bg-primaryblue"
        >
          {loading ? "Verifying..." : "Confirm Transaction"}
        </Button>
      </div>
    </>
  );
};

export default EnterPasscode;