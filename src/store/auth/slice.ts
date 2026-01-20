import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { loginWithPasswordThunk } from "./asyncThunks/loginWithPassword";
// import { googleLoginThunk } from "./asyncThunks/googleLogin";
// import { verifyEmailThunk } from "./asyncThunks/verifyEmail";
// import { verifyOtpThunk } from "./asyncThunks/verifyOtp";
// import { registerWithPasswordThunk } from "./asyncThunks/registerWithPassword";
// import { createPasscodeThunk } from "./asyncThunks/createPasscode";
// import { requestPasswordResetThunk } from "./asyncThunks/requestPasswordReset";
// import { verifyPasswordResetOtpThunk } from "./asyncThunks/verifyPasswordResetOtp";
// import { updatePasswordWithOtpThunk } from "./asyncThunks/updatePasswordWithOtp";
// import { changePasscodeThunk } from "./asyncThunks/changePasscode";
// import { resendOtpThunk } from "./asyncThunks/resendOtp";

export interface AuthToken {
  azer_token: string;
  expires_at: number;
}
export interface User {
   oauth_id: number;
  useremail: string;
  device?: string;
  // [key: string]: any; 
}

export interface Result {
  azer_id: number;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  token: AuthToken | null;
  user: User | null;
  result: Result | null
}

export interface AuthToken { azer_token: string; expires_at: number; }
export interface User { oauth_id: number; useremail: string; device?: string; }
export interface Result { azer_id: number; }

export interface AuthState {
  loading: boolean;
  token: AuthToken | null;
  user: User | null;
  result: Result | null;
  surveyIndex: number
}
function safeParse<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null; // handle undefined string
  try {
    return JSON.parse(item);
  } catch {
    return null; // fallback if JSON is invalid
  }
}

const initialState: AuthState = {
  loading: false,
  token: safeParse<AuthToken>("token"),
  user: safeParse<User>("user"),  
  result: safeParse<Result>("result"),
   error: null,
  message: null,
  surveyIndex: 0
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call this after Login or Registration success
    setCredentials: (state, action: PayloadAction<{ token: AuthToken; user: User; result?: Result }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.result = action.payload.result || null;

      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("azertoken", action.payload.token.azer_token);
      if (action.payload.result) {
        localStorage.setItem("result", JSON.stringify(action.payload.result));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.result = null;
      localStorage.clear();
    },
    setSurveyIndex: (state, action: PayloadAction<number>) => {
  state.surveyIndex = action.payload;
}
  },
});

export const { setCredentials, setLoading, logout, setSurveyIndex } = authSlice.actions;
export default authSlice.reducer;

// export const {  
//   setCredentials,
//   logout,
//   clearAuthState,
// } = authSlice.actions;

// export default authSlice.reducer;
