import api from "./axios";

export interface TransactionFilterParams {
  token: string;
  date_filter?: string; // e.g., "today", "this_week", "this_month"
  status?: string;      // e.g., "completed", "failed", "processing"
  transaction_type?: string; // e.g., "deposit", "withdraw", "convert"
  asset_type?: string;       // e.g., "BTC", "NGN"
  crypto_currency?: string;
}

export const getTransactions = async (params: TransactionFilterParams) => {
  const formData = new FormData();
// Always append the token
  formData.append("token", params.token);

  // Conditionally append filters if they exist and are not "All"
  if (params.date_filter && params.date_filter !== "All") {
    formData.append("date_filter", params.date_filter.toLowerCase().replace(" ", "_"));
  }
  
  if (params.status && params.status !== "All") {
    formData.append("status", params.status.toLowerCase());
  }
  
  if (params.transaction_type && params.transaction_type !== "All") {
    formData.append("transaction_type", params.transaction_type.toLowerCase());
  }

  if (params.asset_type && params.asset_type !== "All") {
    formData.append("asset_type", params.asset_type);
  }
  if (params.crypto_currency && params.crypto_currency !== "All") {
    formData.append("crypto_currency", params.crypto_currency);
  }
  const response = await api.post(
    "/user/transactions/history",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const getTransactionDetail = async (data: {token: string; txId: string}) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("txId", data.txId);

  const response = await api.post(
    "/user/transactions/details",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const GetGasFees = (formData: FormData) => {
  return api.post("/user/get/gasfees", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


