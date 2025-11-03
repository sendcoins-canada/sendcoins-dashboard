export interface CurrencyResponse {
      data: [
        {
            currency_name: string,
            currency_init: string,
            country: string,
            image: string,
            currency_sign: string,
            flag: string,
            flag_emoji: string
        },
      ]
}
// Coin structure
export interface Coin {
  symbol: string;
  usd: number;
  logo: string;
  name: string;
  name_display: string;
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