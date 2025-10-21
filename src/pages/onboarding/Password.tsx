
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TickCircle, ArrowLeft2, PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPassword } from "@/store/registration/slice";
import { useMutation } from "@tanstack/react-query";
import { registerWithPassword } from "@/api/authApi";
import type { RegisterRequest, RegisterResponse } from "@/types/onboarding";
import { showSuccess, showDanger } from "@/components/ui/toast"
import type { RootState } from "@/store";
import { setCredentials } from "@/store/auth/slice";

const Password: React.FC = () => {
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [tempPassword, setTempPassword] = useState("");
  // const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rules = [
    {
      test: tempPassword.length >= 8,
      label: "Must be at least 8 characters",
    },
    {
      test: /[A-Z]/.test(tempPassword) && /[a-z]/.test(tempPassword),
      label: "A mix of uppercase and lowercase letters",
    },
    { test: /\d/.test(tempPassword), label: "At least one number" },
    {
      test: /[@$!%*?&]/.test(tempPassword),
      label: "A symbol (like ! or @)",
    },
  ];

  // ✅ Grab registration data from redux
  const { email, firstName, lastName, country, code } = useSelector(
    (state: RootState) => state.registration
  );

  const passwordSchema = Yup.object({
    password: Yup.string()
      .required("Input your password")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one symbol"),
  });

  const confirmSchema = Yup.object({
    confirmPassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match")
  });

  // ✅ Register mutation
  const { mutate, isPending } = useMutation<
    RegisterResponse,
    Error,
    RegisterRequest
  >({
    mutationFn: registerWithPassword,
    onSuccess: (res) => {
      const { token } = res.data;

      // Save in Redux (no "user" object yet, so you can pass email + names)
      dispatch(
        setCredentials({
          token: {
            azer_token: token.azer_token,
            expires_at: token.expires_at,
          },
          user: {
            oauth_id: 0, // backend may not send this yet
            useremail: email,
            // firstName,
            // lastName,
            // country,
          },
        })
      );
      showSuccess(" Registration successful!");
      navigate("/welcome");
    },
    onError: (err) => {
      showDanger(err.message || "Something went wrong, try again.");
    },
  });

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        {/* Back Button */}
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() =>
          step === "confirm" ? setStep("create") : navigate(-1)
        }>
          <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
        </div>

        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">
              <PasswordCheck size="32" color="#480355" variant="Bold" />
            </div>

            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={step === "create" ? passwordSchema : confirmSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (step === "create") {
                  // Save password temporarily in state
                  setTempPassword(values.password);
                  setStep("confirm");
                } else {
                  if (values.confirmPassword === tempPassword) {
                    //  Save password in Redux
                    dispatch(setPassword(tempPassword));

                    // Call register endpoint with all data
                    mutate({
                      email,
                      firstName,
                      lastName,
                      password: tempPassword,
                      country,
                      code,
                    });
                  } else {
                    showDanger("Passwords do not match");
                  }
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, values, handleChange }) => (
                <Form className="mt-6 space-y-4 text-left">
                  {step === "create" ? (
                    <>
                      <div className="text-center">

                        <h2 className="text-[28px] font-semibold ">Setup your password</h2>
                        <p className="mt-1 text-[#8C8C8C] text-[15px]">
                          Create a strong password so only you can access your account
                        </p>
                      </div>

                      <TextInputField
                        name="password"
                        // label="Password"
                        placeholder="Enter password"
                        isPassword
                        startIcon={<PasswordCheck size={16} color="black" />}
                        className="text-left"
                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);          // ✅ updates Formik
        setTempPassword(e.target.value); // ✅ updates local validation
      }}
      value={values.password}
                      />

                      {/* Password Rules */}
                      
                      <div className="text-sm mt-2 space-y-2">
                        {rules.map((rule, idx) => (
                          <p key={idx} className="flex items-center gap-2">
                            {rule.test ? (
                              <TickCircle size={18} color="#9C51E1" variant="Bold" />
                            ) : (
                              <span className="w-4 h-4 border border-purple-400 rounded-full inline-block"></span>
                            )}
                            <span
                              className={
                                rule.test ? "text-gray-700 font-medium" : "text-[#8C8C8C]"
                              }
                            >
                              {rule.label}
                            </span>
                          </p>
                        ))}
                      </div>


                      <Button
                        type="submit"
                        className="w-full bg-[#0647F7] text-white hover:bg-[#2563EB]"
                        disabled={isSubmitting}
                      >
                        Create password
                      </Button>
                    </>
                  ) : (
                    <>
                    <div  className="text-center">

                      <h1 className="text-[28px] font-semibold">Confirm your password</h1>
                      <p className="mt-1 text-[#8C8C8C] text-[15px]">
                        Re-enter your password to confirm
                      </p>
                    </div>

                      <TextInputField
                        name="confirmPassword"
                        // label="Confirm Password"
                        placeholder="Re-enter password"
                                                startIcon={<PasswordCheck size={16} color="black" />}

                        isPassword
                      />

                      <Button
                        type="submit"
                        className="w-full bg-[#0647F7] text-white hover:bg-[#2563EB]"
                        disabled={isSubmitting}
                      >
                        {isPending ? "Registering..." : "Confirm password"}
                      </Button>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
