import { createAsyncThunk } from "@reduxjs/toolkit";
import { createWallet as createWalletApi } from "@/api/wallet.tsx";
import type { RootState } from "@/store";

interface CreateWalletPayload {
  symbol: string;
  network: string;
  name: string;
}

interface CreateWalletReturn {
  message: string;
  wallet?: {
    id: string;
    name: string;
    symbol: string;
    network: string;
    address?: string;
    balance?: number;
  };
}

/**
 * Async thunk for creating a new wallet
 * Automatically retrieves token from Redux auth.token state
 */
export const createWalletThunk = createAsyncThunk<
  CreateWalletReturn,
  CreateWalletPayload,
  { state: RootState; rejectValue: string }
>(
  "wallet/createWallet",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token?.azer_token;

      if (!token) {
        return rejectWithValue("No authentication token found. Please log in again.");
      }

      const requestData = {
        symbol: payload.symbol,
        network: payload.network.toLowerCase(),
        name: payload.name,
        token,
      };

      const response = await createWalletApi(requestData);

      // Extract wallet data from response
      const wallet = response?.data?.wallet || {
        id: response?.data?.walletId || Date.now().toString(),
        name: payload.name,
        symbol: payload.symbol,
        network: payload.network.toLowerCase(),
        address: response?.data?.address,
        balance: 0,
      };

      return {
        message: response?.message || "Wallet created successfully",
        wallet,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        "Failed to create wallet. Please try again.";
      return rejectWithValue(message);
      
    }
  }
);
