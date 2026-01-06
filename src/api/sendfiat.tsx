import api from "./axios";

export interface SendFiatParams {
  token: string;
  passcode: string;
  destinationCountry: string;
  currency: string;
  amount: string;
  fullName: string;
  bankName: string;
  accountNumber: string;
  transitNumber?: string;
  notes?: string;
}

/**
 * Consumes the /fiat/send endpoint to initiate a bank transfer.
 * Uses FormData as the body to remain consistent with your other user APIs.
 */
export const sendFiat = async (params: SendFiatParams) => {
  const formData = new FormData();
  
  // Appending all required fields to the FormData object
  formData.append("token", params.token);
  formData.append("passcode", params.passcode);
  formData.append("destinationCountry", params.destinationCountry);
  formData.append("currency", params.currency);
  formData.append("amount", params.amount);
  formData.append("fullName", params.fullName);
  formData.append("bankName", params.bankName);
  formData.append("accountNumber", params.accountNumber);
  
  // Appending optional fields if they exist
  if (params.transitNumber) {
    formData.append("transitNumber", params.transitNumber);
  }
  if (params.notes) {
    formData.append("notes", params.notes);
  }

  const response = await api.post(
    "/fiat/send",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};