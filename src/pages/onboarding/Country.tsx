import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowCircleLeft2, Global, PasswordCheck } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { SelectField } from "@/components/ui/form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCountry } from "@/store/registration/slice";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/api/authApi";


const Country: React.FC = () => {
  const schema = Yup.object({
    country: Yup.string().required("Select a country"),
  });
  const navigate = useNavigate()
    const dispatch = useDispatch();
     const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  // Map API response into options for SelectField
  const options =
    data?.data.map((c) => ({
      value: c.country, // unique key (or you can use c.country)
      label: c.country,
      icon:  <img
        src={c.flag} // <-- backend gives you full image URL
        alt={c.country}
        className="w-5 h-5 mr-2 inline-block rounded-full"
      /> // ✅ emoji flag
    })) || [];

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        <div className="flex items-center gap-2 text-[#57B5FF] cursor-pointer"  onClick={() => navigate(-1)}>
          <ArrowCircleLeft2 size="24" color="#57B5FF" className="md:ml-28 ml-6" />
          <p>Back</p>
        </div>

        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#FAD1DA] p-2">
              <Global size="32" color="#480355" variant="Bold" />
            </div>

            <h1 className="text-[28px] font-semibold">Select your country</h1>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">
We’ll personalize your experience based on where you are.            </p>

            <Formik
              initialValues={{ country: "" }}
              validationSchema={schema}
              onSubmit={(values) => {
                // ✅ Save to Redux
                dispatch(setCountry(values.country));

                // go to next step
                navigate("/personal-info");
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-6 space-y-4">
                  <SelectField
                    name="country"
                    // label="Country"
                    placeholder="Select country"
                    options={options}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#249FFF]"
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

export default Country;
