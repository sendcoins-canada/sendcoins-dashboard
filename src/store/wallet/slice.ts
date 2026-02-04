import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coin } from "@/types/wallet";
import { createWalletThunk } from "./asyncThunks/createWallet";
import { getAllBalanceThunk, getBNBBalanceThunk, getBTCBalanceThunk, getETHBalanceThunk, getUSDCBalanceThunk, getUSDTBalanceThunk } from "./asyncThunks/getBalances";

interface Wallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address?: string;
  balance?: number;
}

interface Network {
  symbol: string;
  network_full_name: string;
  network_id: string;
  network_type: string;
  network_logo: string;
}

type SelectedBalance = {
  usd: string;
  amount: string; 
  symbol: string;
  logo: string;
  isWalletAvailable?: boolean
};

type WalletState = {
  wallets: Wallet[];
  coins: Record<string, Coin>;
  networks: Network[];
  loading: boolean;
  error?: string;
  allBalances?: any;
  selectedBalance: SelectedBalance | null;
};

const initialState: WalletState = {
  wallets: [],
  coins: {},
  networks: [],
  loading: false,
  allBalances: undefined,
  // selectedBalance: {
  //   symbol: "",
  //   usd: "",
  //   amount: "",
  //   logo: ""
  // },
  selectedBalance: null,
};

// type SingleWalletData = {
//     isWalletAvailable: boolean;
//     symbol: string;
//     TotalAvailableBalancePrice: string;
//     totalAvailableBalance: number;
//     logo: string
//     // ... other properties
// };

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
    // <-- NEW: Reducer to set the currently displayed wallet balance
    setSelectedBalance(state, action: PayloadAction<SelectedBalance>) {
      state.selectedBalance = action.payload;
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
      })

       // ===== BTC ===================================================
    .addCase(getBTCBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getBTCBalanceThunk.fulfilled, (state, action) => {
    state.loading = false;
    // Extract the specific coin data (e.g., action.payload.data.bitcoin)
    const coinData = action.payload?.data?.bitcoin; 

    if (coinData) {
        state.coins["BTC"] = coinData;
        // Update the selectedBalance with the fresh data
        if (state.selectedBalance?.symbol === 'BTC') {
            state.selectedBalance = {
                usd: coinData.TotalAvailableBalancePrice,
                amount: `${coinData.totalAvailableBalance} ${coinData.symbol}`,
                symbol: coinData.symbol,
                logo: coinData.logo
            };
        }
    }
})
    .addCase(getBTCBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ===== ETH ===================================================
    .addCase(getETHBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getETHBalanceThunk.fulfilled, (state, action) => {
      state.loading = false;
      const coinData = action.payload?.data?.ethereum || action.payload?.data?.eth; 

    if (coinData) {
        state.coins["ETH"] = coinData;
        if (state.selectedBalance?.symbol === 'ETH') {
            state.selectedBalance = {
                usd: coinData.TotalAvailableBalancePrice,
                amount: `${coinData.totalAvailableBalance} ${coinData.symbol}`,
                symbol: coinData.symbol,
                logo: coinData.logo
            };
        }
    }
    })
    .addCase(getETHBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ===== BNB ===================================================
    .addCase(getBNBBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getBNBBalanceThunk.fulfilled, (state, action) => {
      state.loading = false;
      const coinData = action.payload?.data?.Binancecoin; 

    if (coinData) {
        state.coins["BNB"] = coinData;
        if (state.selectedBalance?.symbol === 'BNB') {
            state.selectedBalance = {
                usd: coinData.TotalAvailableBalancePrice,
                amount: `${coinData.totalAvailableBalance} ${coinData.symbol}`,
                symbol: coinData.symbol,
                logo: coinData.logo

            };
        }
    }
    })
    .addCase(getBNBBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ===== USDT ===================================================
    .addCase(getUSDTBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getUSDTBalanceThunk.fulfilled, (state, action) => {
      state.loading = false;
      const coinData = action.payload?.data?.Tether; 

    if (coinData) {
        state.coins["USDT"] = coinData;
        if (state.selectedBalance?.symbol === 'USDT') {
            state.selectedBalance = {
                usd: coinData.TotalAvailableBalancePrice,
                amount: `${coinData.totalAvailableBalance} ${coinData.symbol}`,
                symbol: coinData.symbol,
                                logo: coinData.logo

            };
        }
    }
    })
    .addCase(getUSDTBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ===== USDC ===================================================
    .addCase(getUSDCBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(getUSDCBalanceThunk.fulfilled, (state, action) => {
      state.loading = false;
      const coinData = action.payload?.data?.USDC; 

    if (coinData) {
        state.coins["USDC"] = coinData;
        if (state.selectedBalance?.symbol === 'USDC') {
            state.selectedBalance = {
                usd: coinData.TotalAvailableBalancePrice,
                amount: `${coinData.totalAvailableBalance} ${coinData.symbol}`,
                symbol: coinData.symbol,
                                logo: coinData.logo

            };
        }
    }
    })
    .addCase(getUSDCBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ===== ALL BALANCES ==========================================
    .addCase(getAllBalanceThunk.pending, (state) => {
      state.loading = true;
    })
    // .addCase(getAllBalanceThunk.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.allBalances = action.payload; // all balances at once
    //   // Optionally set an initial selected balance from the first wallet found
    //       const firstBalanceKey = Object.keys(action.payload.data?.balances || {})[0];
    //       if (firstBalanceKey) {
    //         const firstWallet = Object.values(action.payload.data.balances[firstBalanceKey])[0] as SingleWalletData;
    //         if (firstWallet.isWalletAvailable) {
    //             state.selectedBalance = {
    //                 symbol: firstWallet.symbol,
    //                 usd: firstWallet.TotalAvailableBalancePrice,
    //                 amount: `${firstWallet.totalAvailableBalance} ${firstWallet.symbol}`,
    //                                 logo: firstWallet.logo

    //             };
    //         }
    //       }
    // })
//    .addCase(getAllBalanceThunk.fulfilled, (state, action) => {
//   state.loading = false;
//   state.allBalances = action.payload;

//   const balances = action.payload?.data?.balances;
//   const fetchedKeys = action.payload?.data?.fetchedSuccessfully; 

//   if (balances && fetchedKeys && fetchedKeys.length > 0) {
//     // Only auto-select if we don't have a selection yet
//     if (!state.selectedBalance || state.selectedBalance.symbol === "") {
      
//       // Get the first successful key (e.g., 'btc')
//       const firstKey = fetchedKeys[0];
//       const firstWallet = balances[firstKey];

//       if (firstWallet ) {
//         // Map the API fields to your SelectedBalance type
//         state.selectedBalance = {
//           symbol: firstWallet.symbol,
//           // Use the price field from your API log 
//           usd: firstWallet.TotalAvailableBalancePrice || "$0.00",
//           amount: `${firstWallet.totalAvailableBalance} ${firstWallet.symbol}`,
//           logo: firstWallet.logo,
//           isWalletAvailable: firstWallet.isWalletAvailable
//         };
//       }
//     }
//   }
// })
.addCase(getAllBalanceThunk.fulfilled, (state, action) => {
  state.loading = false;
  state.allBalances = action.payload;

  const balances = action.payload?.data?.balances;
  const fetchedKeys = action.payload?.data?.fetchedSuccessfully;
  // 1. Get Fiat Accounts
  const fiatAccounts = action.payload?.data?.fiatAccounts;

  // Only auto-select if we don't have a selection yet
  if (!state.selectedBalance || state.selectedBalance.symbol === "") {
    
    // 2. PRIORITY: Check if User has Fiat Account
    if (fiatAccounts && fiatAccounts.length > 0) {
      const firstFiat = fiatAccounts[0];
      
      state.selectedBalance = {
        symbol: firstFiat.currency, // e.g., "NGN"
        // Fiat doesn't usually have a 'usd' price field, so we just show the currency code or formatted balance
        usd: `${firstFiat.currency} ${firstFiat.availableBalance}`, 
        amount: `${firstFiat.availableBalance}`, 
        // You can set a static flag for NGN/Fiat here since the API might not return a logo
        logo: "https://flagcdn.com/w40/ng.png", 
        isWalletAvailable: true
      };
    } 
    // 3. FALLBACK: Use Crypto if no Fiat found
    else if (balances && fetchedKeys && fetchedKeys.length > 0) {
      const firstKey = fetchedKeys[0];
      const firstWallet = balances[firstKey];

      if (firstWallet) {
        state.selectedBalance = {
          symbol: firstWallet.symbol,
          usd: firstWallet.TotalAvailableBalancePrice || "$0.00",
          amount: `${firstWallet.totalAvailableBalance} ${firstWallet.symbol}`,
          logo: firstWallet.logo,
          isWalletAvailable: firstWallet.isWalletAvailable
        };
      }
    }
  }
})
    .addCase(getAllBalanceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

  },
});

export const { setWallets, addWallet, setCoins, setNetworks, clearWallets, setSelectedBalance } =
  walletSlice.actions;
export default walletSlice.reducer;
