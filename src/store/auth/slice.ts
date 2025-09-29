import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  token: AuthToken | null;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null, 
 user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: AuthToken; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const {  
  setCredentials,
  logout,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
