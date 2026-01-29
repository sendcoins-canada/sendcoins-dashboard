import api from "./axios"; // Adjust path to your axios instance

// Define the shape of the data required by the endpoint
export interface ConvertCryptoParams {
  token: string;
  sourceAsset: string;
  sourceNetwork: string;
  sourceAmount: string | number;
  destinationCurrency: string;
}

// 1. New Interface for the Conversion Response
export interface ConversionResponse {
  success: boolean;
  data: {
    conversionId: number;
    reference: string;
    keychain: string;
    sourceAsset: string;
    sourceAmount: string;
    destinationCurrency: string;
    destinationAmount: string; // We will use this
    exchangeRate: string;
    platformFeeAmount: string;
    finalAmount: string;
    status: string;
    createdAt: number;
    message: string;
  };
}

// Define the function
export const convertCryptoToFiat = async (data: ConvertCryptoParams) => {
  const formData = new FormData();
  
  // Append all keys to FormData as required
  formData.append("token", data.token);
  formData.append("sourceAsset", data.sourceAsset);
  formData.append("sourceNetwork", data.sourceNetwork);
  formData.append("sourceAmount", data.sourceAmount.toString());
  formData.append("destinationCurrency", data.destinationCurrency);

  try {
    const response = await api.post("/user/convert/crypto-to-fiat", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};