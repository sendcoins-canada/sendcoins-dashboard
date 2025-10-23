import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MessageQuestion, ArrowLeft2 } from "iconsax-react";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
});

const ForgotEmail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        {/* Back Button */}
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
          <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
        </div>

        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#D6F6DD] p-2">
              <MessageQuestion size="32" color="#480355" variant="Bold" />
            </div>
            <h2 className="text-[28px] font-semibold">Forgot password?</h2>
            <h2 className="text-[28px] font-semibold">Let's fix that.</h2>
            <p className="mt-4 text-[#8C8C8C] text-[15px]">Enter the email linked to your account. We'll send you a link to reset your password.</p>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={schema}
              onSubmit={(values) => {
                localStorage.setItem("forgot_email", values.email);
                navigate("/forgot-password/new");
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="mt-6 space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter your email</label>
                    <TextInputField name="email" placeholder="olivia@untitledui.com" />
                  </div>
                  <Button 
                    type="submit" 
                    className={`w-full rounded-full py-3 font-medium ${
                      values.email 
                        ? "bg-[#0647F7] text-white hover:bg-[#0534CC]" 
                        : "bg-[#CDDAFE] text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={isSubmitting || !values.email}
                  >
                    Continue
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotEmail;


