import React, {useRef} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { ArrowCircleLeft2, Location, Lock1 } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/input"; // your custom Input component
import { toast } from "sonner";
import MetaMapVerify from "@/components/Metamap";
import Header from "@/components/onboarding/shared/Header";

// ✅ Validation schema
const AddressSchema = Yup.object().shape({
  street: Yup.string().required("Street address is required"),
  apartment: Yup.string(), // optional
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  province: Yup.string().required("Province is required"),
});

const Address: React.FC = () => {
  const navigate = useNavigate();
   const metamapRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-6 py-8">
      <Header />
      {/* Back */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-6 self-start md:ml-24 ml-6"
        onClick={() => navigate(-1)}
      >
        <ArrowCircleLeft2 size="24" color="black" />
        <p>Back</p>
      </div>

      {/* Content */}
      <div className="max-w-sm w-full text-center">
        {/* Icon */}
        <div className="bg-[#EDC7CF] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Location
 size="32"
 color="#480355"
 variant="Bold"
/>
        </div>

        {/* Title */}
        <p className="text-2xl font-extrabold mb-2">Where do you live</p>
        <p className="text-gray-500 mb-8">Enter your primary residence</p>

        {/* Formik Form */}
        <Formik
          initialValues={{
            street: "",
            apartment: "",
            city: "",
            postalCode: "",
            province: "",
            country: "Canada",
          }}
          validationSchema={AddressSchema}
          onSubmit={(values) => {
            console.log("Submitted values:", values);
            toast.success("Address saved successfully!");
            // navigate("/next-step"); // move to next step
            //  Trigger MetaMap SDK
        metamapRef.current?.click();

          }}
        >
          {() => (
            <Form className="flex flex-col gap-4 text-left">
              {/* Street */}
              <Field
                name="street"
                as={Input}
                placeholder="e.g. 123 King Street W"
              />
              <ErrorMessage
                name="street"
                component="div"
                className="text-red-500 text-xs ml-2"
              />

              {/* Apartment */}
              <Field
                name="apartment"
                as={Input}
                placeholder="Apartment / Unit / Suite (optional)"
              />

              {/* City */}
              <Field name="city" as={Input} placeholder="City" />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-xs ml-2"
              />

              {/* Postal Code */}
              <Field name="postalCode" as={Input} placeholder="Postal code" />
              <ErrorMessage
                name="postalCode"
                component="div"
                className="text-red-500 text-xs ml-2"
              />

              {/* Province */}
              <Field name="province" as={Input} placeholder="Province" />
              <ErrorMessage
                name="province"
                component="div"
                className="text-red-500 text-xs ml-2"
              />

              {/* Country (locked) */}
              <div className="flex items-center justify-between w-full rounded-full border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500">
                <div className="flex items-center gap-2">
                  <span>🇨🇦</span>
                  <span>Canada</span>
                </div>
                <Lock1
 size="12"
 color="#8C8C8C"
/>
              </div>

              {/* Continue Button */}
              <Button variant="primary" size="lg" className=" bg-[#249FFF] text-white cursor-pointer">
  Continue
</Button>
 {/* Hidden MetaMap button */}
          <metamap-button
            ref={metamapRef as React.RefObject<any>}
            clientid={import.meta.env.VITE_METAMAP_CLIENT_ID}
            flowId={import.meta.env.VITE_METAMAP_FLOW_ID}
            style={{ display: "none" }}
          ></metamap-button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Address;
