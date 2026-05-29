import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getAllBalances } from "@/api/wallet";

export const useBalances = () => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["balances"],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await getAllBalances({ token });
      return res.data;
    },
    enabled: !!token,
    staleTime: 30_000,
  });
};
