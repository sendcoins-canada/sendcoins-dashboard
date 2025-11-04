import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, verifyOtpQueryString } from "@/api/authApi";
import type { LoginRequest, LoginWithPasswordResponse } from "@/types/onboarding";

interface LoginThunkPayload extends LoginRequest {}

interface LoginThunkReturn {
  email: string;
  verifyOTPString: string;
  requiresOTP: boolean;
}

/**
 * Async thunk for logging in with email and password
 * Automatically handles the verifyOtpQueryString call
 */
export const loginWithPasswordThunk = createAsyncThunk<
  LoginThunkReturn,
  LoginThunkPayload,
  { rejectValue: string }
>(
  "auth/loginWithPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      // Step 1: Call login API
      const response: LoginWithPasswordResponse = await loginUser(credentials);

      // Step 2: Verify OTP query string
      const verifyRes = await verifyOtpQueryString(
        response.data.verifyOTPString
      );

      if (!verifyRes.data?.isSuccess) {
        return rejectWithValue("Failed to verify query string");
      }

      // Return data needed for OTP verification page
      return {
        email: credentials.email,
        verifyOTPString: response.data.verifyOTPString,
        requiresOTP: true,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);
