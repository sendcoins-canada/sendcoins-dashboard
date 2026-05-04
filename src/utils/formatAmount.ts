type NumberLike = number | string | null | undefined;

function toFiniteNumber(value: NumberLike): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function formatNumber(
  value: NumberLike,
  opts: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
): string {
  const n = toFiniteNumber(value);
  if (n === null) return "0.00";
  return new Intl.NumberFormat(undefined, opts).format(n);
}

function joinCurrencyPrefix(prefix: string, formatted: string) {
  // For alphabetic codes (e.g., "NGN", "USDT") use a space; for symbols (e.g., "₦", "$") use none.
  const needsSpace = /^[A-Za-z]{2,}$/.test(prefix);
  return `${prefix}${needsSpace ? " " : ""}${formatted}`;
}

const currencySymbolMap: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function normalizeCurrencyPrefix(params: {
  currencyCode: string;
  currencySign?: string;
  fallbackToCode: boolean;
}): string {
  const code = (params.currencyCode || "").toUpperCase();
  const sign = params.currencySign?.trim();
  const mapped = currencySymbolMap[code];

  // If backend sends "NGN" as the "sign", prefer the real symbol (₦).
  if (sign) {
    const signUpper = sign.toUpperCase();
    if (mapped && (signUpper === code || signUpper === "NGN" || signUpper === "USD" || signUpper === "EUR" || signUpper === "GBP")) {
      return mapped;
    }
    return sign;
  }

  if (mapped) return mapped;
  return params.fallbackToCode ? code : "";
}

export function formatFiatAmount(
  amount: NumberLike,
  params?: {
    currencyCode?: string; // e.g., "NGN"
    currencySign?: string; // e.g., "₦" (or sometimes "NGN")
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    fallbackToCode?: boolean;
  }
): string {
  const {
    currencyCode = "NGN",
    currencySign,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    fallbackToCode = true,
  } = params || {};

  const formatted = formatNumber(amount, { minimumFractionDigits, maximumFractionDigits });
  const prefix = normalizeCurrencyPrefix({ currencyCode, currencySign, fallbackToCode });
  return prefix ? joinCurrencyPrefix(prefix, formatted) : formatted;
}

export function formatCryptoAmount(
  amount: NumberLike,
  symbol: string,
  params?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 6 } = params || {};
  const formatted = formatNumber(amount, { minimumFractionDigits, maximumFractionDigits });
  return `${formatted} ${symbol}`.trim();
}

export function formatSignedAmount(
  sign: "+" | "-",
  formattedAmount: string
): string {
  return `${sign}${formattedAmount}`;
}

