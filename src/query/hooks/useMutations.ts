import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendCrypto } from "@/api/authApi";
import { sendFiat } from "@/api/fiat";
import { addRecipient } from "@/api/recipients";
import { createWallet } from "@/api/wallet";
import { convertCryptoToFiat, executeBuyCrypto, type ConvertCryptoParams, type BuyCryptoParams } from "@/api/convert";

export const useSendCrypto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendCrypto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
};

export const useSendFiat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFiat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
};

export const useAddRecipient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
};

export const useConvertCryptoToFiat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConvertCryptoParams) => convertCryptoToFiat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
};

export const useExecuteBuyCrypto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BuyCryptoParams) => executeBuyCrypto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
};
