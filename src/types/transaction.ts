
import type { TransactionDetail as UITransaction } from "../pages/dashboard/Transactions/components/TransactionDetails"; // The rich type used by the UI

// --- A. Raw API Input Type (Transaction History List) ---
export interface RawApiTransactionList {
    history_id: number;
    crypto_sign: string;
    currency_sign: string;
    reference: string;
    keychain: string; // Used for fetching details
    asset_amount: string;
    status: 'completed' | 'pending' | 'processing' | string;
    transaction_type: 'buy' | 'sell' | string;
    timestamp: string;
}

// --- B. Raw API Input Type (Transaction Detail Endpoint) ---
export interface RawTransactionDetail {
    history_id: number;
    merchant_keychain: string;
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
    created_at: string; // Used for date/time conversion
    // ...
}

// --- C. UI Output Type (Imported from TransactionDetails) ---
// Note: We use the existing UI type (UITransaction) to ensure compatibility.
export type DisplayTransactionType = UITransaction;

// mapListToDisplay for Home.tsx/Transactions.tsx List View
export const mapListToDisplay = (tx: RawApiTransactionList) => {
    // Determine status text, color, and tag color based on tx.status
    let textColor = 'text-gray-500';
    let tagColor = 'bg-gray-100';
    let statusText = 'Unknown';
    
    switch (tx.status.toLowerCase()) {
        case 'completed':
            textColor = "text-green-500"; tagColor = "bg-green-100"; statusText = "Successful";
            break;
        case 'pending':
        case 'processing':
            textColor = "text-yellow-500"; tagColor = "bg-yellow-100"; statusText = "Processing";
            break;
        default:
            textColor = "text-red-500"; tagColor = "bg-red-100"; statusText = "Failed";
    }

    const amountSign = tx.transaction_type === 'sell' ? '-' : '+';
    const amountValue = tx.asset_amount; 
    const currency = tx.crypto_sign.toUpperCase();
    const dateObj = new Date(tx.timestamp);

    return {
        id: tx.history_id,
        keychain: tx.keychain, // Keep keychain here for fetching details later
        name: tx.reference.slice(0, 8), // Basic display name
        status: statusText, 
        time: dateObj.toLocaleString(),
        amount: `${amountSign}${amountValue} ${currency}`, // e.g., +0.00100000 BTC
        color: 'bg-[#DCFCE7]', // Fixed list color
        textColor: textColor,
        tagColor: tagColor,
        // Minimal fields required for the list item click handler:
        currency: currency, 
        transaction_type: tx.transaction_type
    };
};

// mapDetailToDisplay for TransactionDetails.tsx
export const mapDetailToDisplay = (tx: RawTransactionDetail): DisplayTransactionType => {
    
    // --- Status/Time Logic ---
    let transactionStatus: "Successful" | "Failed" | "Processing";
    
    switch (tx.status.toLowerCase()) {
        case 'completed': transactionStatus = "Successful"; break;
        case 'pending':
        case 'processing': transactionStatus = "Processing"; break;
        default: transactionStatus = "Failed";
    }
    
    const dateObj = new Date(Number(tx.created_at) * 1000); // Assuming created_at is Unix timestamp (seconds)
    const transactionDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const transactionTime = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    // --- Final Display Object (must match TransactionDetails.tsx interface) ---
    return {
        id: tx.history_id,
        name: tx.merchant_bank_name || 'N/A', // Recipient name (Merchant Name)
        status: transactionStatus,
        time: dateObj.toLocaleString(),
        amount: tx.crypto_amount, // Amount without sign for details view
        currency: tx.crypto_sign.toUpperCase(),
        color: 'bg-green-500', // Placeholder for color
        textColor: 'text-green-500', // Placeholder
        tagColor: 'bg-green-100', // Placeholder

        // --- Detail-Specific Fields ---
        senderWalletAddress: tx.keychain,
        recipientWalletAddress: tx.merchant_keychain,
        networkName: tx.network || tx.crypto_sign.toUpperCase(),
        transactionId: tx.reference,
        transactionDate: transactionDate,
        transactionTime: transactionTime,
        usdEquivalent: `${tx.currency_amount} ${tx.currency_sign.toUpperCase()}`,
        memo: `Exchanged at ${tx.exchange_rate} ${tx.currency_sign}`,
    };
};