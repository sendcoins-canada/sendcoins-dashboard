import api from "./axios";
import type { CurrencyResponse } from "@/types/wallet";

export const getCurrency = async () => {
  const response = await api.get<CurrencyResponse>("/currency/supported");
  return response.data;
};

export const getSupportedNetwork = async (symbol: string) => {
  const response = await api.post<CurrencyResponse>("/wallet/supported/network", {
    symbol,
  });
  return response.data;
};

// Create a new wallet
export const createWallet = async (data: {
  symbol: string;
  network: string;
  token: string;
  name: string;
}) => {
  const response = await api.post("/user/create/wallet", data);
  return response.data;
};
