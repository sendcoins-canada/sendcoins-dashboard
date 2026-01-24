
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TickCircle, ArrowLeft2, PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
// import { setPassword } from "@/store/registration/slice";
// import { registerWithPasswordThunk } from "@/store/auth/asyncThunks/registerWithPassword";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { registerWithPassword } from "@/api/authApi";
import { setCredentials, setLoading } from "@/store/auth/slice";

const Password: React.FC = () => {
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [tempPassword, setTempPassword] = useState("");
  const { email, firstName, lastName, country, authHash, bvn } = useSelector(
    (state: RootState) => state.registration
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.auth);

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

  // const handleRegistration = async () => {
  //   // Save password in Redux
  //   dispatch(setPassword(tempPassword));

  //   // Call registerWithPasswordThunk (automatically gets data from Redux)
  //   const result = await dispatch(registerWithPasswordThunk({ password: tempPassword }));

  //   if (registerWithPasswordThunk.fulfilled.match(result)) {
  //     showSuccess("Registration successful!");
  //     navigate("/survey");
  //   } else if (registerWithPasswordThunk.rejected.match(result)) {
  //     showDanger(result.payload || "Something went wrong, try again.");
  //   }
  // };

  const handleRegistration = async () => {
  // 1. Set global loading state (imported from your auth slice)
  dispatch(setLoading(true));

  try {
    // 2. Gather data from your registration slice
    const registrationData = {
      email,        // From useSelector
      firstName,    // From useSelector
      lastName,     // From useSelector
      country,      // From useSelector
      authHash,     // From useSelector (important!)
      bvn,
      password: tempPassword,
    };

    // 3. Call the API directly (not through a thunk)
    const response = await registerWithPassword(registrationData);

    // 4. Update Redux and LocalStorage using your Sync Action
    // This action handles the JSON.stringify for token, user, AND result
    dispatch(
      setCredentials({
        token: response.data.token,
        user: { 
          useremail: email || "", 
          oauth_id: response.data.user?.oauth_id 
        },
        result: { 
          azer_id: response.data.result?.azer_id || 0 
        },
      })
    );

    showSuccess("Registration successful!");
    navigate("/survey");
    
  } catch (error: any) {
    // Handle errors from the API directly
    const errorMsg = error.response?.data?.message || "Something went wrong, try again.";
    showDanger(errorMsg);
  } finally {
    // Turn off loading regardless of success or failure
    dispatch(setLoading(false));
  }
};

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
              onSubmit={async (values, { setSubmitting }) => {
                if (step === "create") {
                  // Save password temporarily in state
                  setTempPassword(values.password);
                  setStep("confirm");
                } else {
                  if (values.confirmPassword === tempPassword) {
                    await handleRegistration();
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
                        disabled={isSubmitting || loading}
                      >
                        {loading ? "Registering..." : "Confirm password"}
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
