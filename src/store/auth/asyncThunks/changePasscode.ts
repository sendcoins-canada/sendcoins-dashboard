import { createAsyncThunk } from "@reduxjs/toolkit";
import { changePasscode as changePasscodeApi } from "@/api/authApi";
import type { RootState } from "@/store";

interface ChangePasscodePayload {
  oldCode: string;
  newCode: string;
}

interface ChangePasscodeReturn {
  message: string;
}

/**
 * Async thunk for changing user passcode
 * Automatically retrieves token from Redux auth.token state
 */
export const changePasscodeThunk = createAsyncThunk<
  ChangePasscodeReturn,
  ChangePasscodePayload,
  { state: RootState; rejectValue: string }
>(
  "auth/changePasscode",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token?.azer_token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in again.");
      }

      // API might need token - check if the API function accepts it
      const response = await changePasscodeApi({
        oldCode: payload.oldCode,
        newCode: payload.newCode,
      });

      return {
        message: response?.message || "Passcode changed successfully",
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to change passcode. Please try again.";
      return rejectWithValue(message);
    }
  }
);
