import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactions, getTransactionDetail, type TransactionFilterParams } from "@/api/transactions";

export const useTransactions = (filters?: Omit<TransactionFilterParams, "token">) => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await getTransactions({ token, ...filters });
      return res.data;
    },
    enabled: !!token,
    staleTime: 30_000,
  });
};

export const useTransactionDetail = (txId: string | undefined) => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  return useQuery({
    queryKey: ["transaction", txId],
    queryFn: async () => {
      if (!token || !txId) throw new Error("Missing params");
      const res = await getTransactionDetail({ token, txId });
      return res.data;
    },
    enabled: !!token && !!txId,
    staleTime: 60_000,
  });
};
