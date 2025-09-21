import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField, PillCheckboxField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { loginUser, verifyOtpQueryString } from "@/api/authApi";
import type { LoginRequest, LoginWithPasswordResponse } from "@/types/onboarding";
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt_decode"
import axios from "axios";

const schema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});
const Login: React.FC = () => {
  const navigate = useNavigate()


  const { mutate, isPending } = useMutation<LoginWithPasswordResponse, Error, LoginRequest>(
    {
      mutationFn: loginUser,
      onSuccess: async (res, variables) => {
        try {
          // Save email and queryString for later use
          localStorage.setItem("email", variables.email);
          localStorage.setItem("verifyOTPString", res?.data?.verifyOTPString);

          // Call verifyOtpQueryString first
          const verifyRes = await verifyOtpQueryString(res?.data?.verifyOTPString);

          if (verifyRes?.data?.isSuccess) {
            showSuccess(verifyRes.data.message || "Check your mail for the code");
            navigate("/verify", { state: { fromQueryString: true } });
          } else {
            showDanger("Failed to verify query string.");
          }
        } catch (err: any) {
          showDanger(err.message || "Failed to verify query string.");
        }
      },
      onError: (err: any) => {
        showDanger(err.message || "Invalid credentials, please try again.");
      },
    }
  );

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      try {
        // 1. Decode the token (optional)
        // const decoded: any = jwtDecode(credentialResponse.credential);
        // console.log("Decoded Google user:", decoded);

        // 2. Send the token to your backend
        const res = await axios.post("https://api.sendcoins.ca/auth/google", {
          token: credentialResponse.credential,
        });

        // 3. Handle backend response (e.g. save session token, redirect)
        console.log("Backend response:", res.data);
      } catch (err) {
        console.error("Google login error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-[28px] font-semibold">Welcome back!</h1>
          <p className=" text-neutral-500">
            Move your money globally, fast, secure, and stress-free.{" "}
            <span className="font-medium">Sign in to continue.</span>
          </p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
            remember: false,
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <TextInputField
                name="email"
                label="Enter your email"
                placeholder="olivia@untitledui.com"
              />
              <TextInputField
                name="password"
                label="Password"
                placeholder="Enter password"
                isPassword
              />

              {/* <div className="flex items-center justify-between text-[11px]">
                <PillCheckboxField name="remember" pillLabel="" />
                <span className="text-neutral-500">Forgot password?</span>
              </div> */}

              <Button type="submit" className="w-full bg-[#249FFF]" disabled={isPending}>
                {isPending ? "Signing in..." : "Continue"}
              </Button>

              <div className="relative text-center text-xs text-neutral-500">
                <span className="px-2 bg-white relative z-10">or</span>
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={() => {
                // Redirect user to your backend which starts the Google OAuth flow
                window.location.href = `https://api.sendcoins.ca/auth/google`;
              }}>
                Continue with Google
              </Button>
              {/* <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  showDanger("Google Sign-In Failed");
                }}
              /> */}

              <p className="text-center text-[11px] text-neutral-500">
                Don’t have an account?{" "}
                <span className="font-bold cursor-pointer" onClick={() => navigate('/signup')}>Create an account</span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
