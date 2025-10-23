import React from "react";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { ArrowLeft2, PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyPasswordResetOtp, updatePasswordWithOtp } from "@/api/authApi";

const OTP_LENGTH = 6;

const ForgotVerifyOtp: React.FC = () => {
  const [values, setValues] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  // const [seconds, setSeconds] = React.useState(50);
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
  //   return () => clearInterval(t);
  // }, []);

  const onChange = (index: number, val: string) => {
    const only = val.replace(/\D/g, "").slice(-1);
    const next = values.slice();
    next[index] = only;
    setValues(next);
    if (only && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const code = values.join("");
  const authHash = localStorage.getItem("forgot_auth_hash") || "";

  const { mutateAsync: verifyMutate, isPending: isVerifying } = useMutation({
    mutationFn: verifyPasswordResetOtp,
  });

  const { mutateAsync: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updatePasswordWithOtp,
  });

  const submit = async () => {
    if (code.length !== OTP_LENGTH) {
      showDanger("Incorrect code. Please try again.");
      return;
    }
    try {
      const v = await verifyMutate({ authHash, otp: code });
      if (v?.data?.isSuccess) {
        const u = await updateMutate({ authHash, otp: code });
        if (u?.data?.isSuccess) {
          // Clear sensitive data
          localStorage.removeItem("forgot_email");
          localStorage.removeItem("forgot_new_password");
          localStorage.removeItem("forgot_auth_hash");
          showSuccess("Password updated. Please login.");
          navigate("/login");
          return;
        }
      }
      showDanger("Verification failed. Try again.");
    } catch (err: any) {
      showDanger(err?.message || "Failed to verify code");
    }
  };

  React.useEffect(() => {
    if (values.every((val) => val !== "")) {
      submit();
    }
  }, [values]);

  return (
    <>
      <Header />
      <div className="min-h-[75vh] flex flex-col gap-10 mt-10">
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
          <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
        </div>
        <div className=" grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">
              <PasswordCheck size="32" color="#480355" variant="Bold" className="text-black"/>
            </div>
            <h2 className="text-[28px] font-semibold">We sent you a code</h2>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">
              Enter the <span className="font-bold text-black">6-digit code</span> sent to your email.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              {values.map((v, i) => (
                <input
                  key={i}
                  ref={(el: HTMLInputElement | null) => { inputsRef.current[i] = el; }}
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  className="md:h-[72px] md:w-[66px] h-14 w-12 text-center font-bold text-3xl rounded-md focus:outline-none bg-[#F5F5F5] focus:ring-1 focus:ring-[#57B5FF] focus-within:bg-white"
                />
              ))}
            </div>

            <div className="mt-6">
              <Button 
                onClick={submit} 
                className={`w-full rounded-full py-3 font-medium ${
                  code.length === OTP_LENGTH
                    ? "bg-[#0647F7] text-white hover:bg-[#0534CC]" 
                    : "bg-[#CDDAFE] text-gray-400 cursor-not-allowed"
                }`}
                disabled={isVerifying || isUpdating || code.length !== OTP_LENGTH}
              >
                {isVerifying || isUpdating ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotVerifyOtp;


