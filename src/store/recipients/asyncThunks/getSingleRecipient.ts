import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSingleRecipient } from "@/api/recipients";
import type { SingleRecipient } from "@/types/recipients";

interface GetSingleRecipientPayload {
  token: string;
  keychain: string;
}

export const getSingleRecipientThunk = createAsyncThunk<
  SingleRecipient, // Return type of fulfilled
  GetSingleRecipientPayload, // Argument type
  { rejectValue: string } // Optional reject type
>(
  "recipients/getSingleRecipient",
  async ({ token, keychain }, { rejectWithValue }) => {
    try {
      const recipient = await getSingleRecipient({ token, keychain });
      return recipient; 
    } catch (error: any) {
      console.error("Failed to fetch single recipient:", error);
      return rejectWithValue(error.message || "Failed to fetch single recipient");
    }
  }
);
