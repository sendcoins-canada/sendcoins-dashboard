// src/store/auth/slice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verifyEmail } from "@/api/authApi";
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/onboarding";

interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
};

export const verifyEmailThunk = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailRequest,
  { rejectValue: string }
>("auth/verifyEmail", async (payload, { rejectWithValue }) => {
  try {
    return await verifyEmail(payload);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Something went wrong");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        verifyEmailThunk.fulfilled,
        (state, action: PayloadAction<VerifyEmailResponse>) => {
          state.loading = false;
          state.message = action.payload.message;
        }
      )
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify email";
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
