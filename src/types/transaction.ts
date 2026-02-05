
import type { TransactionDetail as UITransaction } from "../pages/dashboard/Transactions/components/TransactionDetails"; // The rich type used by the UI

// --- A. Raw API Input Type (Transaction History List) ---
export interface RawApiTransactionList {
  id: string;
  tx_id: string;
  crayfi_transaction_id: string;
  reference: string;
  
  // Amount & Asset Details
  amount: string;
  net_amount: string;
  currency_amount: string;
  currency_sign: string; // e.g. "NGN"
  asset: string;
  asset_type: string; // "fiat" | "crypto"
  isFiat: boolean;
  
  // Balances
  balance_before: string;
  balance_after: string;
  
  // Transaction Details
  description: string;
  note: string;
  status: 'completed' | 'pending' | 'processing' | 'failed' | string;
  transaction_type: 'payout' | 'deposit' | string; // e.g. "payout"
  option_type: string; // "send"
  payment_method: string;
  source: string;
  network: string;
  
  // Participants
  sender_name: string;
  recipient_name: string | null;
  recipient_account_number: string | null;
  recipient_bank_code: string | null;
  
  // Timestamps
  created_at: string;
  created_at_timestamp: number;
  updated_at: string;
  completed_at: string | null;
  
  // Metadata & Nullables
  metadata?: any;
  channel: string | null;
  charge: string | null;
  crypto_amount: string | null;
  crypto_sign: string | null;
}
export interface Merchant {

}

// --- B. Raw API Input Type (Transaction Detail Endpoint) ---
export interface RawTransactionDetail {
    history_id: number;
    merchant: Merchant;
    reference: string;
    keychain: string;
    crypto_sign: string;
    crypto_amount: string;
    currency_sign: string;
    currency_amount: string;
    network: string | null;
    payment_method: string;
    merchant_bank_name: string;
    status: 'completed' | 'pending' | 'processing' | string;
    timestamp: string;
    // Add other fields needed for UI display, e.g., fees, exchange rates, etc.
    exchange_rate: string;
    location: string;
    createdAt: string; // Used for date/time conversion
    // ...
}

// --- C. UI Output Type (Imported from TransactionDetails) ---
// Note: We use the existing UI type (UITransaction) to ensure compatibility.
export type DisplayTransactionType = UITransaction;

// mapListToDisplay for Home.tsx/Transactions.tsx List View
export const mapListToDisplay = (tx: any) => {
  const statusMap = {
    completed: { text: "Successful", textColor: "text-green-500", tagColor: "bg-green-100" },
    pending: { text: "Processing", textColor: "text-yellow-500", tagColor: "bg-yellow-100" },
    processing: { text: "Processing", textColor: "text-yellow-500", tagColor: "bg-yellow-100" },
  };

  const status = statusMap[tx.status?.toLowerCase() as keyof typeof statusMap] || {
    text: "Failed",
    textColor: "text-red-500",
    tagColor: "bg-red-100",
  };
  
  return {
    id: tx.id,
    name: tx.destination?.name ?? "Wallet Transfer",
    status: status.text,
    time: new Date(tx.createdAt).toLocaleString(),
    amount: `${tx.type === "OUTGOING" ? "-" : "+"}${tx?.amount?.crypto || tx?.amount?.fiat} ${tx.currency?.crypto || tx.currency?.fiat}`,
    color: "bg-[#DCFCE7]",
    textColor: status.textColor,
    tagColor: status.tagColor,
    txId: tx.txId,
    // keychain: tx.merchant?.keychain,

    // For details page
    currency: tx.currency?.crypto,
    transaction_type: tx.type,
  };
};


// mapDetailToDisplay for TransactionDetails.tsx
export const mapDetailToDisplay = (tx: any): DisplayTransactionType => {
  // --- Status Mapping ---
  let transactionStatus: "Successful" | "Failed" | "Processing";

  switch (tx.status?.toLowerCase()) {
    case "completed":
      transactionStatus = "Successful";
      break;
    case "pending":
    case "processing":
      transactionStatus = "Processing";
      break;
    default:
      transactionStatus = "Failed";
  }

  // --- Date Handling (ISO String) ---
  const dateObj = new Date(tx.createdAt);
  const transactionDate = dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const transactionTime = dateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  // --- Determine Display Name ---
  const name =
    tx.merchant?.name || // BUY_SELL merchant name
    tx.destination?.name || // External wallet recipient
    tx.source?.name || // For merchant source transfers
    "Transaction";

  // --- Determine Sender/Recipient ---
  const senderWalletAddress =
    tx.source?.address ?? ""; // For BUY_SELL or WALLET

  const recipientWalletAddress =
    tx.destination?.address ??
    tx.merchant?.bankAccount ??
    "";

  // --- Determine Network ---
  const networkName =
    tx.network ||
    tx.currency?.crypto?.toUpperCase() ||
    "Unknown";

  // --- USD / Fiat Equivalent ---
  const usdEquivalent = tx.amount?.display ?? ""; // e.g. N745,000

  // --- Memo / Extra Info ---
  const memo =
    tx.paymentMethod ||
    tx.statusNotes ||
    "";

  return {
    id: tx.id,
    name,
    status: transactionStatus,
    time: dateObj.toLocaleString(),
    amount: tx.amount?.crypto ?? 0,
    currency: (tx.currency?.crypto || "").toUpperCase(),
    color: "bg-green-500",
    textColor: "text-green-500",
    tagColor: "bg-green-100",

    // Detail-specific fields
    senderWalletAddress,
    recipientWalletAddress,
    networkName,
    transactionId: tx.txId,
    transactionDate,
    transactionTime,
    usdEquivalent,
    memo,
  };
};

// gas fees
export interface GetGasFee {
  token?: string;
  TransactionType?: string; // e.g., 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'
  asset: string;           // The specific asset/currency identifier
  symbol: string;          // The symbol for the asset (e.g., 'BTC', 'ETH', 'USD')
  amount: number | string; // The amount to transact
}

export interface GasFeeData {
  isSuccess: boolean | string;
  amount: string;
  initialFeeUsd: number;
  gasFee: number;
  symbol: string;
  plusFee: number;
  minusFee: number;
  usdConversion: number;
}

export interface GasFeeResponse {
  data: GasFeeData;
}
