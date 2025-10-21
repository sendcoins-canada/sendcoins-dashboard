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

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  token:
    storedToken && storedToken !== "undefined"
      ? JSON.parse(storedToken)
      : null,
  user:
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null,
};


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
