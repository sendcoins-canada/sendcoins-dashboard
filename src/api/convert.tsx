import api from "./axios"; 

// Define the shape of the data required by the endpoint
export interface ConvertCryptoParams {
  token: string;
  sourceAsset: string;
  sourceNetwork?: string;
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
  const response = await api.post("/user/convert/crypto-to-fiat", {
    token: data.token,
    sourceAsset: data.sourceAsset,
    sourceNetwork: data.sourceNetwork || '',
    sourceAmount: data.sourceAmount,
    destinationCurrency: data.destinationCurrency,
  });
  return response.data;
};

export const getConvertQuote = async (data: ConvertCryptoParams) => {
  const response = await api.post("/user/convert/quote", {
    token: data.token,
    sourceAsset: data.sourceAsset,
    sourceAmount: data.sourceAmount,
    destinationCurrency: data.destinationCurrency,
  });
  return response.data;
};