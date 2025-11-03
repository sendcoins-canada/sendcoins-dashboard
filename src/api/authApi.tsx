// src/api/authApi.ts
import api from "./axios";
import type { VerifyEmailRequest, VerifyEmailResponse, VerifyOtpRequest, VerifyOtpResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginWithPasswordResponse, SurveyResponse, SubmitSurveyRequest, CountryResponse, RequestPasswordResetRequest, RequestPasswordResetResponse, VerifyPasswordResetOtpRequest, VerifyPasswordResetOtpResponse, UpdatePasswordWithOtpRequest, UpdatePasswordWithOtpResponse } from "../types/onboarding";

// verify mail
export const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);

  const response = await api.post<VerifyEmailResponse>(
    "/user/auth/email/verify",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// verify otp
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("code", data.code);

  const response = await api.post<VerifyOtpResponse>(
    "/user/auth/verifyOTP",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// resend otp
export const resendOtp = async (email: string): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("email", email);

  const response = await api.post("/user/auth/resendOTP", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};


// register
export const registerWithPassword = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
   console.log(" Sending registration payload:", data); 
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("password", data.password);
  formData.append("country", data.country);
  formData.append("code", data.code);

  const response = await api.post<RegisterResponse>(
    "/user/auth/registerWithPassword",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
//  Save AzerID to localStorage if available
  if (response.data?.data?.token?.azer_token) {
    localStorage.setItem("azertoken", response.data.data.token.azer_token);
  }

  return response.data;
};

// login
export const loginUser = async (data: LoginRequest): Promise<LoginWithPasswordResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);

  const response = await api.post<LoginWithPasswordResponse>(
    "/user/auth/loginWithPassword",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const verifyOtpQueryString = async (queryString: string) => {
  const formData = new FormData();
  formData.append("queryString", queryString);

  const response = await api.post(
    "/user/auth/verifyOTPQueryString",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
 

  return response.data;
};

export const verifyLoginOtp = async (data: { email: string; code: string }) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("code", data.code);

  const response = await api.post("/user/auth/verify_login_otp", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

   if (response.data?.data?.token?.azer_token) {
    localStorage.setItem("azertoken", response.data.data.token.azer_token);
  }

  return response.data;
};



// survey
export const getActiveSurvey = async (): Promise<SurveyResponse> => {
  const response = await api.get<SurveyResponse>("/active/survey");
  return response.data;
};

// submit servey
export const submitSurvey = async (data: SubmitSurveyRequest) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("configid", String(data.config_id));
  formData.append("questionid", String(data.question_id));
  formData.append("answers", data.answer);

  const response = await api.post("/user/survey/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// get countries
export const getCountries = async (): Promise<CountryResponse> => {
  const response = await api.get<CountryResponse>("/currency/all");
  return response.data;
};

export const createPasscode = async (data: { code: string }) => {
  const token = localStorage.getItem("azertoken"); // get token from storage

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const formData = new FormData();
  formData.append("token", token);
  formData.append("passcode", data.code);

  const response = await api.post("/user/auth/create/passcode", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Forgot password - Step 1: request reset & send OTP
export const requestPasswordReset = async (
  data: RequestPasswordResetRequest
): Promise<RequestPasswordResetResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("newPassword", data.newPassword);

  const response = await api.post<RequestPasswordResetResponse>(
    "/user/auth/request_password_reset",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// Forgot password - Step 2: verify OTP
export const verifyPasswordResetOtp = async (
  data: VerifyPasswordResetOtpRequest
): Promise<VerifyPasswordResetOtpResponse> => {
  const formData = new FormData();
  formData.append("authHash", data.authHash);
  formData.append("otp", data.otp);

  const response = await api.post<VerifyPasswordResetOtpResponse>(
    "/user/auth/auth_verify_password_otp",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// Forgot password - Step 3: finalize update
export const updatePasswordWithOtp = async (
  data: UpdatePasswordWithOtpRequest
): Promise<UpdatePasswordWithOtpResponse> => {
  const formData = new FormData();
  formData.append("authHash", data.authHash);
  formData.append("otp", data.otp);

  const response = await api.post<UpdatePasswordWithOtpResponse>(
    "/user/auth/auth_update_password_with_otp",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};
// passcode
export const changePasscode = async (data: { oldCode: string; newCode: string }) => {
  const response = await api.post("/auth/change-passcode", data);
  return response.data;
};
