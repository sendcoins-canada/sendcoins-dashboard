import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import api from "@/api/axios";

export const useUserProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const formData = new FormData();
      formData.append("token", token);
      const response = await api.post("/user/profile", formData);
      return response.data;
    },
    enabled: !!token,
    staleTime: 60_000,
  });
};
