import React from "react";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { ArrowCircleLeft2 } from "iconsax-react";
import { PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp, verifyLoginOtp } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import type { VerifyOtpRequest, VerifyOtpResponse } from "@/types/onboarding";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { setCode } from "@/store/registration/slice";


const OTP_LENGTH = 6;

const Verify: React.FC = () => {
  const [values, setValues] = React.useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const [seconds, setSeconds] = React.useState(50);
      const navigate = useNavigate()
  const location = useLocation();
  const fromQueryString = (location.state as { fromQueryString?: boolean })?.fromQueryString || false;
// const email = (location.state as { email?: string })?.email || "";
//  const email = useSelector((state: RootState) => state.registration.email);
const email =
  useSelector((state: RootState) => state.registration.email) ||
  localStorage.getItem("email") ||
  "";

  React.useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const onChange = (index: number, val: string) => {
    const only = val.replace(/\D/g, "").slice(-1);
    const next = values.slice();
    next[index] = only;
    setValues(next);
    if (only && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const code = values.join("");
const dispatch = useDispatch()
  
  // ✅ React Query mutation for OTP verification
  const { mutate, isPending } = useMutation<any, Error,  { email: string; code: string }>({
    mutationFn: fromQueryString ? verifyLoginOtp : verifyOtp,
    onSuccess: () => {
       dispatch(setCode(code));
      showSuccess("Code verified!");
      if (fromQueryString) {
      navigate("/welcome");
    } else {
      navigate("/country");
    }
    },
    onError: (err) => {
      showDanger(err.message || "Invalid code. Please try again.");
    },
  });
  // resend
  const { mutate: resendMutate, isPending: isResending } = useMutation<
  { message: string },
  Error,
  string
>({
  mutationFn: resendOtp,
  onSuccess: (res) => {
    showSuccess(res.message || "OTP resent successfully!");
    setSeconds(50); // restart countdown
  },
  onError: (err) => {
    showDanger(err.message || "Failed to resend OTP, try again.");
  },
});


  const submit = () => {
    if (code.length !== OTP_LENGTH) {
      showDanger("Incorrect passcode. Please try again.");
      return;
    }
    mutate({ email, code });
    
  };
   //  Trigger submit automatically when all inputs are filled
  React.useEffect(() => {
    if (values.every((val) => val !== "")) {
      submit();
    }
  }, [values]);

  return (
    <>
    <Header />
    <div className="min-h-[75vh] flex flex-col gap-10 mt-10">
      <div className="flex items-center gap-2 cursor-pointer"  onClick={() => navigate(-1)}>
   <ArrowCircleLeft2 size="24" color="black" className="ml-28 "/><p className="">Back</p>
      </div>
    <div className=" grid place-items-center">
      
      <div className="text-center w-full max-w-sm px-4">
        <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">

          <PasswordCheck size="32" color="#480355" variant="Bold" className="text-black"/>
        </div>
        <h1 className="text-3xl font-semibold">We sent you a code</h1>
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
              className="h-[72px] w-[66px] text-center font-bold text-3xl rounded-md focus:outline-none bg-[#F5F5F5] focus:ring-1 focus:ring-[#57B5FF] focus-within:bg-white"
            />
          ))}
        </div>

        {/* <div className="mt-6">
          <Button onClick={submit} className="w-full">
            Verify
          </Button>
        </div> */}

        <div className="mt-6 text-[11px] text-neutral-500">
          Didn't get the email?
        </div>
        <div className="mt-2">
  <Button
    variant="outline"
    className="rounded-full px-4 py-2 text-xs cursor-pointer"
    disabled={seconds > 0 || isResending}
    onClick={() => {
      resendMutate(email);
      setValues(Array(OTP_LENGTH).fill("")); // clear OTP inputs after resend
    }}
  >
    {seconds > 0
      ? `Resend · 0:${seconds.toString().padStart(2, "0")}`
      : isResending
      ? "Resending..."
      : "Resend"}
  </Button>
</div>

      </div>
    </div>
    </div>
    </>
  );
};

export default Verify;
