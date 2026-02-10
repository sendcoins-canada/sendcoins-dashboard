// // src/hooks/useBanks.ts
// import { useEffect, useState } from "react";
// import api from "@/api/axios";

// export interface Bank {
//   bank_code: number;
//   bank_name: string;

// }

// interface UseBanksResult {
//   banks: Bank[];
//   loading: boolean;
//   error: string | null;
// }

// export const useBanks = (currency?: string): UseBanksResult => {
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/user/crayfi/banks");

//         const allBanks: Bank[] = res.data.data || [];
//         console.log(allBanks)
//         setBanks(allBanks);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load banks");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanks();
//   }, [currency]);

//   return { banks, loading, error };
// };

// src/hooks/useBanks.ts
import { useEffect, useState } from "react";
import api from "@/api/axios";

export interface Bank {
  bank_code: number; // Internal code
  bank_name: string; // Used for matching
  transfer_code?: string; // The code from /api/bank/list
}

interface UseBanksResult {
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

// export const useBanks = (currency?: string): UseBanksResult => {
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         setLoading(true);
//         // 1. Fetch internal banks
//         const internalRes = await api.get("/user/crayfi/banks");
//         const internalBanks: Bank[] = internalRes.data.data || [];

//         // 2. Fetch transfer codes list
//         // Note: Assuming /api/bank/list is the endpoint provided
//         const transferRes = await api.get("/api/bank/list"); 
//         const transferBanksList = transferRes.data.banks || [];

//         // 3. Merge: Find the 'code' for each bank by matching names
//         const mergedBanks = internalBanks.map(internal => {
//           const match = transferBanksList.find(
//             (tb: any) => tb.name.toLowerCase() === internal.bank_name.toLowerCase()
//           );
//           return {
//             ...internal,
//             transfer_code: match ? match.code : internal.bank_code.toString() 
//           };
//         });

//         setBanks(mergedBanks);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load banks");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanks();
//   }, [currency]);

//   return { banks, loading, error };
// };


// src/hooks/useBanks.ts
export const useBanks = (currency?: string): UseBanksResult => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const [internalRes, transferRes] = await Promise.all([
          api.get("/user/crayfi/banks"),
          api.get("/api/bank/list") // The new endpoint
        ]);

        const internalBanks = internalRes.data.data || [];
        const externalBanks = transferRes.data.banks || [];
        const mergedBanks = internalBanks.map((internal: any) => {
          // Normalization function to improve matching
          const normalize = (name: string) => 
            name.toLowerCase()
                .replace(/ plc| limited| lmt| bank/g, "")
                .trim();

          const match = externalBanks.find(
            (eb: any) => normalize(eb.name) === normalize(internal.bank_name)
          );
          return {
            ...internal,
            // If match found, use external code (e.g., "044"), else fallback
            transfer_code: match ? match.code : internal.bank_code.toString()
          };
        });

        setBanks(mergedBanks);
      } catch (err: any) {
        setError("Failed to sync bank codes");
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, [currency]);

  return { banks, loading, error };
};