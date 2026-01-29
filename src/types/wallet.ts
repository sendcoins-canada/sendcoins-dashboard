export interface Currency {
  currency_name: string;
  currency_init: string;
  country: string;
  image: string;
  currency_sign: string;
  flag: string;
  flag_emoji: string;
  id?: string; // Optional if sometimes present
}

export interface CurrencyResponse {
  success: boolean;
  data: Currency[];
}
// Coin structure
export interface Coin {
  symbol: string;
  usd: number;
  logo: string;
  name: string;
  name_display: string;
  network?: string;
}

// Main response type
export interface CoinResponse {
  coins: Record<string, Coin>;
}


export interface SupportedCoins {
    data: [
        {
            coin: string
        }
    ]
}

export interface WalletBalance {
  name: string;
  walletAddress: string;
  TotalAvailableBalancePrice: number | string;
  totalAvailableBalance: number | string;
  symbol: string;
  logo: string;
}

export interface BalancesResponse {
  [key: string]: {
    [inner: string]: WalletBalance;
  };
}
