import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPasscode as createPasscodeApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface CreatePasscodePayload {
  code: string;
}

interface CreatePasscodeReturn {
  message: string;
}

/**
 * Async thunk for creating a user passcode
 * Automatically retrieves token from Redux auth state
 */
export const createPasscodeThunk = createAsyncThunk<
  CreatePasscodeReturn,
  CreatePasscodePayload,
  { state: RootState; rejectValue: string }
>(
  "auth/createPasscode",
  async ({ code }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token?.azer_token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in again.");
      }

      const response = await createPasscodeApi({ code, token });

      return {
        message: response.message || "Passcode created successfully",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create passcode. Please try again.";
      return rejectWithValue(message);
    }
  }
);
