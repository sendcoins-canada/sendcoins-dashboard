// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft2, PasswordCheck } from "iconsax-react";
// import { Button } from "@/components/ui/button";
// import Header from "@/components/onboarding/shared/Header";
// import { showSuccess, showDanger } from "@/components/ui/toast";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "@/store";
// import { changePasscodeThunk } from "@/store/auth/asyncThunks/changePasscode"; 


// const ChangePasscode: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading } = useSelector((state: RootState) => state.auth);
//   const [step, setStep] = useState<"current" | "new" | "confirm">("current");
//   const [passcode, setPasscode] = useState<string[]>([]);
//   const [currentCode, setCurrentCode] = useState<string[]>([]);
//   const [newCode, setNewCode] = useState<string[]>([]);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, [step]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/\D/g, "");
//     if (value.length > 4) value = value.slice(0, 4);
//     setPasscode(value.split(""));
//   };

//   const handleSubmit = async () => {
//     if (passcode.length !== 4) return;

//     if (step === "current") {
//       setCurrentCode(passcode);
//       setPasscode([]);
//       setStep("new");
//     } else if (step === "new") {
//       setNewCode(passcode);
//       setPasscode([]);
//       setStep("confirm");
//     } else if (step === "confirm") {
//       if (passcode.join("") === newCode.join("")) {
//         const result = await dispatch(changePasscodeThunk({
//           oldCode: currentCode.join(""),
//           newCode: newCode.join(""),
//         }));

//         if (changePasscodeThunk.fulfilled.match(result)) {
//           showSuccess(result.payload.message || "Passcode changed successfully!");
//           navigate("/dashboard/home");
//         } else {
//           showDanger("Failed to change passcode.");
//         }
//       } else {
//         showDanger("New PINs do not match.");
//         setPasscode([]);
//         setStep("new");
//       }
//     }
//   };
//   console.log({passcode, newCode, currentCode});
//   const isComplete = passcode.length === 4;

//   return (
//     <>
//       <Header />
//       <div
//         className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4 mt-4"
//         onClick={() => navigate(-1)}
//       >
//         <ArrowLeft2 size="16" color="black" />
//         <p className="text-sm font-semibold ml-1">Back</p>
//       </div>

//       <div className="min-h-screen flex flex-col items-center bg-white">
//         {/* Content */}
//         <div className="flex flex-col items-center text-center mt-20 px-4">
//           <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//             <PasswordCheck color="#480355" size="32" variant="Bold" />
//           </div>

//           <p className="text-2xl font-extrabold mb-2">
//             {step === "current"
//               ? "Enter your current passcode"
//               : step === "new"
//               ? "Enter new passcode"
//               : "Confirm new passcode"}
//           </p>
//           <p className="text-gray-500 mb-8">
//             {step === "current"
//               ? "Please confirm your identity before changing your PIN."
//               : step === "new"
//               ? "Enter a new 4-digit passcode."
//               : "Re-enter your new passcode to confirm."}
//           </p>

//           <input
//             ref={inputRef}
//             type="tel"
//             maxLength={4}
//             value={passcode.join("")}
//             onChange={handleChange}
//             className="absolute opacity-0 -z-10"
//             autoFocus
//           />

//           <div
//             className="flex gap-4 mb-10 px-4 md:px-0 cursor-pointer"
//             onClick={() => inputRef.current?.focus()}
//           >
//             {[0, 1, 2, 3].map((index) => (
//               <div
//                 key={index}
//                 className="md:w-6 md:h-6 w-4 h-4 flex items-center justify-center rounded-full bg-gray-100"
//               >
//                 {passcode[index] && (
//                   <div className="w-full h-full rounded-full bg-black"></div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <Button
//             onClick={handleSubmit}
//             disabled={!isComplete || loading}
//             className={`px-6 py-2 rounded-full ${
//               isComplete
//                 ? "bg-primaryblue text-white cursor-pointer"
//                 : "bg-blue-100 text-gray-400"
//             }`}
//           >
//             {loading
//               ? "Saving..."
//               : step === "confirm"
//               ? "Confirm"
//               : "Continue"}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChangePasscode;


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
  const { user, token } = useSelector((state: RootState) => state.auth); 
  const userSlice = useSelector((state: RootState) => state.user) as any;
    const userData = userSlice?.user?.data;
  const [step, setStep] = useState<FlowStep>("new");
  const [passcode, setPasscode] = useState<string[]>([]); // Current input buffer
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

          <h2 className="text-2xl font-extrabold mb-2">
            {step === "new" ? "Create New PIN" : step === "confirm" ? "Confirm New PIN" : "Verify OTP"}
          </h2>
          <p className="text-gray-500 mb-8">
            {step === "otp" ? `Enter the code sent to ${user?.useremail}` : "Choose a 4-digit PIN for your transactions."}
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
              <div key={index} className="w-10 h-10 border-b-2 border-gray-300 flex items-center justify-center">
                {passcode[index] ? <span className="text-xl font-bold">{step === "otp" ? passcode[index] : "●"}</span> : ""}
              </div>
            ))}
          </div>

          <Button
            onClick={handleFinalSubmit}
            disabled={!isComplete || loading}
            className="w-full max-w-xs rounded-full py-6"
          >
            {loading ? "Processing..." : step === "otp" ? "Verify & Save" : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPasscode;
