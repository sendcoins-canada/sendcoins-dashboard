import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft2, User } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { TextInputField } from "@/components/ui/form"; // assuming you have a reusable InputField
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFirstName, setLastName, setDob, setBvn } from "@/store/registration/slice";

const PersonalInfo: React.FC = () => {
  const schema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    bvn: Yup.string().required("Bvn is required"),
    dob: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        {/* Back Button */}
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
           <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
              </div>

        {/* Form Section */}
        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#DDF4E4] p-2">
              <User size="32" color="#480355" variant="Bold" />
            </div>

            <h2 className="text-[28px] font-semibold">Tell us a bit about you</h2>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">
              Enter your full legal name and date of birth. We’ll use this to verify your identity later.
            </p>

            <Formik
              initialValues={{ firstName: "", lastName: "", dob: "", bvn: "" }}
              validationSchema={schema}
               onSubmit={(values) => {
                // ✅ Save to Redux
                dispatch(setFirstName(values.firstName));
                dispatch(setLastName(values.lastName));
                dispatch(setDob(values.dob));
                dispatch(setBvn(values.bvn));

                // ✅ Go to next step
                navigate("/password");
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-6 space-y-4 text-left">
                  <TextInputField
                    name="firstName"
                    placeholder="eg: Michael"
                    label="Firstname"
                  />

                  <TextInputField
                    name="lastName"
                    placeholder="eg: John"
                    label="Last name"
                  />
                  <TextInputField
                    name="bvn"
                    placeholder="eg: 1234567890"
                    label="Bvn"
                  />

                  <TextInputField
                    name="dob"
                    type="date"
                    label="Date of birth"
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#0647F7] hover:bg-[#2563EB] text-white"
                    disabled={isSubmitting}
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

export default PersonalInfo;
