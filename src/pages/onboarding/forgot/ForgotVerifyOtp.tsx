import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { ArrowLeft2, PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { verifyPasswordResetOtpThunk } from "@/store/auth/asyncThunks/verifyPasswordResetOtp";
import { updatePasswordWithOtpThunk } from "@/store/auth/asyncThunks/updatePasswordWithOtp";

const OTP_LENGTH = 6;

const ForgotVerifyOtp: React.FC = () => {
  const [values, setValues] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

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

  const submit = async () => {
    if (code.length !== OTP_LENGTH) {
      showDanger("Incorrect code. Please try again.");
      return;
    }

    // First verify the OTP
    const verifyResult = await dispatch(verifyPasswordResetOtpThunk({
      authHash,
      otp: code,
    }));

    if (verifyPasswordResetOtpThunk.fulfilled.match(verifyResult)) {
      // If verification successful, update the password
      const updateResult = await dispatch(updatePasswordWithOtpThunk({
        authHash,
        otp: code,
      }));

      if (updatePasswordWithOtpThunk.fulfilled.match(updateResult)) {
        // Clear sensitive data
        localStorage.removeItem("forgot_email");
        localStorage.removeItem("forgot_new_password");
        localStorage.removeItem("forgot_auth_hash");
        showSuccess("Password updated. Please login.");
        navigate("/login");
      } else {
        showDanger(updateResult.payload || "Failed to update password");
      }
    } else {
      showDanger(verifyResult.payload || "Verification failed. Try again.");
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
                disabled={loading || code.length !== OTP_LENGTH}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotVerifyOtp;


