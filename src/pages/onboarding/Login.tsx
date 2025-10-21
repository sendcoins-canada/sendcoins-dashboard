import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { loginUser, verifyOtpQueryString } from "@/api/authApi";
import type { LoginRequest, LoginWithPasswordResponse } from "@/types/onboarding";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
// import jwt_decode from "jwt_decode"
import axios, {AxiosError} from "axios";
import Header from "@/components/onboarding/shared/Header";
import { PasswordCheck } from "iconsax-react";
import GoogleLoginButton from "@/components/ui/GoogleLogin";


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


 const { mutate, isPending } = useMutation<
  LoginWithPasswordResponse,
  AxiosError<any>,
  LoginRequest
>({
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
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        showDanger(err.message || "Failed to verify query string.");
      } else {
        showDanger("Failed to verify query string.");
      }
    }
  },
  onError: (err) => {
    console.log(err);

    // ✅ AxiosError has `response` safely typed
    const message =
      err.response?.data?.data?.message || "Invalid credential, please try again.";

    showDanger(message);
  },
});

 const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse?.credential) {
      try {
        // 1. Decode the token (optional)
        // const decoded: any = jwtDecode(credentialResponse.credential);
        // console.log("Decoded Google user:", decoded);
 const formData = new FormData();
      formData.append("idToken", credentialResponse.credential);

        // 2. Send the token to your backend
        const res = await axios.post("https://api.sendcoins.ca/auth/google", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data?.data;

      // 3️⃣ If login successful
      if (data?.isSuccess) {
        // ✅ Save token object in localStorage
        localStorage.setItem(
          "token",
          JSON.stringify({
            azer_token: data.token?.azer_token,
            expires_at: data.token?.expires_at,
          })
        );

        // ✅ Optionally store additional info
        localStorage.setItem("user_email", data.result?.[0]?.useremail || "");
        localStorage.setItem("profilePicture", data.profilePicture || "");

        // ✅ Redirect to dashboard
        navigate("/dashboard/home");

        // Optional success message
        showSuccess(data.title || "Welcome back!");
      } else {
        showDanger(data?.message || "Google login failed. Please try again.");
      }
  
        // 3. Handle backend response (e.g. save session token, redirect)
        console.log("Backend response:", res.data);
      } catch (err) {
        console.error("Google login error:", err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
    <Header />
        <div className=" grid place-items-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center space-y-1 mb-6">
          <h3 className="text-[34px] font-semibold font-inter">Welcome back!</h3>
          <p className=" text-[#8C8C8C]">
            Move your money globally, fast, secure, and stress-free.{" "}
            <span className="font-medium text-black">Sign in to continue.</span>
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
          {() => (
            <Form className="space-y-3 w-full bg-primaryblue">
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
                startIcon={<PasswordCheck size={16} color="black"/>}
              />

              {/* <div className="flex items-center justify-between text-[11px]">
                <PillCheckboxField name="remember" pillLabel="" />
                <span className="text-neutral-500">Forgot password?</span>
              </div> */}

              <Button type="submit" className="w-full bg-[#0647F7] text-white hover:bg-[#2563EB]" disabled={isPending}>
                {isPending ? "Signing in..." : "Continue"}
              </Button>

              <div className="relative text-center text-xs text-primaryblue">
                <span className="px-2 bg-white relative z-10">or</span>
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
              </div>

              {/* <Button type="button" variant="outline" className="w-full" onClick={() => {
                // Redirect user to your backend which starts the Google OAuth flow
                window.location.href = `https://api.sendcoins.ca/auth/google`;
              }}>
                Continue with Google
              </Button> */}
              {/* <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  showDanger("Google Sign-In Failed");
                }}
              /> */}
              <GoogleLoginButton
  onSuccess={handleGoogleSuccess}
  onError={() => showDanger("Google Sign-In Failed")}
/>

              <p className="text-center text-[11px] text-neutral-500 ">
                Don’t have an account?{" "}
                <span className="font-bold cursor-pointer" onClick={() => navigate('/signup')}>Create an account</span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>

    <p className="text-center text-sm font-medium mb-8 text-[#262626]">By registering, you accept our Terms of use and Privacy</p>
    </div>
  );
};

export default Login;
