import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions, type TransactionFilterParams } from "@/api/transactions";


export const getTransactionsThunk = createAsyncThunk(
  "transaction/getTransactions",
  async (params: TransactionFilterParams, { rejectWithValue }) => {
    try {
      const res = await getTransactions(params);
      
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetching Transactions failed");
    }
  }
);