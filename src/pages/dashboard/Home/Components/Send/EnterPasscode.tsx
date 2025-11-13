import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { ArrowLeft2, PasswordCheck } from "iconsax-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { createPasscodeThunk } from "@/store/auth/asyncThunks/createPasscode";

interface EnterPasscodeProps {
  onSuccess?: () => void;
}

const EnterPasscode: React.FC<EnterPasscodeProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<"create" | "confirm">("create");
  const [passcode, setPasscode] = useState<string[]>([]);
  const [firstPasscode, setFirstPasscode] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreatePasscode = async (code: string) => {
    const result = await dispatch(createPasscodeThunk({ code }));
    if (createPasscodeThunk.fulfilled.match(result)) {
      showSuccess(result.payload.message || "Passcode created successfully!");
      onSuccess?.();
    } else {
      showDanger(result.payload || "Failed to create passcode.");
    }
  };

  const handleNumberClick = (num: string) => {
    if (passcode.length < 4) setPasscode((prev) => [...prev, num]);
  };

  const handleDelete = () => {
    setPasscode((prev) => prev.slice(0, -1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length > 4) value = value.slice(0, 4);
    setPasscode(value.split(""));
  };

  const handleSubmit = () => {
    if (passcode.length !== 4) return;

    if (step === "create") {
      setFirstPasscode(passcode);
      setPasscode([]);
      setStep("confirm");
    } else if (step === "confirm") {
      if (passcode.join("") === firstPasscode.join("")) {
        handleCreatePasscode(passcode.join(""));
        showSuccess("Passcode confirmed!");
        onSuccess?.();
      } else {
        showDanger("Code doesn't match");
        setPasscode([]);
        setStep("create");
      }
    }
  };

  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "←"],
  ];

  const isComplete = passcode.length === 4;

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  return (
    <>
<div className="hidden md:block">
              <Header />
            </div>           {/* Back button */}
        <div
          className="flex items-center cursor-pointer border rounded-full w-fit ml-6 p-2 mt-10 md:mt-0 "
          onClick={() => navigate(-1)}
        >
          <ArrowLeft2 size="16" color="black" />
        </div>
      <div className="min-h-screen flex flex-col items-center bg-white py-6 md:pt-16">
       

        {/* Icon */}
        <div className="bg-[#D6F6DD] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <PasswordCheck color="#480355" size="32" variant="Bold" />
        </div>

        {/* Title */}
        <p className="text-2xl font-extrabold mb-2 text-center">
          {step === "create" ? "Enter passcode" : "Confirm passcode"}
        </p>
        <p className="text-gray-500 mb-8 text-center px-4">
          {step === "create"
            ? "Enter your passcode to confirm payment"
            : "Re-enter your passcode to confirm."}
        </p>

        {/* Passcode Dots */}
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                passcode[i] ? "bg-black" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        {/* ✅ MOBILE LAYOUT: Numeric keypad */}
        <div className="md:hidden flex flex-col items-center">
          <div className="grid grid-cols-3 gap-18 text-2xl font-semibold mb-10">
            {keypad.flat().map((key, i) => (
              <div
                key={i}
                className={`flex justify-center items-center h-12 w-12 rounded-full mx-auto 
          transition-all duration-150 ${
                  key
                    ? "cursor-pointer active:bg-[#F5F5F5] transition-transform"
                    : ""
                }`}
                onClick={() => {
                  if (key === "←") handleDelete();
                  else if (key) handleNumberClick(key);
                }}
              >
                {key || ""}
              </div>
            ))}
          </div>

          {/* Make Payment button (mobile) */}
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            className={`w-[70%] py-3 rounded-full text-white transition ${
              isComplete
                ? "bg-primaryblue hover:bg-primaryblue/90"
                : "bg-blue-100 text-gray-400"
            }`}
          >
            {loading ? "Saving..." : "Make Payment"}
          </Button>
        </div>

        {/* DESKTOP LAYOUT: Hidden input method */}
        <div className="hidden md:flex flex-col items-center">
          <input
            ref={inputRef}
            type="tel"
            maxLength={4}
            value={passcode.join("")}
            onChange={handleChange}
            className="absolute opacity-0 pointer-events-none"
          />

          <Button
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            className={`px-6 py-2 rounded-full mt-4 ${
              isComplete
                ? "bg-primaryblue text-white cursor-pointer"
                : "bg-blue-100 text-gray-400"
            }`}
          >
            {loading ? "Saving..." : "Make Payment"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EnterPasscode;
