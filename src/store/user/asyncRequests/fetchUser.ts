import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/user";
import type { RootState } from "@/store";
import api from "@/api/axios";

/**
 * Async thunk for fetching user profile
 * Automatically retrieves token from Redux auth state
 */
export const fetchUser = createAsyncThunk<
  User,
  void,
  { state: RootState; rejectValue: string }
>(
  "user/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token?.azer_token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("token", token);

      const response = await api.post<User>(
        "/user/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user profile.";
      return rejectWithValue(message);
    }
  }
);
