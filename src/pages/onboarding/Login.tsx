import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { loginWithPasswordThunk } from "@/store/auth/asyncThunks/loginWithPassword";
// import { googleLoginThunk } from "@/store/auth/asyncThunks/googleLogin";
import Header from "@/components/onboarding/shared/Header";
import { PasswordCheck } from "iconsax-react";
import GoogleLoginButton from "@/components/ui/GoogleLogin";
import { setCredentials } from "@/store/auth/slice";
import api from "@/api/axios";

const schema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (values: { email: string; password: string }) => {
     if (!values.email || !values.password) {
    showDanger("Email and password are required");
    return;
  }
    const result = await dispatch(loginWithPasswordThunk(values));

    if (loginWithPasswordThunk.fulfilled.match(result)) {
      localStorage.setItem("purpose", "login");
      showSuccess("Check your mail for the verification code");
      navigate("/verify", { state: { email: result.payload.email, purpose: "login" } });
    } else if (loginWithPasswordThunk.rejected.match(result)) {
      showDanger(result.payload || "Invalid email or password, please try again.");
      console.log(result)
    }
  };


const handleGoogleSuccess = async (tokenResponse: any) => {
  try {
    const { access_token } = tokenResponse;
    if (!access_token) {
      showDanger("No access token returned from Google");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("accessToken", access_token);

    // Send FormData to backend
    const { data } = await api.post("/auth/google", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.data.token) {
      dispatch(setCredentials({
        token: data.data.token,
        user: data.data.result,
        result: data.data.result
      }));
      showSuccess("Welcome back!");
      navigate("/dashboard/home");
    } else {
      showDanger("Google Sign-In failed. No token returned.");
    }
  } catch (err) {
    console.error("Google login error:", err);
    showDanger("Google Sign-In failed. Please try again.");
  }
};



  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <div className=" grid place-items-center ">
        <div className="w-full max-w-sm px-4">
          <div className="text-center space-y-1 mb-6">
            <h3 className="text-[34px] font-semibold font-inter">
              Welcome back!
            </h3>
            <p className=" text-[#8C8C8C]">
              Move your money globally, fast, secure, and stress-free.{" "}
              <span className="font-medium text-black">
                Sign in to continue.
              </span>
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
              remember: false,
            }}
            validationSchema={schema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form className="space-y-3 w-full">
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
                  startIcon={<PasswordCheck size={16} color="black" />}
                />

                <div className="flex items-center justify-between text-sm">
                  {/* <span /> */}
                  <span
                    className="text-black font-bold cursor-pointer"
                    onClick={() => navigate("/forgot-password/email")}
                  >
                    Forgot password?
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0647F7] text-white hover:bg-[#2563EB]"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Continue"}
                </Button>

                <div className="relative text-center text-[#777777] mb-4">
                  <span className="px-2 bg-white relative z-10">or</span>
                  <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
                </div>

              </Form>
            )}
          </Formik>
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={() => showDanger("Google Sign-In Failed")}
                />

                <p className="text-center text-sm text-[#777777] mt-4">
                  Don’t have an account?{" "}
                  <span
                    className="font-bold cursor-pointer text-primary"
                    onClick={() => navigate("/signup")}
                  >
                    Create an account
                  </span>
                </p>
        </div>
      </div>
      <div />
<div />
    </div>
  );
};

export default Login;
