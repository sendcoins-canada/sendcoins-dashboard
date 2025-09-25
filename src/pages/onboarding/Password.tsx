
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowCircleLeft2, PasswordCheck } from "iconsax-react";
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

const Password: React.FC = () => {
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [tempPassword, setTempPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Grab registration data from redux
  const { email, firstName, lastName, country, code } = useSelector(
    (state: any) => state.registration
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
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  // ✅ Register mutation
  const { mutate, isPending } = useMutation<
    RegisterResponse,
    Error,
    RegisterRequest
  >({
    mutationFn: registerWithPassword,
    onSuccess: () => {
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
        <div
          className="flex items-center gap-2 text-[#57B5FF] cursor-pointer"
          onClick={() =>
            step === "confirm" ? setStep("create") : navigate(-1)
          }
        >
          <ArrowCircleLeft2 size="24" color="#57B5FF" className="md:ml-28 ml-6" />
          <p>Back</p>
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
              {({ isSubmitting }) => (
                <Form className="mt-6 space-y-4 text-left">
                  {step === "create" ? (
                    <>
                      <h1 className="text-[28px] font-semibold">Setup your password</h1>
                      <p className="mt-1 text-[#8C8C8C] text-[15px]">
                        Create a strong password so only you can access your account
                      </p>

                      <TextInputField
                        name="password"
                        label="Password"
                        placeholder="Enter password"
                        isPassword
                      />

                      {/* Password Rules */}
                      <div className="text-sm text-[#8C8C8C] space-y-2 mt-2">
                        <p className="flex items-center gap-2">
                          <span className="text-purple-500">●</span> Must be at least 8 characters
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-purple-500">●</span> A mix of uppercase and lowercase letters
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-purple-500">●</span> At least one number
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-purple-500">●</span> A symbol (like ! or @)
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#249FFF]"
                        disabled={isSubmitting}
                      >
                        Create password
                      </Button>
                    </>
                  ) : (
                    <>
                      <h1 className="text-[28px] font-semibold">Confirm your password</h1>
                      <p className="mt-1 text-[#8C8C8C] text-[15px]">
                        Re-enter your password to confirm
                      </p>

                      <TextInputField
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        isPassword
                      />

                      <Button
                        type="submit"
                        className="w-full bg-[#249FFF]"
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
