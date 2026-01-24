import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { getGasFeeThunk } from "@/store/transactions/asyncThunks/getGasFee";
import type { GetGasFee } from "@/types/transaction";

export const useGasFee = (params?: GetGasFee) => {
  const dispatch = useDispatch<AppDispatch>();

  const { gasFeeData, loading, error } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    if (!params) return;
    if (!params.amount || !params.symbol || !params.asset) return;

    dispatch(getGasFeeThunk(params));
  }, [params?.amount, params?.asset, params?.symbol, dispatch]);

  return {
    gasFee: gasFeeData?.gasFee ?? 0,
    total: gasFeeData?.plusFee ?? 0,
    minusFee: gasFeeData?.minusFee ?? 0,
    usdValue: gasFeeData?.usdConversion ?? 0,
    symbol: gasFeeData?.symbol,
    loading,
    error,
    raw: gasFeeData, // if you ever need full backend response
  };
};
