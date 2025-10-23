import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TickCircle, PasswordCheck, ArrowLeft2 } from "iconsax-react";

const passwordSchema = Yup.object({
  password: Yup.string()
    .required("Input your password")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one symbol"),
});

const ForgotNewPassword: React.FC = () => {
  const [tempPassword, setTempPassword] = useState("");
  const navigate = useNavigate();

  const rules = [
    { test: tempPassword.length >= 8, label: "Must be at least 8 Char" },
    { test: /[A-Z]/.test(tempPassword) && /[a-z]/.test(tempPassword), label: "A mix of uppercase and lowercase letters" },
    { test: /\d/.test(tempPassword), label: "At least one number" },
    { test: /[@$!%*?&]/.test(tempPassword), label: "A symbol (like ! or @)" },
  ];

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
            <h2 className="text-[28px] font-semibold">Create new password</h2>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">Create a strong password so only you can access your account</p>

            <Formik
              initialValues={{ password: "" }}
              validationSchema={passwordSchema}
              onSubmit={(values) => {
                localStorage.setItem("forgot_new_password", values.password);
                navigate("/forgot-password/confirm");
              }}
            >
              {({ isSubmitting, values, handleChange }) => (
                <Form className="mt-6 space-y-4 text-left">
                  <TextInputField
                    name="password"
                    placeholder="Enter new password"
                    isPassword
                    startIcon={<PasswordCheck size={16} color="black" />}
                    className="text-left"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setTempPassword(e.target.value);
                    }}
                    value={values.password}
                  />

                  <div className="text-sm mt-2 space-y-2">
                    {rules.map((rule, idx) => (
                      <p key={idx} className="flex items-center gap-2">
                        {rule.test ? (
                          <TickCircle size={18} color="#9C51E1" variant="Bold" />
                        ) : (
                          <span className="w-4 h-4 border border-purple-400 rounded-full inline-block" />
                        )}
                        <span className={rule.test ? "text-gray-700 font-medium" : "text-[#8C8C8C]"}>{rule.label}</span>
                      </p>
                    ))}
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full rounded-full py-3 font-medium ${
                      tempPassword.length >= 8 && /[A-Z]/.test(tempPassword) && /[a-z]/.test(tempPassword) && /\d/.test(tempPassword) && /[@$!%*?&]/.test(tempPassword)
                        ? "bg-[#0647F7] text-white hover:bg-[#0534CC]" 
                        : "bg-[#CDDAFE] text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={isSubmitting || !(tempPassword.length >= 8 && /[A-Z]/.test(tempPassword) && /[a-z]/.test(tempPassword) && /\d/.test(tempPassword) && /[@$!%*?&]/.test(tempPassword))}
                  >
                    Create password
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

export default ForgotNewPassword;


