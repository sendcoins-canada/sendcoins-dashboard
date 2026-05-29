import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft2, Global } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { SelectField } from "@/components/ui/form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setCountry } from "@/store/registration/slice";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/api/authApi";
import { allCountries } from "@/data/countries";
import type { SelectOption } from "@/components/ui/select";


const Country: React.FC = () => {
  const schema = Yup.object({
    country: Yup.string().required("Select a country"),
  });
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  // Build grouped options: supported countries at top, then all others
  const options: SelectOption[] = React.useMemo(() => {
    const supportedCountries = data?.data || [];
    const supportedNames = new Set(supportedCountries.map((c) => c.country));

    // Supported countries group
    const supported: SelectOption[] = supportedCountries.map((c) => ({
      value: c.country,
      label: c.country,
      icon: <img
        src={c.flag}
        alt={c.country}
        className="w-5 h-5 mr-2 inline-block rounded-full"
      />,
    }));

    // Other countries from static list (excluding already-supported ones)
    const others: SelectOption[] = allCountries
      .filter((c) => !supportedNames.has(c.name))
      .map((c) => ({
        value: c.name,
        label: c.name,
        icon: <span className="w-5 h-5 mr-2 inline-block text-center leading-5">{c.flag}</span>,
      }));

    const result: SelectOption[] = [];

    if (supported.length > 0) {
      result.push({ value: "__supported__", label: "Supported Countries", isGroupHeader: true });
      result.push(...supported);
    }

    if (others.length > 0) {
      result.push({ value: "__others__", label: "All Countries", isGroupHeader: true });
      result.push(...others);
    }

    return result;
  }, [data]);

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col gap-10 mt-10">
        <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"  onClick={() => navigate(-1)}>
           <ArrowLeft2 size="16" color="black" className=""/><p className="text-sm font-semibold">Back</p>
              </div>

        <div className="grid place-items-center">
          <div className="text-center w-full max-w-sm px-4">
            <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-[#FAD1DA] p-2">
              <Global size="32" color="#480355" variant="Bold" />
            </div>

            <h1 className="text-[28px] font-semibold">Select your country</h1>
            <p className="mt-1 text-[#8C8C8C] text-[15px]">
              We'll personalize your experience based on where you are.            </p>

            <Formik
              initialValues={{ country: "Canada" }}
              validationSchema={schema}
              onSubmit={(values) => {
                dispatch(setCountry(values.country));
                navigate("/personal-info");
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-6 space-y-4">
                  <SelectField
                    name="country"
                    placeholder="Select country"
                    options={options}
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

export default Country;
