import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coin } from "@/types/wallet";
import { createWalletThunk } from "./asyncThunks/createWallet";

interface Wallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address?: string;
  balance?: number;
}

interface Network {
  network_name: string;
  [key: string]: any; // Allow additional properties from API
}

type WalletState = {
  wallets: Wallet[];
  coins: Record<string, Coin>;
  networks: Network[];
  loading: boolean;
  error?: string;
};

const initialState: WalletState = {
  wallets: [],
  coins: {},
  networks: [],
  loading: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<Wallet[]>) {
      state.wallets = action.payload;
    },
    addWallet(state, action: PayloadAction<Wallet>) {
      state.wallets.push(action.payload);
    },
    setCoins(state, action: PayloadAction<Record<string, Coin>>) {
      state.coins = action.payload;
    },
    setNetworks(state, action: PayloadAction<Network[]>) {
      state.networks = action.payload;
    },
    clearWallets(state) {
      state.wallets = [];
      state.coins = {};
      state.networks = [];
    },
  },
  extraReducers: (builder) => {
    // Create wallet
    builder
      .addCase(createWalletThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createWalletThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.wallet) {
          state.wallets.push(action.payload.wallet);
        }
      })
      .addCase(createWalletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create wallet";
      });
  },
});

export const { setWallets, addWallet, setCoins, setNetworks, clearWallets } =
  walletSlice.actions;
export default walletSlice.reducer;
