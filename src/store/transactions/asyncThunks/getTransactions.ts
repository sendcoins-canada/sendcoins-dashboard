import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions } from "@/api/transactions";


export const getTransactionsThunk = createAsyncThunk(
  "transaction/getTransactions",
  async (data: { token: string}, { rejectWithValue }) => {
    try {
        const { token } = data
      const res = await getTransactions(token);
      
      console.log('getTransactions Fulfilled Response:', res.data || res);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetching Transactions failed");
    }
  }
);