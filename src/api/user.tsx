import api from "./axios";
import type { User } from "@/types/user";

export const getUser = async (): Promise<User> => {
  // Get token object from local storage
  const tokenData = localStorage.getItem("token");

  if (!tokenData) {
    throw new Error("No token found in local storage");
  }

  // Parse token JSON
  const { azer_token } = JSON.parse(tokenData);

   // Check if token is expired
//   const now = Date.now();
//   if (expires_at && now > expires_at) {
//     localStorage.removeItem("token");
//     throw new Error("Session expired. Please log in again.");
//   }

  if (!azer_token) {
    throw new Error("Invalid token format in local storage");
  }
    const formData = new FormData();
  formData.append("token", azer_token);

  // Send the token in the request body
  const response = await api.post<User>(
    "/user/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
