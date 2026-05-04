import api from "./axios";

// ─── Crypto → Fiat (Sell Crypto) ─────────────────────────────────────────────

export interface ConvertCryptoParams {
  token: string;
  sourceAsset: string;
  sourceNetwork?: string;
  sourceAmount: string | number;
  destinationCurrency: string;
}

export interface ConversionResponse {
  success: boolean;
  data: {
    conversionId: number;
    reference: string;
    keychain: string;
    sourceAsset: string;
    sourceAmount: string;
    destinationCurrency: string;
    destinationAmount: string;
    exchangeRate: string;
    platformFeeAmount: string;
    finalAmount: string;
    status: string;
    createdAt: number;
    message: string;
  };
}

export const convertCryptoToFiat = async (data: ConvertCryptoParams) => {
  const response = await api.post("/user/convert/crypto-to-fiat", {
    token: data.token,
    sourceAsset: data.sourceAsset,
    sourceNetwork: data.sourceNetwork || '',
    sourceAmount: data.sourceAmount,
    destinationCurrency: data.destinationCurrency,
  });
  return response.data;
};

export const getConvertQuote = async (data: ConvertCryptoParams) => {
  const response = await api.post("/user/convert/quote", {
    token: data.token,
    sourceAsset: data.sourceAsset,
    sourceAmount: data.sourceAmount,
    destinationCurrency: data.destinationCurrency,
  });
  return response.data;
};

// ─── Fiat → Crypto (Buy Crypto) ──────────────────────────────────────────────

export interface BuyCryptoParams {
  token: string;
  sourceCurrency: string;       // 'NGN'
  sourceAmount: string | number;
  destinationAsset: string;     // 'USDT', 'BTC', etc.
  destinationNetwork: string;   // 'trc20', 'ethereum', etc.
  idempotencyKey?: string;
}

export interface BuyCryptoQuoteResponse {
  isSuccess: boolean;
  data: {
    sourceCurrency: string;
    sourceAmount: number;
    buyingRate: number;
    usdEquivalent: number;
    feePercentage: number;
    feeUsd: number;
    feeFiat: number;
    netUsd: number;
    cryptoPriceUsd: number;
    destinationAsset: string;
    destinationNetwork: string;
    destinationAmount: number;
    exchangeRate: number;
  };
}

export interface BuyCryptoExecuteResponse {
  isSuccess: boolean;
  data: {
    reference: string;
    keychain: string;
    status: string;
    sourceAmount: number;
    sourceCurrency: string;
    destinationAsset: string;
    destinationAmount: number;
    exchangeRate: number;
    platformFee: number;
    cryptoPriceUsd: number;
    autoApproved: boolean;
    requiresApproval?: boolean;
    message?: string;
  };
}

export const getBuyCryptoQuote = async (data: BuyCryptoParams) => {
  const response = await api.post("/user/buy-crypto/quote", {
    token: data.token,
    sourceCurrency: data.sourceCurrency,
    sourceAmount: data.sourceAmount,
    destinationAsset: data.destinationAsset,
    destinationNetwork: data.destinationNetwork,
  });
  return response.data;
};

export const executeBuyCrypto = async (data: BuyCryptoParams) => {
  const response = await api.post("/user/buy-crypto/execute", {
    token: data.token,
    sourceCurrency: data.sourceCurrency,
    sourceAmount: data.sourceAmount,
    destinationAsset: data.destinationAsset,
    destinationNetwork: data.destinationNetwork,
    idempotencyKey: data.idempotencyKey || `buy-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
  });
  return response.data;
};

// ─── Crypto → NGN Withdrawal (Sell Crypto for NGN) ───────────────────────────

export interface WithdrawQuoteParams {
  token: string;
  coin: string;       // 'USDT', 'USDC'
  network: string;    // 'trc20', 'bep20'
  amount: number;
}

export interface WithdrawQuoteResponse {
  isSuccess: boolean;
  data: {
    reference: string;
    sourceAsset: string;
    sourceNetwork: string;
    sourceAmount: number;
    platformFee: number;
    netCrypto: number;
    rate: number;
    rateSource: string;
    ngnAmount: number;
    expiresAt: string;
  };
}

export interface WithdrawExecuteResponse {
  isSuccess: boolean;
  data: {
    reference: string;
    status: string;
    ngnAmount: string;
    onchainTxHash: string | null;
    strategy: string;
  };
}

export const getWithdrawQuote = async (data: WithdrawQuoteParams) => {
  const response = await api.post("/user/withdraw/quote", {
    token: data.token,
    coin: data.coin,
    network: data.network,
    amount: data.amount,
  });
  return response.data;
};

export const executeWithdraw = async (data: { token: string; quoteReference: string; idempotencyKey: string }) => {
  const response = await api.post("/user/withdraw/execute", {
    token: data.token,
    quoteReference: data.quoteReference,
    idempotencyKey: data.idempotencyKey,
  });
  return response.data;
};