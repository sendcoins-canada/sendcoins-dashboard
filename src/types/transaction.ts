
// --- 1. Main Transaction Interface (Matches Backend Response) ---
export interface RawApiTransactionList {
  id: string | number;
  tx_id: string;
  reference: string;
  crayfi_transaction_id?: string;
  
  // Amount & Asset Details
  amount: string | number;
  net_amount: string | number;
  currency_amount: string | null;
  currency_sign: string | null;
  asset: string;       // e.g. "BTC", "NGN"
  asset_type: string;  // "fiat" | "crypto"
  isFiat: boolean;
  
  // Balances
  balance_before: string | null;
  balance_after: string | null;
  
  // Transaction Details
  description: string;
  note: string | null;
  status: 'completed' | 'pending' | 'processing' | 'failed' | string;
  transaction_type: 'payout' | 'deposit' | 'outgoing' | 'incoming' | string;
  option_type: string; // e.g. "send"
  payment_method: string;
  source: string;
  network: string;
  
  // Participants
  sender_name: string | null;
  sender_account?: string | null;
  sender_bank_code?: string | null;
  
  recipient_name: string | null;
  recipient_account_number: string | null;
  recipient_bank_code: string | null;
  
  // Timestamps
  created_at: string;
  created_at_timestamp: number;
  updated_at: string;
  completed_at: string | null;
  
  // Metadata & Nullables
  metadata?: {
    usd_value?: string;
    [key: string]: any;
  };
  channel: string | null;
  charge: string | null;
  crypto_amount: string | number | null;
  crypto_sign: string | null;
}

// --- 2. Helper for List Display (Optional, but useful for Home.tsx) ---
// This aligns with how your Home component expects data
export const mapListToDisplay = (tx: RawApiTransactionList) => {
  // Determine name
  const displayName = tx.recipient_name || tx.sender_name || "Unknown Transaction";

  // Determine status color
  let statusText = "Processing";
  let textColor = "text-yellow-500";
  let tagColor = "bg-yellow-100";
  let color = "bg-yellow-100"; // Circle background

  if (tx.status === 'completed') {
    statusText = "Successful";
    textColor = "text-green-500";
    tagColor = "bg-[#E8F8F0]";
    color = "bg-green-100";
  } else if (tx.status === 'failed') {
    statusText = "Failed";
    textColor = "text-red-500";
    tagColor = "bg-red-50";
    color = "bg-red-100";
  }

  // Determine Amount format
  const isOutgoing = ['payout', 'outgoing', 'send'].includes(tx.transaction_type || tx.option_type);
  const prefix = isOutgoing ? "-" : "+";
  
  let formattedAmount = "";
  if (tx.asset_type === 'crypto') {
    formattedAmount = `${prefix}${tx.amount} ${tx.asset}`;
  } else {
    const sign = tx.currency_sign || ""; 
    formattedAmount = `${prefix}${sign}${tx.amount}`;
  }

  return {
    id: tx.id,
    txId: tx.tx_id, // Important for navigation
    name: displayName,
    status: statusText,
    time: new Date(tx.created_at).toLocaleDateString(), // Simple date
    amount: formattedAmount,
    color,
    textColor,
    tagColor,
    raw: tx // Keep reference to raw data if needed
  };
};


// --- 3. Gas Fee Types (Keep these if you use them elsewhere) ---
export interface GetGasFee {
  token?: string;
  TransactionType?: string; 
  asset: string;           
  symbol: string;          
  amount: number | string; 
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