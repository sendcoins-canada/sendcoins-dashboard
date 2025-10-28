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

export interface SupportedCoins {
    data: [
        {
            coin: string
        }
    ]
}