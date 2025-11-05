import { createAsyncThunk } from "@reduxjs/toolkit";
import { verifyOtp as verifyOtpApi } from "@/api/authApi";
import type { VerifyOtpRequest, VerifyOtpResponse } from "@/types/onboarding";
import type { AuthToken, User } from "../slice";

interface VerifyOtpReturn {
  token: AuthToken;
  user: User;
}

/**
 * Async thunk for verifying OTP during signup flow
 * Used after email verification
 */
export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpReturn,
  VerifyOtpRequest,
  { rejectValue: string }
>(
  "auth/otp/verify",
  async (otpData, { rejectWithValue }) => {
    try {
      const response: VerifyOtpResponse = await verifyOtpApi(otpData);
      const data = response.data;

      if (!data?.token || !data?.result) {
        return rejectWithValue("Invalid OTP response from server");
      }

      return {
        token: {
          azer_token: data.token.azer_token,
          expires_at: data.token.expires_at,
        },
        user: data.result[0],
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Invalid OTP code. Please try again.";
      return rejectWithValue(message);
    }
  }
);
