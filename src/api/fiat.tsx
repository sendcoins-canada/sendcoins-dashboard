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