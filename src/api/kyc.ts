import api from "./axios";

// Define the interface for the parameters
export interface KycStatusParams {
  token: string;
  keychain: string;
  status: "0" | "verified" | "under_review" | "cancel" | string;
}

export const updateKycStatus = async (params: KycStatusParams) => {
  const formData = new FormData();

  formData.append("token", params.token);
  formData.append("keychain", params.keychain);
  formData.append("status", params.status);

  const response = await api.post("/user/auth/kyc/status", formData);

  return response.data;
};

// Define the interface for profile update
export interface UpdateProfileParams {
  token: string;
  bvn: string;
}

export const updateUserProfile = async (params: UpdateProfileParams) => {
  const formData = new FormData();
  formData.append("token", params.token);
  formData.append("bvn", params.bvn);

  const response = await api.put("/user/profile", formData);

  return response.data;
};

// Unified KYC config — returns Dojah or CrayFi based on user's country
export interface UnifiedKycConfigResponse {
  success: boolean;
  kyc_provider: 'dojah' | 'crayfi';
  // CrayFi response (Nigerian users — no widget needed)
  verified?: boolean;
  message?: string;
  // Dojah response (international users)
  config?: {
    app_id: string;
    p_key: string;
    widget_id: string;
    type: string;
    metadata: {
      user_api_key: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    user_data: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export const getUnifiedKycConfig = async (
  token: string
): Promise<UnifiedKycConfigResponse> => {
  const response = await api.post("/user/kyc/config/unified", { token });
  return response.data;
};
