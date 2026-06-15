import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft2, User, Bank } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { updateProfile, requestFiatAccount } from "@/api/fiat";
import { showSuccess, showDanger } from "@/components/ui/toast";

const nameSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
});

const bvnSchema = Yup.object({
  bvn: Yup.string()
    .required("BVN is required")
    .matches(/^[0-9]{11}$/, "BVN must be exactly 11 digits"),
});

const SetupFiat: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);
  const [step, setStep] = useState<"name" | "bvn">("name");
  const [nameData, setNameData] = useState({ firstName: "", middleName: "", lastName: "" });
  const [loading, setLoading] = useState(false);

  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;

  const handleNameSubmit = (values: { firstName: string; middleName: string; lastName: string }) => {
    setNameData(values);
    setStep("bvn");
  };

  const handleVerifySubmit = async (values: { bvn: string }) => {
    setLoading(true);
    if (!token) {
      showDanger("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      // Step 1: Update profile with name and BVN
      await updateProfile({
        token,
        first_name: nameData.firstName,
        middle_name: nameData.middleName || undefined,
        last_name: nameData.lastName,
        bvn: values.bvn,
      });

      // Step 2: Request fiat account creation
      const result = await requestFiatAccount({ token });

      if (result.success) {
        if (result.data?.alreadyExists) {
          showSuccess("You already have a fiat account!");
        } else {
          showSuccess("Your fiat account has been created! Check your email for details.");
        }
        navigate("/dashboard/home");
      } else {
        showDanger(result.message || "Failed to create fiat account. Please try again.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.data?.message || error.response?.data?.message || "Something went wrong. Please try again.";
      showDanger(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="md:w-[50%] max-w-md py-8 px-4">
        {/* Back Button */}
        <div
          className="flex items-center cursor-pointer border rounded-full w-fit justify-center py-2 px-4 mb-8"
          onClick={() => (step === "bvn" ? setStep("name") : navigate("/dashboard/home"))}
        >
          <ArrowLeft2 size="16" color="black" />
          <p className="text-sm font-semibold ml-1">Back</p>
        </div>

        {step === "name" && (
          <div>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#DDF4E4] p-3">
                <User size="28" color="#480355" variant="Bold" />
              </div>
              <h2 className="text-2xl font-semibold">Verify your name</h2>
              <p className="mt-2 text-[#8C8C8C] text-sm">
                Your name must match the one on your BVN record. This is used to create your Naira account.
              </p>
            </div>

            <Formik
              initialValues={{
                firstName: userData?.first_name || "",
                middleName: userData?.middle_name || "",
                lastName: userData?.last_name || "",
              }}
              validationSchema={nameSchema}
              onSubmit={handleNameSubmit}
            >
              {() => (
                <Form className="space-y-4">
                  <TextInputField name="firstName" label="First name" placeholder="eg: Michael" />
                  <TextInputField name="middleName" label="Middle name (optional)" placeholder="eg: Adekunle" />
                  <TextInputField name="lastName" label="Last name" placeholder="eg: Johnson" />
                  <Button
                    type="submit"
                    className="w-full bg-[#0647F7] hover:bg-[#2563EB] text-white mt-4"
                  >
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {step === "bvn" && (
          <div>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#E8EDFF] p-3">
                <Bank size="28" color="#0647F7" variant="Bold" />
              </div>
              <h2 className="text-2xl font-semibold">Verify your identity</h2>
              <p className="mt-2 text-[#8C8C8C] text-sm">
                Your BVN is required to create a Nigerian Naira account. It will not be shared with third parties.
              </p>
            </div>

            <Formik
              initialValues={{ bvn: "" }}
              validationSchema={bvnSchema}
              onSubmit={(values) => handleVerifySubmit({ bvn: values.bvn })}
            >
              {() => (
                <Form className="space-y-4">
                  <TextInputField
                    name="bvn"
                    label="BVN (11 digits)"
                    placeholder="eg: 22345678901"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#0647F7] hover:bg-[#2563EB] text-white mt-4"
                    disabled={loading}
                  >
                    {loading ? "Setting up your account..." : "Set Up NGN Account"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SetupFiat;
