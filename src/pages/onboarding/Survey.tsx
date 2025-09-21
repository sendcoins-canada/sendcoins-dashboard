
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { ArrowCircleLeft2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { getActiveSurvey, submitSurvey } from "@/api/authApi";
import type { SurveyResponse } from "@/types/onboarding";

const Survey: React.FC = () => {
  const [step, setStep] = useState(1);
   const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [survey, setSurvey] = useState<SurveyResponse["data"] | null>(null);
    const navigate = useNavigate()

 
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await getActiveSurvey();
        setSurvey(res.data);
      } catch (err) {
        console.error("Failed to load survey:", err);
      }
    };
    fetchSurvey();
  }, []);

  if (!survey) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading survey...
      </div>
    );
  }

  const options = JSON.parse(survey.question.question_options);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers,  [survey.question.question_id]: option });
  };


  const handleNext = async () => {
    try {
      setLoading(true);
       const email = localStorage.getItem("verifyEmail") || "";
    const azerid = localStorage.getItem("azerid") || "";

      const payload = {
        email: email, // TODO: replace with actual logged-in user email
        // azerid: azerid, 
        config_id: survey.config_id,
        question_id: survey.question.question_id,
        answer: answers[survey.question.question_id],
      };

      await submitSurvey(payload);

      console.log("Survey submitted:", payload);
      navigate("/welcome");
    } catch (err) {
      console.error("Failed to submit survey:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col items-center ">
          {/* <div
                  className="flex items-center gap-2 text-[#57B5FF] cursor-pointer"
                 
                >
                  <ArrowCircleLeft2 size="24" color="#57B5FF" className="ml-28" />
                  <p>Back</p>
                </div> */}
      {/* Progress bar */}
      {/* <div className="w-1/2 mb-8">
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / questions.length) * 100}%` }}
          ></div>
        </div>
      </div> */}

      {/* Question */}
      <div className="text-center max-w-lg">
        <h2 className="text-xl font-semibold mb-6">
       {survey.survey_title}
               </h2>
          <h3 className="text-lg font-medium mb-6">
            {survey.question.question_text}
          </h3>

        <div className="flex flex-col gap-3 mb-8">
          {options.map((option: string, i: number) => {
            const isSelected =  answers[survey.question.question_id] === option;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-500"
                    : "border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {/* Radio circle */}
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>

                {/* Option text */}
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-between w-full max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-gray-500"
          >
            Back
          </Button>
          <div className="flex gap-4">
            <Button variant="secondary" className="bg-gray-100" onClick={() => navigate('/cta')}>
              Skip
            </Button>
            <Button className="bg-blue-500 text-white" onClick={handleNext}>
  Finish
              </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Survey;
