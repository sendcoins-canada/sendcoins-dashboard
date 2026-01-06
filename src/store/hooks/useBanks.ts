// src/hooks/useBanks.ts
import { useEffect, useState } from "react";
import api from "@/api/axios";

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  country: string;
  currency: string;
}

interface UseBanksResult {
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

export const useBanks = (currency?: string): UseBanksResult => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/bank/list");

        const allBanks: Bank[] = res.data.banks || [];
        
        setBanks(allBanks);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load banks");
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [currency]);

  return { banks, loading, error };
};
