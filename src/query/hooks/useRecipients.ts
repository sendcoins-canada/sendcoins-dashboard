import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getRecipients, getSingleRecipient } from "@/api/recipients";

export const useRecipients = () => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["recipients"],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await getRecipients(token);
      return res.data ?? res;
    },
    enabled: !!token,
    staleTime: 30_000,
  });
};

export const useRecipientDetail = (keychain: string | undefined) => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["recipient", keychain],
    queryFn: async () => {
      if (!token || !keychain) throw new Error("Missing params");
      return getSingleRecipient({ token, keychain });
    },
    enabled: !!token && !!keychain,
    staleTime: 60_000,
  });
};
