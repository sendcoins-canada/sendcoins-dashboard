import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePasswordWithOtp as updatePasswordWithOtpApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface UpdatePasswordWithOtpPayload {
  authHash: string;
  newPassword: string;
}

interface UpdatePasswordWithOtpReturn {
  isSuccess: boolean;
  message: string;
}

/**
 * Async thunk for resetting password
 * Uses authHash from OTP verification + new password to complete the reset
 */
export const updatePasswordWithOtpThunk = createAsyncThunk<
  UpdatePasswordWithOtpReturn,
  UpdatePasswordWithOtpPayload,
  { state: RootState; rejectValue: string }
>(
  "auth/updatePasswordWithOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updatePasswordWithOtpApi({
        authHash: payload.authHash,
        newPassword: payload.newPassword,
      });

      if (!response?.data?.isSuccess) {
        return rejectWithValue(response?.data?.message || "Password update failed");
      }

      return {
        isSuccess: response.data.isSuccess,
        message: response.data.message || "Password updated successfully",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.data?.message ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update password. Please try again.";
      return rejectWithValue(message);
    }
  }
);
