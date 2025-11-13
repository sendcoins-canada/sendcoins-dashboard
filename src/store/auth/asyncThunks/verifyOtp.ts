// @ts-ignore
import { createAsyncThunk } from "@reduxjs/toolkit";
import { verifyOtp as verifyOtpApi } from "@/api/authApi";
import type { VerifyOtpRequest, VerifyOtpResponse } from "@/types/onboarding";
import type { AuthToken, User } from "../slice";

interface VerifyOtpReturn {
  token?: AuthToken;
  user?: User | null;
  authHash?: string;
  purpose?: string;

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
  async (otpData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response: VerifyOtpResponse = await verifyOtpApi(otpData);
      const data = response.data;

      // Registration flow
      if (data.authHash) {
        return {
          authHash: data.authHash,
          purpose: data.purpose,
        };
      }

      // Login flow
      if (data.token) {
        return {
          token: {
            azer_token: data.token.azer_token,
            expires_at: data.token.expires_at,
          },
          user: null,
        };
      }

      // Neither login nor registration format
      return rejectWithValue("Invalid OTP response from server");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP code. Please try again.";

      //  Important: always `return` the rejectWithValue
      return rejectWithValue(message);
    }
  }
)

