import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getRecipientsThunk } from "../recipients/asyncThunks/getAllRecipients";
import type { RawRecipient, RecipientApiResponse, SingleRecipient } from "@/types/recipients";
import { getSingleRecipientThunk } from "./asyncThunks/getSingleRecipient";

interface RecipientState {
  recipients: RawRecipient[];
  totalRecipients: number;
  selectedRecipient: SingleRecipient | null;
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
}

const initialState: RecipientState = {
  recipients: [],
  totalRecipients: 0,
  selectedRecipient: null,
  loading: false,
  error: null,
  hasLoaded: false,
};

const recipientsSlice = createSlice({
  name: "recipients",
  initialState,
  reducers: {
    setRecipients(state, action: PayloadAction<RawRecipient[]>) {
      state.recipients = action.payload;
      state.error = null;
      state.hasLoaded = true;
    },

    clearRecipients(state) {
      state.recipients = [];
      state.totalRecipients = 0;
      state.error = null;
      state.hasLoaded = false;
      state.selectedRecipient = null
    },
    clearSelectedRecipient(state) {
      state.selectedRecipient = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRecipientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRecipientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hasLoaded = true;

        const data: RecipientApiResponse =
          action.payload?.data || action.payload;

        // Ensure recipients is an array
        if (Array.isArray(data.recipients)) {
          state.recipients = data.recipients;
          state.totalRecipients = data.totalRecipients || 0;
        } else {
          console.error("Recipients data was not an array:", data);
          state.error = "Invalid recipients data received.";
          state.recipients = [];
          state.totalRecipients = 0;
        }
      })

      .addCase(getRecipientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch recipients.";
        state.recipients = [];
        state.totalRecipients = 0;
      })
       // Fetch single recipient
      .addCase(getSingleRecipientThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleRecipientThunk.fulfilled, (state, action: PayloadAction<SingleRecipient>) => {
        state.loading = false;
        state.error = null;
        state.selectedRecipient = action.payload;
      })
      .addCase(getSingleRecipientThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch recipient.";
        state.selectedRecipient = null;
      });
  },
});

export const { setRecipients, clearRecipients, clearSelectedRecipient } = recipientsSlice.actions;

export default recipientsSlice.reducer;
