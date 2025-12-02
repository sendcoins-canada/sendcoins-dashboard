import api from "./axios";
import type { RecipientResponse, SingleRecipient } from "@/types/recipients";



export const getRecipients = async (token: string) => {
  const formData = new FormData();
  formData.append("token", token);

  const response = await api.post(
    "/user/recipients/list",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const addRecipient = async (formData: FormData) => {
  const response = await api.post<RecipientResponse>(
    "user/recipients",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getSingleRecipient = async ({ token, keychain }: { token: string; keychain: string }): Promise<SingleRecipient> => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("keychain", keychain); // include keychain in the request

  const response = await api.post(
    "/user/recipients/get",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.recipient;
};
