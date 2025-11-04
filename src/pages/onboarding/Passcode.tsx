
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft2, PasswordCheck } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { createPasscodeThunk } from "@/store/auth/asyncThunks/createPasscode";

const SetupPasscode: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<"create" | "confirm">("create");
  const [passcode, setPasscode] = useState<string[]>([]);
  const [firstPasscode, setFirstPasscode] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // keep only digits
    if (value.length > 4) value = value.slice(0, 4);
    setPasscode(value.split(""));
  };

  const handleSubmit = async () => {
    if (passcode.length !== 4) return;

    if (step === "create") {
      setFirstPasscode(passcode);
      setPasscode([]);
      setStep("confirm");
    } else if (step === "confirm") {
      if (passcode.join("") === firstPasscode.join("")) {
        const result = await dispatch(createPasscodeThunk({ code: passcode.join("") }));

        if (createPasscodeThunk.fulfilled.match(result)) {
          showSuccess(result.payload.message || "Passcode created successfully!");
          navigate("/dashboard/home");
        } else if (createPasscodeThunk.rejected.match(result)) {
          showDanger(result.payload || "Failed to create passcode.");
        }
      } else {
        showDanger("Code doesn't match");
        setPasscode([]);
        setStep("create");
      }
    }
  };

  const isComplete = passcode.length === 4;

  return (
    <>
      <Header />
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
           <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
              </div>
      <div className="min-h-screen flex flex-col items-center bg-white">
        {/* Back button */}
        {/* <div
          className="flex items-center gap-2 cursor-pointer mt-6 self-start"
          onClick={() => navigate(-1)}
        >
          <ArrowCircleLeft2 size="24" color="black" className="md:ml-28 ml-6" />
          <p>Back</p>
        </div> */}
       

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-20 px-4">
          {/* Icon */}
          <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <PasswordCheck color="#480355" size="32" variant="Bold" />
          </div>

          {/* Title */}
          <p className="text-2xl font-extrabold mb-2">
            {step === "create" ? "Setup your passcode" : "Confirm your passcode"}
          </p>
          <p className="text-gray-500 mb-8">
            {step === "create"
              ? "Set a 4-digit passcode so you can send and receive money securely."
              : "Re-enter your passcode to confirm."}
          </p>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type="tel"
            maxLength={4}
            value={passcode.join("")}
            onChange={handleChange}
            className="absolute opacity-0 pointer-events-none"
          />

          {/* Visual passcode circles */}
          <div className="flex gap-4 mb-10 px-4 md:px-0">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="md:w-6 md:h-6 w-4 h-4 flex items-center justify-center rounded-full bg-gray-100"
              >
                {passcode[index] && (
                  <div className="w-full h-full rounded-full bg-black"></div>
                )}
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            className={`px-6 py-2 rounded-full ${
              isComplete
                ? "bg-blue-500 text-white cursor-pointer"
                : "bg-blue-100 text-gray-400"
            }`}
          >
             {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SetupPasscode;
