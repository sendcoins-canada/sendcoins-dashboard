import api from "./axios";

export interface SendFiatParams {
  token: string;
  // passcode: string;
  // destinationCountry: string;
  currency: string;
  amount: string;
  recipientName: string;
  bankCode: string;
  accountNumber: string;
  transitNumber?: string;
  narration?: string;
}

export interface GetAccountParams {
  token: string;
  currency: string;
}

/**
 * Consumes the /fiat/send endpoint to initiate a bank transfer.
 * Uses FormData as the body to remain consistent with your other user APIs.
 */
export const sendFiat = async (params: SendFiatParams) => {
  const formData = new FormData();
  
  // Appending all required fields to the FormData object
  formData.append("token", params.token);
  // formData.append("passcode", params.passcode);
  // formData.append("destinationCountry", params.destinationCountry);
  formData.append("currency", params.currency);
  formData.append("amount", params.amount);
  formData.append("recipientName", params.recipientName);
  formData.append("bankCode", params.bankCode);
  formData.append("accountNumber", params.accountNumber);
  
  // Appending optional fields if they exist
  if (params.transitNumber) {
    formData.append("transitNumber", params.transitNumber);
  }
  if (params.narration) {
    formData.append("narration", params.narration);
  }

  const response = await api.post(
    "/user/crayfi/payout",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export interface UpdateProfileParams {
  token: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  bvn?: string;
}

export interface RequestFiatAccountParams {
  token: string;
}

export const updateProfile = async (params: UpdateProfileParams) => {
  const formData = new FormData();
  formData.append("token", params.token);
  if (params.first_name) formData.append("first_name", params.first_name);
  if (params.middle_name) formData.append("middle_name", params.middle_name);
  if (params.last_name) formData.append("last_name", params.last_name);
  if (params.bvn) formData.append("bvn", params.bvn);

  const response = await api.put(
    "/user/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const requestFiatAccount = async (params: RequestFiatAccountParams) => {
  const formData = new FormData();
  formData.append("token", params.token);

  const response = await api.post(
    "/user/fiat/request",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const getAccount = async (params: GetAccountParams) => {
  const formData = new FormData();
  
  formData.append("token", params.token);
  formData.append("currency", params.currency);

  const response = await api.post(
    "/user/crayfi/account",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};