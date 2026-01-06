import api from "./axios";


export const getTransactions = async (token: string) => {
  const formData = new FormData();
  formData.append("token", token);

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


