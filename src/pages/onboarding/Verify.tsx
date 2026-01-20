import React from "react";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { ArrowLeft2 } from "iconsax-react";
import { PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setAuthHash } from "@/store/registration/slice";
import { setCredentials, setLoading } from "@/store/auth/slice";
// import { verifyOtpThunk } from "@/store/auth/asyncThunks/verifyOtp";
import { resendOtpThunk } from "@/store/auth/asyncThunks/resendOtp";
import { verifyOtp, finalizePasscodeCreate } from "@/api/authApi";
import { useLocation } from "react-router-dom";

const OTP_LENGTH = 6;

const Verify: React.FC = () => {
  const [values, setValues] = React.useState<string[]>(() =>
    Array(OTP_LENGTH).fill("")
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, _setIsVerifying] = React.useState(false);
  const [seconds, setSeconds] = React.useState(50);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
const { purpose: statePurpose, tempPasscode } = location.state || {};

  const { loading } = useSelector((state: RootState) => state.auth);
  const isBusy = isVerifying || loading;

  // Get email from Redux with localStorage fallbacks
  const email = location.state?.email || JSON.parse(localStorage.getItem("user") || "{}")?.useremail
console.log(email)
  React.useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

const submit = async (overrideCode?: string) => {
  if (isBusy) return;
  const finalCode = overrideCode ?? values.join("");
  
  // 1. Dispatch the imported action
  dispatch(setLoading(true)); 
  // 1. Get the raw string from storage
  const rawPurpose = statePurpose || localStorage.getItem("purpose");

  // 2. Cast it to the specific type the API expects
  // Use "registration" as a fallback if the storage is empty
  const purpose = (rawPurpose || "registration") as "registration" | "login" | "passcode_reset" | "passcode_create";

  // const storedPurpose = localStorage.getItem("purpose") ;

  try {
    // 2. Call the API
    const response = await verifyOtp({ 
      email: email || "", // Fix: ensure string
      code: Number(finalCode), 
      purpose: purpose 
    });

    showSuccess("Verified!");

    // STEP 2: Handle different flows
    if (purpose === "passcode_create") {
      const authHash = response.data?.authHash;

      if (!authHash || !tempPasscode) {
        throw new Error("Missing session data. Please restart passcode setup.");
      }

      // STEP 3: Finalize Passcode Creation immediately
      const finalRes = await finalizePasscodeCreate(tempPasscode, authHash);
      
      showSuccess(finalRes.message || "Passcode created successfully!");
      navigate("/dashboard/home");

    } else if (purpose === "registration") {
      // Access authHash safely from the response structure described in your error
      const hash = response.data.authHash || ""; 
      
      dispatch(setAuthHash(hash));
      localStorage.setItem("authHash", hash);
      
      navigate("/country");
    } else {
      // 3. Login Flow: Use the structure TS told us exists
      if (response.data.token) {
        dispatch(setCredentials({
          token: response.data.token,
          user: { 
            useremail: email || "", 
            oauth_id: 0 
          }
        }));
        navigate("/dashboard/home");
      }
    }
  } catch (e: any) {
    showDanger(e.response?.data?.message || "Verification failed");
  } finally {
    dispatch(setLoading(false));
  }
};



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
