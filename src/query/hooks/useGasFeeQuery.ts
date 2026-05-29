import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { GetGasFees } from "@/api/transactions";
import type { GasFeeData } from "@/types/transaction";

interface GasFeeParams {
  amount: string;
  asset: string;
  symbol: string;
}

export const useGasFeeQuery = (params?: GasFeeParams) => {
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  const query = useQuery<GasFeeData>({
    queryKey: ["gasFee", params],
    queryFn: async () => {
      if (!token || !params) throw new Error("Missing params");
      const formData = new FormData();
      formData.append("token", token);
      formData.append("amount", params.amount);
      formData.append("asset", params.asset);
      formData.append("symbol", params.symbol);
      const res = await GetGasFees(formData);
      return res.data?.data;
    },
    enabled: !!token && !!params?.amount && !!params?.asset && !!params?.symbol,
    staleTime: 15_000,
  });

  return {
    gasFee: query.data?.gasFee ?? 0,
    total: query.data?.plusFee ?? 0,
    minusFee: query.data?.minusFee ?? 0,
    usdValue: query.data?.usdConversion ?? 0,
    symbol: query.data?.symbol,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    raw: query.data,
  };
};
