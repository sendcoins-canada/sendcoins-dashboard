import { createAsyncThunk } from "@reduxjs/toolkit";
import { verifyEmail as verifyEmailApi } from "@/api/authApi";
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/onboarding";

interface VerifyEmailReturn {
  email: string;
  message: string;
}

/**
 * Async thunk for verifying email during signup
 * Sends verification OTP to user's email
 */
export const verifyEmailThunk = createAsyncThunk<
  VerifyEmailReturn,
  VerifyEmailRequest,
  { rejectValue: string }
>(
  "auth/verifyEmail",
  async (emailData, { rejectWithValue }) => {
    try {
      const response: VerifyEmailResponse = await verifyEmailApi(emailData);

      if (!response?.isSuccess) {
        return rejectWithValue(
          response?.message || "Failed to send verification email"
        );
      }

      return {
        email: emailData.email,
        message: response.message || "Verification link sent!",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      return rejectWithValue(message);
    }
  }
);
