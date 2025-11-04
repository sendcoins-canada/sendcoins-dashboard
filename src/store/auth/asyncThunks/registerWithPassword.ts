import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerWithPassword as registerWithPasswordApi } from "@/api/authApi";
import type { RegisterRequest, RegisterResponse } from "@/types/onboarding";
import type { AuthToken, User } from "../slice";
import type { RootState } from "@/store";

interface RegisterThunkReturn {
  token: AuthToken;
  user: User;
}

/**
 * Async thunk for registering a new user with password
 * Automatically gathers registration data from registration slice
 */
export const registerWithPasswordThunk = createAsyncThunk<
  RegisterThunkReturn,
  { password: string },
  { state: RootState; rejectValue: string }
>(
  "auth/registerWithPassword",
  async ({ password }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { email, firstName, lastName, country, code } = state.registration;

      // Validate required fields
      if (!email || !firstName || !lastName || !country || !code) {
        return rejectWithValue(
          "Missing required registration information. Please complete all steps."
        );
      }

      const registrationData: RegisterRequest = {
        email,
        firstName,
        lastName,
        password,
        country,
        code,
      };

      const response: RegisterResponse = await registerWithPasswordApi(
        registrationData
      );

      const data = response.data;

      if (!data?.token) {
        return rejectWithValue("Invalid registration response from server");
      }

      // User object is constructed from registration data since API doesn't return it
      return {
        token: {
          azer_token: data.token.azer_token,
          expires_at: data.token.expires_at,
        },
        user: {
          oauth_id: 0, // Will be set when fetching full user profile
          useremail: email,
        },
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);
