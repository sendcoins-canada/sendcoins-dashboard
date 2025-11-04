import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthToken, User } from "../slice";

interface GoogleLoginPayload {
  access_token: string;
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
  async ({ access_token }, { rejectWithValue }) => {
    try {
      if (!access_token) {
        return rejectWithValue("No access token provided");
      }

      const formData = new FormData();
      formData.append("accessToken", access_token);

      const response = await axios.post<GoogleLoginResponse>(
        "https://api.sendcoins.ca/auth/google",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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
