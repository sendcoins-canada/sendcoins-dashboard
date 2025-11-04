import { createAsyncThunk } from "@reduxjs/toolkit";
import { verifyPasswordResetOtp as verifyPasswordResetOtpApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface VerifyPasswordResetOtpPayload {
  authHash: string;
  otp: string;
}

interface VerifyPasswordResetOtpReturn {
  isSuccess: boolean;
  message: string;
}

/**
 * Async thunk for verifying password reset OTP
 * Validates the OTP code sent to user's email
 */
export const verifyPasswordResetOtpThunk = createAsyncThunk<
  VerifyPasswordResetOtpReturn,
  VerifyPasswordResetOtpPayload,
  { state: RootState; rejectValue: string }
>(
  "auth/verifyPasswordResetOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyPasswordResetOtpApi({
        authHash: payload.authHash,
        otp: payload.otp,
      });

      if (!response?.data?.isSuccess) {
        return rejectWithValue("OTP verification failed");
      }

      return {
        isSuccess: response.data.isSuccess,
        message: response.data.message || "OTP verified successfully",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP. Please try again.";
      return rejectWithValue(message);
    }
  }
);
