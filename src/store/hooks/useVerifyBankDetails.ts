// src/hooks/useVerifyBankAccount.ts
import { useState, useRef } from "react";
import api from "@/api/axios";

export const useVerifyBankAccount = () => {
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const verifyAccount = (
    accountNumber: string,
    bankCode: string
  ) => {
    // Reset state on every change
    setAccountName(null);
    setError(null);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Only verify when exactly 10 digits
    if (accountNumber.length !== 10 || !bankCode) return;

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("account_number", accountNumber);
        formData.append("bank_code", bankCode);

        const res = await api.post(
          "/user/bank/verify/account_number",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Ignore stale responses
        if (requestId !== requestIdRef.current) return;

        if (res.data?.verified) {
          setAccountName(res.data.accountName);
        } else {
          setError("Account could not be verified");
        }
      } catch (err: any) {
        if (requestId !== requestIdRef.current) return;
        setError(
          err.response?.data?.message || "Verification failed"
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 500);
  };

  return {
    verifyAccount,
    accountName,
    loading,
    error,
  };
};
