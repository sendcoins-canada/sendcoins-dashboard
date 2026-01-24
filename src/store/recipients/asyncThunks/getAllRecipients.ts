import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecipients } from "@/api/recipients";


export const getRecipientsThunk = createAsyncThunk(
  "recipients/getRecipients",
  async (data: { token: string}, { rejectWithValue }) => {
    try {
        const { token } = data
      const res = await getRecipients(token);
            return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetching recipients failed");
    }
  }
);