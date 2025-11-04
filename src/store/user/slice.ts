import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";
import { fetchUser } from "./asyncRequests/fetchUser";
import { submitSurveyThunk } from "./asyncThunks/submitSurvey";

type UserState = {
  user: User | null;
  loading: boolean;
  error?: string;
};

const initialState: UserState = {
  user: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });

    // Submit survey
    builder
      .addCase(submitSurveyThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(submitSurveyThunk.fulfilled, (state) => {
        state.loading = false;
        // Survey submission doesn't update user state
      })
      .addCase(submitSurveyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit survey answer";
      });
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
