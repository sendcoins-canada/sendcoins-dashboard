import { useState, useCallback } from "react";
import { getAccount } from "@/api/fiat"; // Ensure path matches your project
import { setBankDetails } from "../user/slice";
import { useDispatch } from "react-redux";

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  transitNumber?: string;
  institutionNumber?: string;
  referenceCode?: string;
  reference?: string; // Fallback key
  currency?: string;
  bankCode: string;
}

export const useCrayfiAccount = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<BankAccountDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async (token: string, currency: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getAccount({ token, currency });
      // Adjust 'response.data' based on your exact API response structure
      // Example assumes: { status: "success", data: { bankName: "..." } }
      if (response && (response.data || response.bankName)) {
        setData(response.data || response);
        dispatch(setBankDetails(response.data || response));
      } else {
        throw new Error("No account details found");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate bank account details.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAccount };
};