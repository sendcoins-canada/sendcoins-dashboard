
import Header from "./shared/Header";
import { Button } from "../ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputField } from "../ui/form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/api/authApi";
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/onboarding";
import { showDanger, showSuccess } from "../ui/toast";
import { useDispatch } from "react-redux";
import { setEmail } from "@/store/registration/slice";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import GoogleLoginButton from "../ui/GoogleLogin";
// import Logoblack from "../../assets/logoblack.svg"



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
      <div>
        {/* <div className="">            
        <img src={Logoblack} alt="logo" />
</div> */}
        <div className="mx-auto max-w-md space-y-6 ">
          <div className="space-y-1 text-center mx-auto bg-brand mb-6">
            <h3 className="text-4xl font-semibold  mb-4">Welcome to Sendcoins</h3>
            <p className="text-base text-[#8C8C8C]  md:w-[80%] mx-auto ">
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
                    className="w-full cursor-pointer bg-[#0647F7] hover:bg-[#2563EB] text-white"
                    disabled={isPending}
                    variant='primary'
                  >
                    {isPending ? "Verifying..." : "Continue"}
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
      <p className="text-center text-sm font-medium mb-8 text-[#262626]">By registering, you accept our Terms of use and Privacy</p>
    </div>
  );
};

export default Signup;
