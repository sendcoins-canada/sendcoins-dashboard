import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { showDanger, showSuccess } from "@/components/ui/toast";
import { PasswordCheck, ArrowLeft2 } from "iconsax-react";
import { requestPasswordResetThunk } from "@/store/auth/asyncThunks/requestPasswordReset";

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
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const email = localStorage.getItem("forgot_email") || "";
  const newPassword = localStorage.getItem("forgot_new_password") || "";

  const handleSubmitPasswordReset = async () => {
    const result = await dispatch(requestPasswordResetThunk({
      email,
      newPassword,
    }));

    if (requestPasswordResetThunk.fulfilled.match(result)) {
      const authHash = result.payload.authHash;
      if (authHash) {
        localStorage.setItem("forgot_auth_hash", authHash);
      }
      showSuccess(result.payload.message || "Code sent to your email");
      navigate("/forgot-password/otp");
    } else {
      showDanger(result.payload || "Failed to request password reset");
    }
  };

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
              onSubmit={handleSubmitPasswordReset}
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
                    disabled={isSubmitting || loading || !values.confirmPassword || values.confirmPassword !== newPassword}
                  >
                    {loading ? "Sending code..." : "Create password"}
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


