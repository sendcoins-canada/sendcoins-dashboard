import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestPasswordReset as requestPasswordResetApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface RequestPasswordResetPayload {
  email: string;
}

interface RequestPasswordResetReturn {
  message: string;
}

/**
 * Async thunk for requesting password reset
 * Sends OTP to user's email for password reset verification
 */
export const requestPasswordResetThunk = createAsyncThunk<
  RequestPasswordResetReturn,
  RequestPasswordResetPayload,
  { state: RootState; rejectValue: string }
>(
  "auth/requestPasswordReset",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await requestPasswordResetApi({
        email: payload.email,
      });

      if (!response?.data?.isSuccess) {
        return rejectWithValue(response?.data?.message || "Failed to send OTP");
      }

      return {
        message: response.data.message || "OTP sent to your email",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.data?.message ||
        error.response?.data?.message ||
        error.message ||
        "Failed to request password reset. Please try again.";
      return rejectWithValue(message);
    }
  }
);
