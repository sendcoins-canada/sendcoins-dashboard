import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import type { AuthToken, User } from "../slice";

interface GoogleLoginPayload {
  code: string;
}

interface GoogleLoginResponse {
  data: {
    isSuccess: boolean;
    title?: string;
    message?: string;
    token: {
      azer_token: string;
      expires_at: number;
    };
    result: Array<{
      oauth_id: number;
      useremail: string;
    }>;
    profilePicture?: string;
  };
}

interface GoogleLoginReturn {
  token: AuthToken;
  user: User;
  profilePicture?: string;
}

/**
 * Async thunk for Google OAuth login
 * Handles both login and signup flows
 */
export const googleLoginThunk = createAsyncThunk<
  GoogleLoginReturn,
  GoogleLoginPayload,
  { rejectValue: string }
>(
  "auth/googleLogin",
  async ({ code }, { rejectWithValue }) => {
    try {
      if (!code) {
        return rejectWithValue("No authorization code provided");
      }

      const response = await api.post<GoogleLoginResponse>(
        "/auth/google",
        { code }
      );

      const data = response.data?.data;

      if (!data?.isSuccess) {
        return rejectWithValue(
          data?.message || "Google login failed. Please try again."
        );
      }

      // Store profile picture separately (optional enhancement for user slice later)
      if (data.profilePicture) {
        localStorage.setItem("profilePicture", data.profilePicture);
      }

      return {
        token: {
          azer_token: data.token.azer_token,
          expires_at: data.token.expires_at,
        },
        user: {
          oauth_id: data.result[0].oauth_id,
          useremail: data.result[0].useremail,
        },
        profilePicture: data.profilePicture,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.data?.message ||
        error.message ||
        "Google Sign-In failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);
