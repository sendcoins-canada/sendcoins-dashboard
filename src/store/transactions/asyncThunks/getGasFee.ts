import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetGasFees,  } from '../../../api/transactions'; 
import type { GasFeeData, GetGasFee,  } from '@/types/transaction';

// --- THUNK DEFINITION ---

export const getGasFeeThunk = createAsyncThunk<
  GasFeeData,
  GetGasFee,
  { rejectValue: string }
>(
  "transaction/getGasFee",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
       const token = localStorage.getItem("azertoken");
       
if (!token) {
  return rejectWithValue("Authentication token not found");
}

      formData.append("amount", String(payload.amount));
      formData.append("asset", payload.asset);
      formData.append("symbol", payload.symbol);
      formData.append("token", token); 
      formData.append("TransactionType", "withdrawal");

      const response = await GetGasFees(formData);

      return response.data.data; // unwrap backend response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch gas fee");
    }
  }
);


