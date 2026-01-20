import { createAsyncThunk } from "@reduxjs/toolkit";
import { submitSurvey as submitSurveyApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface SubmitSurveyPayload {
  email: string;
  config_id: number;
  question_id: number;
  answer: string;
  azer_id: string | number; 
}

interface SubmitSurveyReturn {
  message: string;
}

/**
 * Async thunk for submitting survey answers
 * Automatically retrieves email from Redux auth.user state
 */
export const submitSurveyThunk = createAsyncThunk<
  SubmitSurveyReturn,
  SubmitSurveyPayload,
  { state: RootState; rejectValue: string }
>(
  "user/submitSurvey",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const email = state.auth.user?.useremail;

      if (!email) {
        return rejectWithValue("No user email found. Please log in again.");
      }

      const requestData = {
        email: payload.email,
        config_id: payload.config_id,
        question_id: payload.question_id,
        answer: payload.answer,
        azerId: payload.azer_id
      };

      const response = await submitSurveyApi(requestData);

      return {
        message: response.message || "Answer submitted successfully",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit answer. Please try again.";
      return rejectWithValue(message);
    }
  }
);
