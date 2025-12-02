import api from "./axios";
import type { CoinResponse, CurrencyResponse } from "@/types/wallet";

export const getCurrency = async () => {
  const response = await api.get<CurrencyResponse>("/currency/supported");
  return response.data;
};
export const getCoins = async () => {
  const response = await api.get<CoinResponse>("/coin/all");
  return response.data;
};

export const getSupportedNetwork = async (symbol: string) => {
  const formData = new FormData();
  formData.append("symbol", symbol);

  const response = await api.post(
    "/wallet/supported/network",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// Create a new wallet
export const createWallet = async (data: {
  symbol: string;
  network: string;
  token: string;
  name: string;
}) => {
  const formData = new FormData();
  formData.append("symbol", data.symbol);
  formData.append("network", data.network);
  formData.append("token", data.token);
  formData.append("name", data.name);

  const response = await api.post("/user/create/wallet", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET BTC BALANCE
export const getBTCBalance = async (data: { token: string; network: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("network", data.network);

  const response = await api.post("/user/wallet/btc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET ETH BALANCE
export const getETHBalance = async (data: { token: string; network: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("network", data.network);

  const response = await api.post("/user/wallet/eth", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET BNB BALANCE
export const getBNBBalance = async (data: { token: string; network: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("network", data.network);

  const response = await api.post("/user/wallet/bnb", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET USDT BALANCE
export const getUSDTBalance = async (data: { token: string; network: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("network", data.network);

  const response = await api.post("/user/wallet/usdt", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET USDC BALANCE
export const getUSDCBalance = async (data: { token: string; network: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("network", data.network);

  const response = await api.post("/user/wallet/usdc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET ALL BALANCE
export const getAllBalances = async (data: { token: string }) => {
  const formData = new FormData();
  formData.append("token", data.token);

  const response = await api.post("/user/wallet/balances", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
