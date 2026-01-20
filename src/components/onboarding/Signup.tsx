
import Header from "./shared/Header";
import { Button } from "../ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField } from "../ui/form";
import { useNavigate } from "react-router-dom";
import { showDanger, showSuccess } from "../ui/toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setEmail } from "@/store/registration/slice";
import { verifyEmailThunk } from "@/store/auth/asyncThunks/verifyEmail";
import { googleLoginThunk } from "@/store/auth/asyncThunks/googleLogin";
import GoogleLoginButton from "../ui/GoogleLogin";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const schema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const handleSignup = async (values: { email: string }) => {
    //   const storedPurpose = localStorage.getItem("purpose");
    //    const purpose: "login" | "registration" =
    // storedPurpose === "login" ? "login" : "registration";
    const result = await dispatch(verifyEmailThunk({ email: values.email, purpose: "registration" }));

    if (verifyEmailThunk.fulfilled.match(result)) {
        localStorage.setItem("purpose", "registration");
      dispatch(setEmail(values.email));
      showSuccess("Verification link sent! Please check your email.");
      navigate("/verify", { state: { email: values.email } });
    } else if (verifyEmailThunk.rejected.match(result)) {
      showDanger(result.payload || "Something went wrong, try again.");
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const { accessToken } = tokenResponse;

      if (!accessToken) {
        showDanger("No access token returned from Google");
        return;
      }

      const result = await dispatch(googleLoginThunk({ accessToken }));

      if (googleLoginThunk.fulfilled.match(result)) {
        showSuccess("Welcome to Sendcoins!");
        navigate("/dashboard/home");
      } else if (googleLoginThunk.rejected.match(result)) {
        showDanger(result.payload || "Google Sign-In failed. Please try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      showDanger("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <div>
        {/* <div className="">            
        <img src={Logoblack} alt="logo" />
</div> */}
        <div className="mx-auto max-w-md space-y-6 px-4">
          <div className="space-y-1 text-center mx-auto bg-brand mb-6">
            <h3 className="text-4xl font-semibold  mb-4">Welcome to Sendcoins</h3>
            <p className="text-base font-[300] text-[#8C8C8C]  md:w-[80%] mx-auto ">
              Move your money globally — fast, secure, and stress-free.{" "}
              <span className="font-semibold text-black">Sign in to get started.</span>
            </p>
          </div>

          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={schema}
            onSubmit={handleSignup}
          >
            {() => (
              <Form className="space-y-4 md:w-[80%] mx-auto">
                <TextInputField
                  name="email"
                  label="Enter your email"
                  placeholder="olivia@untitledui.com"
                />

                <div className="space-y-3 w-full">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer font-[400] bg-[#0647F7] hover:bg-[#2563EB] text-white"
                    disabled={loading}
                    variant='primary'
                  >
                    {loading ? "Verifying..." : "Continue"}
                  </Button>
                  <div className="relative text-center text-xs text-neutral-500">
                    <span className="px-2 bg-white relative z-10">or</span>
                    <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
                  </div>
                  {/* <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                  showDanger("Google Sign-In Failed");
                                }}
                                width={'full'}
                              /> */}
                  <GoogleLoginButton
                    onSuccess={handleGoogleSuccess}
                    onError={() => showDanger("Google Sign-In Failed")}
                  />

                </div>
                <p className="text-center text-sm text-[#8C8C8C]">Already have an account? <span className="text-black cursor-pointer" onClick={() => navigate('/login')}>Login</span></p>
              </Form>
            )}
          </Formik>
        </div>

      </div>
      <p className="text-center text-sm font-[400] mb-8 text-[#777777]">By registering, you accept our Terms of use and Privacy</p>
    </div>
  );
};

export default Signup;
