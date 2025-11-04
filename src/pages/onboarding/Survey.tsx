
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/onboarding/shared/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getActiveSurvey } from "@/api/authApi";
import { submitSurveyThunk } from "@/store/user/asyncThunks/submitSurvey";

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  question_options: string;
  is_required: boolean;
  question_order: number;
}

interface Survey {
  config_id: number;
  survey_title: string;
  survey_description: string;
  is_required: boolean;
  questions: Question[];
}

const Survey: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  // const [surveys, setSurveys] = useState<Survey[]>([]);
  const [allQuestions, setAllQuestions] = useState<Array<Question & { config_id: number; survey_title: string }>>([]);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await getActiveSurvey();
        const surveysData = Array.isArray(res.data) ? res.data : [res.data];
        // setSurveys(surveysData);
        console.log(surveysData)
        // Flatten all questions from all surveys
        const questions = surveysData.flatMap((survey: any) => 
          survey.questions.map((q: Question) => ({
            ...q,
            config_id: survey.config_id,
            survey_title: survey.survey_title
          }))
        );
        setAllQuestions(questions);
      } catch (err) {
        console.error("Failed to load surveys:", err);
      }
    };
    fetchSurveys();
  }, []);

  if (allQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading surveys...
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  const options = JSON.parse(currentQuestion.question_options);
  const questionKey = `${currentQuestion.config_id}-${currentQuestion.question_id}`;
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [questionKey]: option });
  };

  const handleNext = async () => {
    const currentAnswer = answers[questionKey];

    if (!currentAnswer && currentQuestion.is_required) {
      alert("Please select an answer");
      return;
    }

    // Submit current answer via Redux thunk
    const result = await dispatch(submitSurveyThunk({
      config_id: currentQuestion.config_id,
      question_id: currentQuestion.question_id,
      answer: currentAnswer,
    }));

    if (submitSurveyThunk.fulfilled.match(result)) {
      console.log("Answer submitted successfully");

      // Move to next question or finish
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, navigate to welcome
        navigate("/welcome");
      }
    } else {
      console.error("Failed to submit answer:", result.payload);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkipAll = () => {
    navigate('/cta');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center px-4">
        {/* Progress Bar */}
        <div className="w-full max-w-lg mt-8 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.survey_title}
          </h2>
          <h3 className="text-lg font-medium mb-6">
            {currentQuestion.question_text}
          </h3>

          <div className="flex flex-col gap-3 mb-8">
            {options.map((option: string, i: number) => {
              const isSelected = answers[questionKey] === option;
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
              disabled={currentQuestionIndex === 0}
              className="text-gray-500"
            >
              Back
            </Button>
            <div className="flex gap-4">
              <Button variant="secondary" className="bg-gray-100" onClick={handleSkipAll}>
                Skip All
              </Button>
              <Button 
                className="bg-blue-500 text-white" 
                onClick={handleNext} 
                disabled={loading || !answers[questionKey]}
              >
                {loading ? "Submitting..." : currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Survey;
