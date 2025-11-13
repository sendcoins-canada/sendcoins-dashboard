import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginWithPasswordThunk } from "./asyncThunks/loginWithPassword";
import { googleLoginThunk } from "./asyncThunks/googleLogin";
import { verifyEmailThunk } from "./asyncThunks/verifyEmail";
import { verifyOtpThunk } from "./asyncThunks/verifyOtp";
import { registerWithPasswordThunk } from "./asyncThunks/registerWithPassword";
import { createPasscodeThunk } from "./asyncThunks/createPasscode";
import { requestPasswordResetThunk } from "./asyncThunks/requestPasswordReset";
import { verifyPasswordResetOtpThunk } from "./asyncThunks/verifyPasswordResetOtp";
import { updatePasswordWithOtpThunk } from "./asyncThunks/updatePasswordWithOtp";
import { changePasscodeThunk } from "./asyncThunks/changePasscode";
import { resendOtpThunk } from "./asyncThunks/resendOtp";

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
      // Sync to localStorage for persistence across sessions
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      // Store azer_token separately for legacy API compatibility
      localStorage.setItem("azertoken", action.payload.token.azer_token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      // Clear all auth-related localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("azertoken");
      localStorage.removeItem("email");
      localStorage.removeItem("verifyEmail");
      localStorage.removeItem("user_email");
      localStorage.removeItem("verifyOTPString");
    },
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Verify email (signup flow)
    builder
      .addCase(verifyEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Store email for OTP verification page
        localStorage.setItem("verifyEmail", action.payload.email);
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send verification email";
      });

    // Login with password
    builder
      .addCase(loginWithPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Store email and verifyOTPString for OTP verification page
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("verifyOTPString", action.payload.verifyOTPString);
      })
      .addCase(loginWithPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // Google login
    builder
      .addCase(googleLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        // Sync to localStorage
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("azertoken", action.payload.token.azer_token);
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login failed";
      });

    // Verify OTP (signup flow)
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token ?? null;
        state.user = action.payload.user ?? null;
        // Sync to localStorage
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        // @ts-ignore
        localStorage.setItem("azertoken", action?.payload?.token.azer_token);
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "OTP verification failed";
      });

    // Verify login OTP
    // builder
    //   .addCase(verifyLoginOtpThunk.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(verifyLoginOtpThunk.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.token = action.payload.token;
    //     state.user = action.payload.user;
    //     // Sync to localStorage
    //     localStorage.setItem("token", JSON.stringify(action.payload.token));
    //     localStorage.setItem("user", JSON.stringify(action.payload.user));
    //     localStorage.setItem("azertoken", action.payload.token.azer_token);
    //   })
    //   .addCase(verifyLoginOtpThunk.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload || "Login OTP verification failed";
    //   });

    // Register with password
    builder
      .addCase(registerWithPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        // Sync to localStorage
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("azertoken", action.payload.token.azer_token);
      })
      .addCase(registerWithPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    // Create passcode
    builder
      .addCase(createPasscodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPasscodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createPasscodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create passcode";
      });

    // Request password reset
    builder
      .addCase(requestPasswordResetThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(requestPasswordResetThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to request password reset";
      });

    // Verify password reset OTP
    builder
      .addCase(verifyPasswordResetOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordResetOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyPasswordResetOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify OTP";
      });

    // Update password with OTP
    builder
      .addCase(updatePasswordWithOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePasswordWithOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updatePasswordWithOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update password";
      });

    // Change passcode
    builder
      .addCase(changePasscodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasscodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(changePasscodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change passcode";
      });

    // Resend OTP
    builder
      .addCase(resendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to resend OTP";
      });
  },
});

export const {  
  setCredentials,
  logout,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
