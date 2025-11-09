import React from "react";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { ArrowLeft2 } from "iconsax-react";
import { PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setCode } from "@/store/registration/slice";
import { verifyOtpThunk } from "@/store/auth/asyncThunks/verifyOtp";
import { resendOtpThunk } from "@/store/auth/asyncThunks/resendOtp";


const OTP_LENGTH = 6;

const Verify: React.FC = () => {
  const [values, setValues] = React.useState<string[]>(() =>
    Array(OTP_LENGTH).fill("")
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [seconds, setSeconds] = React.useState(50);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.auth);
  const isBusy = isVerifying || loading;

  // Get email from Redux with localStorage fallbacks
  const email =
    useSelector((state: RootState) => state.registration.email) ||
    localStorage.getItem("email") ||
    localStorage.getItem("verifyEmail") ||
    "";

  React.useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = React.useCallback(
    async (overrideCode?: string) => {
      if (isBusy) return;
      const finalCode = overrideCode ?? values.join("");
      if (finalCode.length !== OTP_LENGTH) {
        showDanger("Incorrect passcode. Please try again.");
        return;
      }

      setIsVerifying(true);
      console.time("verifyOtpRequest");
      // Retrieve purpose — ensure it's always a valid string
      const storedPurpose = localStorage.getItem("purpose");
      const purpose: "login" | "registration" =
        storedPurpose === "login" ? "login" : "registration";
      // Send purpose in the request
      try {
        const result = await dispatch(
          verifyOtpThunk({ email, code: finalCode, purpose })
        );

        if (verifyOtpThunk.fulfilled.match(result)) {
          dispatch(setCode(finalCode));
          showSuccess("Code verified!");

          if (purpose === "login") {
            navigate("/dashboard/home");
          } else {
            navigate("/country");
          }
        } else {
          showDanger("Invalid OTP code. Please try again.");
        }
      } catch (err) {
        showDanger("Something went wrong. Please try again.");
      } finally {
        console.timeEnd("verifyOtpRequest");
        setIsVerifying(false);
      }
    },
    [dispatch, email, isBusy, navigate, values]
  );

  const attemptSubmit = React.useCallback(
    (nextValues: string[]) => {
      if (isBusy) return;
      if (nextValues.every((val) => val !== "")) {
        submit(nextValues.join(""));
      }
    },
    [isBusy, submit]
  );

  const distributeValue = (startIndex: number, val: string) => {
    if (isBusy) return;
    const digits = val.replace(/\D/g, "");
    if (!digits) return;

    const next = values.slice();
    for (let offset = 0; offset < OTP_LENGTH - startIndex; offset += 1) {
      next[startIndex + offset] = digits[offset] ?? "";
    }
    setValues(next);

    const nextIndex = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();

    attemptSubmit(next);
  };

  const onChange = (index: number, val: string) => {
    if (isBusy) return;
    const digits = val.replace(/\D/g, "");

    if (digits.length <= 1) {
      const next = values.slice();
      next[index] = digits;
      setValues(next);
      if (digits && index < OTP_LENGTH - 1)
        inputsRef.current[index + 1]?.focus();
      attemptSubmit(next);
      return;
    }

    distributeValue(index, digits);
  };

  const onPaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (isBusy) return;
    const pasted = e.clipboardData.getData("text");
    distributeValue(index, pasted);
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isBusy) {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Resend OTP handler using Redux thunk
  const handleResendOtp = async () => {
    const result = await dispatch(resendOtpThunk({ email }));

    if (resendOtpThunk.fulfilled.match(result)) {
      showSuccess(result.payload.message || "OTP resent successfully!");
      setSeconds(50); // restart countdown
      setValues(Array(OTP_LENGTH).fill("")); // clear OTP inputs
    } else {
      showDanger("Failed to resend OTP, try again.");
    }
  };

  const resendLabel = React.useMemo(() => {
    if (seconds > 0) {
      return `Resend · 0:${seconds.toString().padStart(2, "0")}`;
    }
    if (loading && !isVerifying) {
      return "Resending...";
    }
    return "Resend";
  }, [isVerifying, loading, seconds]);

  return (
    <>
    <Header />
    <div className="min-h-[75vh] flex flex-col gap-10 mt-10">
      <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
   <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
      </div>
    <div className=" grid place-items-center">
      
      <div className="text-center w-full max-w-sm px-4">
        <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">

          <PasswordCheck size="32" color="#480355" variant="Bold" className="text-black"/>
        </div>
        <h2 className="text-[28px] font-semibold">We sent you a code</h2>
        <p className="mt-1 text-neutral-500">
          Check your inbox for a{" "}
          <span className="font-bold text-black">6-digit code</span> to verify your
          email.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el: HTMLInputElement | null) => {
                inputsRef.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={(e) => onPaste(i, e)}
              disabled={isBusy}
              className="md:h-[72px] md:w-[66px] h-14 w-12 text-center font-bold text-3xl rounded-md focus:outline-none bg-[#F5F5F5] focus:ring-1 focus:ring-[#57B5FF] focus-within:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            />
          ))}
        </div>

        {isBusy && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#57B5FF] border-t-transparent" />
            <span>Verifying code...</span>
          </div>
        )}

        {/* <div className="mt-6">
          <Button onClick={submit} className="w-full">
            Verify
          </Button>
        </div> */}

        <div className="mt-6 text-sm text-neutral-500">
          Didn't get the email?
        </div>
        <div className="mt-2">
  <Button
    variant="outline"
    className="rounded-full px-4 py-2 text-xs cursor-pointer"
    disabled={seconds > 0 || isBusy}
    onClick={handleResendOtp}
  >
    {resendLabel}
  </Button>
</div>

      </div>
    </div>
    </div>
    </>
  );
};

export default Verify;
