import { createAsyncThunk } from "@reduxjs/toolkit";
import { resendOtp as resendOtpApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface ResendOtpPayload {
  email: string;
}

interface ResendOtpReturn {
  message: string;
}

/**
 * Async thunk for resending OTP to user's email
 */
export const resendOtpThunk = createAsyncThunk<
  ResendOtpReturn,
  ResendOtpPayload,
  { state: RootState; rejectValue: string }
>(
  "auth/resendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await resendOtpApi(payload.email);

      return {
        message: response?.message || "OTP resent successfully!",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP. Please try again.";
      return rejectWithValue(message);
    }
  }
);
