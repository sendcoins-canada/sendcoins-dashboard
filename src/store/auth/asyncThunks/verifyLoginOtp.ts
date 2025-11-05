// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { verifyLoginOtp as verifyLoginOtpApi } from "@/api/authApi";
// import type { AuthToken, User } from "../slice";

// interface VerifyLoginOtpPayload {
//   email: string;
//   code: string;
// }

// interface VerifyLoginOtpReturn {
//   token: AuthToken;
//   user: User;
// }

// /**
//  * Async thunk for verifying OTP during login flow
//  * Used after login with password when OTP is required
//  */
// export const verifyLoginOtpThunk = createAsyncThunk<
//   VerifyLoginOtpReturn,
//   VerifyLoginOtpPayload,
//   { rejectValue: string }
// >(
//   "auth/otp/verify",
//   async (otpData, { rejectWithValue }) => {
//     try {
//       const response = await verifyLoginOtpApi(otpData);
//       const data = response.data;

//       if (!data?.token || !data?.result) {
//         return rejectWithValue("Invalid OTP response from server");
//       }

//       return {
//         token: {
//           azer_token: data.token.azer_token,
//           expires_at: data.token.expires_at,
//         },
//         user: data.result[0],
//       };
//     } catch (error: any) {
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Invalid OTP code. Please try again.";
//       return rejectWithValue(message);
//     }
//   }
// );
