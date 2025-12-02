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
export const getTransactionDetail = async (data: {token: string; keychain: string}) => {
  const formData = new FormData();
  formData.append("token", data.token);
  formData.append("keychain", data.keychain);

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

