import React from "react";
import Header from "./shared/Header";
import { Button } from "../ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField, SelectField, PillCheckboxField } from "../ui/form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/api/authApi";
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/onboarding";
import { showDanger, showSuccess } from "../ui/toast";
import { useDispatch } from "react-redux";
import { setEmail } from "@/store/registration/slice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation<
    VerifyEmailResponse,
    Error,
    VerifyEmailRequest
  >({
    mutationFn: verifyEmail,

  });

  const schema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),

  });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-md space-y-6 mt-10">
        <div className="space-y-1 text-center mx-auto bg-brand mb-6">
          <h2 className="text-4xl font-semibold font-sans mb-4">Welcome to Sendcoins</h2>
          <p className="text-base text-neutral-600  md:w-[80%] mx-auto ">
            Move your money globally — fast, secure, and stress-free.{" "}
            <span className="font-semibold text-black">Sign in to get started.</span>
          </p>
        </div>

        <Formik
          initialValues={{
            email: "",
            // password: "",
            // country: "",
            // reason: false,
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            mutate({ email: values.email }, {
              onSuccess: () => {
                dispatch(setEmail(values.email));
                showSuccess("Verification link sent! Please check your email.");
                navigate("/verify", { state: { email: values.email } });
                localStorage.setItem("verifyEmail", values.email); // optional fallback
              },
              onError: (err) => {
                showDanger(err.message || "Something went wrong, try again.");
              },
            });
          }}

        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 md:w-[80%] mx-auto">
              <TextInputField
                name="email"
                label="Enter your email"
                placeholder="olivia@untitledui.com"
              />
              {/* <TextInputField
                name="password"
                label="Password"
                placeholder="Enter password"
                isPassword
              /> */}

              {/* <SelectField
                name="country"
                label="Country"
                placeholder="Select country"
                options={[
                  { value: "ca", label: "Canada", icon: <span>🇨🇦</span> },
                  { value: "ng", label: "Nigeria", icon: <span>🇳🇬</span> },
                ]}
              /> */}
              {/* 
              <PillCheckboxField
                name="reason"
                pillLabel="Sending money to family/friends"
              /> */}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-[#249FFF]"
                  disabled={isPending}
                  variant='primary'
                >
                  {isPending ? "Verifying..." : "Continue"}
                </Button>
                <div className="relative text-center text-xs text-neutral-500">
                  <span className="px-2 bg-white relative z-10">or</span>
                  <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "https://api.sendcoins.ca/auth/google"}
                >
                  Continue with Google
                </Button>

              </div>
              <p className="text-center text-sm text-[#8C8C8C]">Already have an account? <span className="text-black cursor-pointer" onClick={() => navigate('/login')}>Login</span></p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
