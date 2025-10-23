import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/api/authApi";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { PasswordCheck, ArrowLeft2 } from "iconsax-react";

const confirmSchema = Yup.object({
  confirmPassword: Yup.string()
    .required("Confirm your password")
    .test("passwords-match", "Passwords must match", function(value) {
      const newPassword = localStorage.getItem("forgot_new_password");
      return value === newPassword;
    }),
});

const ForgotConfirmPassword: React.FC = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("forgot_email") || "";
  const newPassword = localStorage.getItem("forgot_new_password") || "";

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (res) => {
      const authHash = res?.data?.authHash;
      if (authHash) {
        localStorage.setItem("forgot_auth_hash", authHash);
      }
      showSuccess(res?.data?.message || "Code sent to your email");
      navigate("/forgot-password/otp");
    },
    onError: (err: any) => {
      showDanger(err?.message || "Failed to request password reset");
    },
  });

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        {/* Back Button */}
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
          <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
        </div>

        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">
              <PasswordCheck size="32" color="#480355" variant="Bold" />
            </div>
            <h2 className="text-[28px] font-semibold">Confirm your password</h2>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">Create a strong password so only you can access your account</p>

            <Formik
              initialValues={{ confirmPassword: "" }}
              validationSchema={confirmSchema}
              onSubmit={() => {
                // Automatically call API and navigate to OTP
                mutate({ email, newPassword });
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="mt-6 space-y-4 text-left">
                  <TextInputField name="confirmPassword" placeholder="Re-enter your new password" isPassword />
                  <Button 
                    type="submit" 
                    className={`w-full rounded-full py-3 font-medium ${
                      values.confirmPassword && values.confirmPassword === newPassword
                        ? "bg-[#0647F7] text-white hover:bg-[#0534CC]" 
                        : "bg-[#CDDAFE] text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={isSubmitting || isPending || !values.confirmPassword || values.confirmPassword !== newPassword}
                  >
                    {isPending ? "Sending code..." : "Create password"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotConfirmPassword;


