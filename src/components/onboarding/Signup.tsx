
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
import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
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
  
          // 2. Send the token to your backend
          const res = await axios.post("https://api.sendcoins.ca/user/auth/google/register", {
            googleProfile: credentialResponse.credential,
          });
  
          // 3. Handle backend response (e.g. save session token, redirect)
          console.log("Backend response:", res.data);
        } catch (err) {
          console.error("Google login error:", err);
        }
      }
    };

  return (
    <div className="relative ">
      <Header />
      {/* <div className="">            
        <img src={Logoblack} alt="logo" />
</div> */}
      <div className="mx-auto max-w-md space-y-6 md:mt-20 mt-10">
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
                  className="w-full cursor-pointer bg-[#0647F7] text-white"
                  disabled={isPending}
                  variant='primary'
                >
                  {isPending ? "Verifying..." : "Continue"}
                </Button>
                <div className="relative text-center text-xs text-neutral-500">
                  <span className="px-2 bg-white relative z-10">or</span>
                  <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
                </div>
                {/* <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "https://api.sendcoins.ca/auth/google"}
                >
                  Continue with Google
                </Button> */}
                 <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                  showDanger("Google Sign-In Failed");
                                }}
                              />

              </div>
              <p className="text-center text-sm text-[#8C8C8C]">Already have an account? <span className="text-black cursor-pointer" onClick={() => navigate('/login')}>Login</span></p>
            </Form>
          )}
        </Formik>
      </div>
        {/* <p className="absolute text-center bottom-0">By registering, you accept our Terms of use and Privacy</p> */}
    </div>
  );
};

export default Signup;
