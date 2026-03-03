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

  const response = await api.post("/user/auth/kyc/status", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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

  const response = await api.put("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// MetaMap config from backend
export interface MetaMapConfigParams {
  token: string;
}

export interface MetaMapConfigResponse {
  success: boolean;
  config?: {
    clientId: string;
    flowId: string;
    metadata: {
      email: string;
      userId: string;
      firstName: string;
      lastName: string;
    };
  };
}

export const getMetaMapConfig = async (
  params: MetaMapConfigParams
): Promise<MetaMapConfigResponse> => {
  const response = await api.post("/user/kyc/config", {
    token: params.token,
  });
  return response.data;
};