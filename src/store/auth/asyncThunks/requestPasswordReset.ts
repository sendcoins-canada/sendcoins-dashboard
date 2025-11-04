import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestPasswordReset as requestPasswordResetApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface RequestPasswordResetPayload {
  email: string;
  newPassword: string;
}

interface RequestPasswordResetReturn {
  authHash: string;
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
        newPassword: payload.newPassword,
      });

      if (!response?.data?.authHash) {
        return rejectWithValue("No authHash received from server");
      }

      return {
        authHash: response.data.authHash,
        message: response.data.message || "OTP sent to your email",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to request password reset. Please try again.";
      return rejectWithValue(message);
    }
  }
);
