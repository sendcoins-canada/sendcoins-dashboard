import Header from "../../components/onboarding/shared/Header";
import { Button } from "../../components/ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextInputField,
  SelectField,
  PillCheckboxField,
} from "../../components/ui/form";

const Signup = () => {
  const schema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    country: Yup.string().required("Select a country"),
    reason: Yup.boolean().oneOf([true], "Please select this to continue"),
  });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-lg border border-blue-500 space-y-6 p-6">
        {/* <div className="space-y-1">
          <h2 className="text-xl font-semibold">Welcome to Sendcoins</h2>
          <p className="text-sm text-neutral-600">
            Move your money globally — fast, secure, and stress-free.{" "}
            <span className="font-semibold">Sign in to get started.</span>
          </p>
        </div> */}

        <Formik
          initialValues={{
            email: "",
            password: "",
            country: "",
            reason: false,
          }}
          validationSchema={schema}
          onSubmit={(values) => {
             
            console.log("submit", values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
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

              <SelectField
                name="country"
                label="Country"
                placeholder="Select country"
                options={[
                  { value: "ca", label: "Canada", icon: <span>🇨🇦</span> },
                  { value: "ng", label: "Nigeria", icon: <span>🇳🇬</span> },
                ]}
              />

              <PillCheckboxField
                name="reason"
                pillLabel="Sending money to family/friends"
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
                <div className="relative text-center text-xs text-neutral-500">
                  <span className="px-2 bg-white relative z-10">or</span>
                  <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
                </div>
                <Button type="button" variant="outline" className="w-full">
                  Continue with Google
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
