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

  const response = await api.post(
    "/user/auth/kyc/status", 
    formData, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};