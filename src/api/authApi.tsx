// src/api/authApi.ts
import api from "./axios";
import type { VerifyEmailRequest, VerifyEmailResponse, VerifyOtpRequest, VerifyOtpResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginWithPasswordResponse, SurveyResponse, CountryResponse, RequestPasswordResetRequest, RequestPasswordResetResponse, VerifyPasswordResetOtpRequest, VerifyPasswordResetOtpResponse, UpdatePasswordWithOtpRequest, UpdatePasswordWithOtpResponse } from "../types/onboarding";

// verify mail
export const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("purpose", data.purpose);

  const response = await api.post<VerifyEmailResponse>(
    "/auth/otp/send",
    formData
  );

  return response.data;
};


// verify otp
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {

  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("otp", data.code.toString());
  formData.append("purpose", data.purpose);

  const response = await api.post<VerifyOtpResponse>("/auth/otp/verify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("password", data.password);
  formData.append("country", data.country);
  formData.append("bvn", data.bvn);
  formData.append("authHash", data.authHash);

  const response = await api.post<RegisterResponse>(
    "/user/auth/registerWithPassword",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  // Token storage is now handled by Redux auth slice
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


export const verifyLoginOtp = async (data: { email: string; code: string }) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("code", data.code);

  const response = await api.post("/user/auth/verify_login_otp", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Token storage is now handled by Redux auth slice
  return response.data;
};



// survey
export const getActiveSurvey = async (): Promise<SurveyResponse> => {
  const response = await api.get<SurveyResponse>("/active/survey");
  return response.data;
};

// submit servey

export const submitSurvey = async (data: {
  email: string;
  config_id: number;
  question_id: number;
  answer: string;
  azerId: string | number;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("configId", String(data.config_id));
  formData.append("questionId", String(data.question_id));
  formData.append("answers", data.answer);
  formData.append("azerId", String(data.azerId));

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

export const createPasscode = async (data: { code: string; token: string }) => {
  if (!data.token) {
    throw new Error("No token found. Please log in again.");
  }

  const formData = new FormData();
  formData.append("token", data.token);
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
  const response = await api.post<RequestPasswordResetResponse>(
    "/auth/password/reset/request",
    { email: data.email }
  );
  return response.data;
};

// Forgot password - Step 2: verify OTP (returns authHash)
export const verifyPasswordResetOtp = async (
  data: VerifyPasswordResetOtpRequest
): Promise<VerifyPasswordResetOtpResponse> => {
  const response = await api.post<VerifyPasswordResetOtpResponse>(
    "/auth/otp/verify",
    { email: data.email, otp: data.otp, purpose: "password_reset" }
  );
  return response.data;
};

// Forgot password - Step 3: reset password with authHash
export const updatePasswordWithOtp = async (
  data: UpdatePasswordWithOtpRequest
): Promise<UpdatePasswordWithOtpResponse> => {
  const response = await api.post<UpdatePasswordWithOtpResponse>(
    "/auth/password/reset",
    { authHash: data.authHash, newPassword: data.newPassword }
  );
  return response.data;
};
// passcode
export const changePasscode = async (data: { oldCode: string; newCode: string }) => {
  const response = await api.post("/auth/change-passcode", data);
  return response.data;
};

// Step 1: Request Reset (requires token, newPasscode, confirmPasscode)
export const requestPasscodeReset = async (data: { 
  token: string; 
  newPasscode: number; 
  confirmPasscode: number 
}) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("newPasscode", String(data.newPasscode));
  formData.append("confirmPasscode", String(data.confirmPasscode));

  const response = await api.post("/auth/passcode/reset/request", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Step 2: Confirm Reset (requires authHash and newPasscode)
export const confirmPasscodeReset = async (data: { 
  authHash: string; 
  newPasscode: number 
}) => {
  const response = await api.post("/auth/passcode/reset", {
    authHash: data.authHash,
    newPasscode: data.newPasscode,
  });
  return response.data;
};

// Step 1: Request Creation (Requires passcode + confirmPasscode + token)
export const requestPasscodeCreate = async (data: { 
  token: string;
  passcode: string;
}) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("passcode", data.passcode);

  const response = await api.post("/auth/passcode/create/request", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Step 2: Finalize Creation (Requires authHash + passcode)
export const finalizePasscodeCreate = async (passcode: string, authHash: string) => {
  const formData = new FormData();
  formData.append("passcode", passcode);
  formData.append("authHash", authHash);

  const response = await api.post("/auth/passcode/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// --- NEW: Verify Passcode ---
export const verifyPasscode = async (data: { token: string; passcode: string }) => {
  const formData = new FormData();
  formData.append("passcode", data.passcode);
  formData.append("token", data.token);
  
  
  const response = await api.post("/user/auth/verify/passcode", formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// --- NEW: Send Crypto ---
export const sendCrypto = async (data: {
  token: string;
  asset: string;
  network: string;
  walletAddress: string;
  amount: string;
}) => {
  const formData = new FormData();
  formData.append("asset", data.asset);
  formData.append("network", data.network);
  formData.append("walletAddress", data.walletAddress);
  formData.append("amount", data.amount);
  formData.append("token", data.token);

  const response = await api.post("/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// --- Transfer Status Polling ---
export const getTransferStatus = async (reference: string) => {
  const response = await api.get(`/transfer/${reference}`);
  return response.data;
};

export const pollTransferStatus = (
  reference: string,
  onUpdate: (data: any) => void,
  onError: (error: any) => void,
  intervalMs = 3000,
  maxAttempts = 60
) => {
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    try {
      const result = await getTransferStatus(reference);
      if (result.isSuccess && result.data) {
        const status = result.data.status;
        if (status === 'completed' || status === 'failed') {
          clearInterval(interval);
          onUpdate(result.data);
          return;
        }
      }
    } catch (err) {
      // Don't stop polling on network errors, just log
      console.warn(`Poll attempt ${attempts} failed:`, err);
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      onError(new Error('Transfer is taking longer than expected. Check your transfer history for updates.'));
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
};