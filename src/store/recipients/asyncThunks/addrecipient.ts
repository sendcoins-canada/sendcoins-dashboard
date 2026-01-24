// redux/thunks/addRecipientThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addRecipient } from "@/api/recipients";
import type { AddRecipientPayload, RecipientResponse } from "@/types/recipients";


export const addRecipientThunk = createAsyncThunk<
  RecipientResponse,          
  AddRecipientPayload         
>(
  "recipients/addRecipient",
  async ({ token, name, network, asset, walletAddress }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("name", name);
      formData.append("network", network);
      formData.append("asset", asset);
      formData.append("walletAddress", walletAddress);

      const response = await addRecipient(formData);
      return response;
    } catch (error) {
      
  if (error instanceof Error) {
    return thunkAPI.rejectWithValue(error.message);
  }

  return thunkAPI.rejectWithValue("Failed to add recipient");
    }
}
)

