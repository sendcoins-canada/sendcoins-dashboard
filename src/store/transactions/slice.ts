import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getTransactionsThunk } from "./asyncThunks/getTransactions"; 
import { getTransactionDetailThunk } from "./asyncThunks/getTransactionDetail";
import type {  RawApiTransactionList } from "@/types/transaction";
import type { GasFeeData } from "@/types/transaction";
import { getGasFeeThunk } from "./asyncThunks/getGasFee";

// Define the structure of a single transaction item based on typical needs
// NOTE: Adjust this interface based on the exact structure of your API response data
export interface Transaction {
  id: string | number;
  type: 'send' | 'receive' | 'convert';
  status: 'Successful' | 'Failed' | 'Processing';
  amount: string;
  currency: string;
  timestamp: string;
  // Add any other relevant fields like address, network, etc.
  [key: string]: any; 
}

// Define the shape of the entire transaction state
interface TransactionState {
  transactions: RawApiTransactionList[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  gasFeeData: GasFeeData | null;
  selectedDetail: RawApiTransactionList | null; // Stores the raw detail data
  detailLoading: boolean;
  detailError: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  hasLoaded: false,
  selectedDetail: null,
  detailLoading: false,
  detailError: null,
  gasFeeData: null
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    // Reducer to manually set transactions (useful for testing or initialization)
    setTransactions(state, action: PayloadAction<RawApiTransactionList[]>) {
      state.transactions = action.payload;
      state.error = null;
    },
    // Reducer to clear transactions
    clearTransactions(state) {
      state.transactions = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // --- getTransactionsThunk cases ---
    builder
      .addCase(getTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hasLoaded = true;
        
        // Assuming your API returns an array of transactions directly in `action.payload.data`
        // Adjust the payload access based on the actual structure of `res` from your thunk
        const fetchedTransactions = action.payload?.data || action.payload;

        if (Array.isArray(fetchedTransactions)) {
            // NOTE: You might need to cast fetchedTransactions to Transaction[] if types are strict
            state.transactions = fetchedTransactions as RawApiTransactionList[]; 
        } else {
            // Handle case where API response structure is unexpected
            console.error("Transactions API response was not an array:", fetchedTransactions);
            state.error = "Invalid transaction data received.";
            state.transactions = []; // Clear old data
        }
      })
      .addCase(getTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        // The payload for rejected is typically the error message/object
        state.error = action.payload as string || "Failed to fetch transactions.";
        state.transactions = []; // Clear transactions on failure
      })
      // --- getTransactionDetailThunk cases (Detail Fetch) ---
    .addCase(getTransactionDetailThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedDetail = null; // Clear previous detail while loading new one
    })
    .addCase(getTransactionDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        // CRITICAL FIX: Store the successfully fetched detail data
        // The payload contains the raw detail object, which matches RawTransactionDetail
        state.selectedDetail = action.payload as RawApiTransactionList; 
    })
    .addCase(getTransactionDetailThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string || "Failed to load transaction detail.";
        state.selectedDetail = null;
    })
    .addCase(getGasFeeThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getGasFeeThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.gasFeeData = action.payload;
    })
    .addCase(getGasFeeThunk.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Failed to get gas fee";
    });
  },
});

export const { setTransactions, clearTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;