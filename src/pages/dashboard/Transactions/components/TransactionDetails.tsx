import { useEffect } from "react";
import { CheckCircle2, Loader2, XCircle, Copy, CheckCircle } from "lucide-react";
import Send from "@/assets/Send.svg";
import { useState } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionDetailThunk } from "@/store/transactions/asyncThunks/getTransactionDetail";
import { mapDetailToDisplay } from "@/types/transaction";
import type { RawTransactionDetail } from "@/types/transaction";
import MinimalLayout from "@/components/MinimalLayout";
type TransactionStatus = "Processing" | "Successful" | "Failed";

export interface TransactionDetail {
  id: number;
  name: string; // The recipient's name
  status: TransactionStatus;
  time: string;
  amount: string; // E.g., "10.00"
  color: string;
  textColor: string;
  tagColor: string;
  currency: string; // E.g., "USDC"
  //  Added necessary fields for the Details tab (Assuming they exist on the Transaction object)
  senderWalletAddress: string; // E.g., "0x89f8...a1C3"
  recipientWalletAddress: string; // E.g., "0x89f8...a1C3"
  networkName: string; // E.g., "Ethereum"
  transactionId: string; // E.g., "TX123456789"
  transactionDate: string; // E.g., "Sep 14, 2025"
  transactionTime: string; // E.g., "2:30 PM"
  usdEquivalent: string; // E.g., "5 USD"
  memo: string; // E.g., "Payment for last week"
}


const statusStyles = {
  // ... (statusStyles object remains the same) ...
  Processing: {
    icon: <Loader2 className="animate-spin text-yellow-500" size={12} />,
    mainColor: "text-yellow-500",
    label: "Processing",
    steps: [
      { label: "Initiated", desc: "You started this transfer.", done: true },
      { label: "Processing", desc: "We’re moving funds through the network.", done: true },
      { label: "Converting", desc: "Exchanging USDC to NGN at today’s rate.", done: false },
      { label: "Completed", desc: "Funds will be delivered shortly.", done: false },
    ],
  },
  Successful: {
    icon: <CheckCircle2 className="text-green-500" size={12} />,
    mainColor: "text-green-500",
    label: "Completed",
    steps: [
      { label: "Initiated", desc: "You started this transfer.", done: true },
      { label: "Processing", desc: "We’re moving funds through the network.", done: true },
      { label: "Converting", desc: "Exchanging USDC to NGN at today’s rate.", done: true },
      { label: "Completed", desc: "Funds have been successfully delivered.", done: true },
    ],
  },
  Failed: {
    icon: <XCircle className="text-danger" size={12} />,
    mainColor: "text-red-500",
    label: "Failed",
    steps: [
      { label: "Initiated", desc: "You started this transfer.", done: true },
      { label: "Processing", desc: "We attempted to move funds through the network.", done: true },
      { label: "Converting failed", desc: "Exchanging USDC to NGN at today's rate.", done: true, failed: true },
      { label: "Failed", desc: "The transaction could not be completed.", done: false },
    ],
  },
};

const TransactionDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<"timeline" | "details">("timeline");

  // Helper to copy text to clipboard (UX improvement)
  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // 1. Get transaction ID (keychain) from URL params
  const { txId } = useParams<{ txId: string }>();
  const transactionKey = txId; // Use keychain as the unique ID

  // 2. Get state from Redux
  const { selectedDetail, detailLoading, detailError } = useSelector(
    (state: RootState) => state.transaction
  );

  // 3. Fetch data on mount/keychain change
  useEffect(() => {
    if (transactionKey) {
      const token = localStorage.getItem("azertoken");
      if (token) {
        dispatch(getTransactionDetailThunk({ token, txId: transactionKey }) as any);
      }
    }
  }, [dispatch, transactionKey]);

  // 4. Map data if available
  let transaction: TransactionDetail | null = null;
  if (selectedDetail) {
    transaction = mapDetailToDisplay(selectedDetail as RawTransactionDetail) as TransactionDetail;
  }

  // --- Rendering Logic ---

  if (detailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="ml-3 text-gray-600">Fetching transaction details...</p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="p-10 text-center">
        <XCircle className="text-danger mx-auto mb-4" size={32} />
        <h3 className="font-semibold text-danger">Error Loading Transaction</h3>
        <p className="text-sm text-gray-500">{detailError}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  // 5. Handle case where data is missing after loading
  if (!transaction) {
    if (!transactionKey) {
      return <div className="p-10 text-center text-danger">No transaction ID provided in URL.</div>;
    }
    return <div className="p-10 text-center text-gray-500">Transaction details not found.</div>;
  }

  // Destructure for local use
  const { amount, currency, status, senderWalletAddress, recipientWalletAddress, networkName, transactionId, transactionDate, transactionTime, usdEquivalent, memo, name } = transaction;


  const config = statusStyles[status] || statusStyles["Processing"];
  const firstIncompleteIndex = config.steps.findIndex((step) => !step.done);
  const failureIndex =
    status === "Failed"
      ? firstIncompleteIndex === -1
        ? config.steps.length - 1
        : firstIncompleteIndex
      : -1;

  // Helper to safely shorten address for display
  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };



  return (
    <MinimalLayout>
    <div className="flex flex-col items-center justify-center px-4 pb-8 mt-10 md:mt-0">
      <div className="absolute  left-6  flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit mt-10 md:mt-0"
        onClick={() => navigate(-1)}>
        <ArrowLeft2 size="20" color="black" className="" />
      </div>
      {/* Header with main send icon + small status icon */}
      <div className="text-center mb-8 ">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <img src={Send} alt="Send Icon" className="w-full h-full" />
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
            {config.icon}
          </div>
        </div>
        <p className="text-gray-600">You sent</p>
        <h2 className="text-4xl font-bold">
          {amount} {currency}
        </h2>
        <p className="text-sm text-[#0647F7] mt-1">
          ~${Number(amount).toFixed(2)} USD
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-full p-1 mb-6">
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${activeTab === "timeline" ? "bg-black text-white" : "text-gray-500"
            }`}
          onClick={() => setActiveTab("timeline")}
        >
          Timeline
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${activeTab === "details" ? "bg-black text-white" : "text-[#262626]"
            }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      {/* Timeline View*/}
      {activeTab === "timeline" && (
        <div className="w-full max-w-xl bg-white border-6 border-[#F5F5F5] rounded-2xl p-6 ">
          {config.steps.map((step, idx) => (
            <div key={idx} className="relative pl-8 pb-10 last:pb-0">
              {idx !== config.steps.length - 1 && (
                <div
                  className={`absolute left-[10px] top-5 h-full w-0.5 ${status === "Failed"
                      ? idx < failureIndex
                        ? "bg-green-500"
                        : "bg-gray-200"
                      : step.done
                        ? "bg-green-500"
                        : "bg-gray-200"
                    } ${status === "Failed" && idx === failureIndex ? "relative overflow-hidden bg-green-50" : ""
                    }`}
                >
                  {status === "Failed" && idx === failureIndex && (
                    <span className="absolute inset-x-0 top-0 h-1/2 w-full bg-red-500" />
                  )}
                </div>
              )}
              <div
                className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full ${step.done
                    ? "bg-green-500"
                    : status === "Failed" && idx === failureIndex
                      ? "bg-green-50 border border-red-500"
                      : "bg-green-50"
                  }`}
              >
                {step.done ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : status === "Failed" && idx === failureIndex ? (
                  <CheckCircle className="h-3 w-3 text-danger" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{step.label}</p>
                <p className="text-sm font-[300] text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Details View  UPDATED BLOCK */}
      {activeTab === "details" && (
        <div className="w-full max-w-md bg-white border-6 border-[#F5F5F5] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">From</p>
              <p className="font-semibold">Your Wallet</p>
              {/*  DYNAMIC SENDER ADDRESS */}
              <p className="text-xs text-gray-500">
                {currency} | {shortenAddress(senderWalletAddress)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Network</p>
              {/*  DYNAMIC NETWORK NAME */}
              <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                {networkName}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">To</p>
              {/*  DYNAMIC RECIPIENT NAME */}
              <p className="font-semibold">{name}</p>
              {/*  DYNAMIC RECIPIENT ADDRESS */}
              <p className="text-xs text-gray-500">
                {currency} | {shortenAddress(recipientWalletAddress)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status === "Successful"
                    ? "bg-green-50 text-green-600"
                    : status === "Processing"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  }`}
              >
                {config.label}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Date & Time</p>
              {/* 👈 DYNAMIC DATE & TIME */}
              <p className="font-semibold">
                {transactionDate} – {transactionTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Transaction ID</p>
              <p
                className="font-semibold flex items-center justify-end gap-1 cursor-pointer"
                onClick={() => handleCopy(transactionId)}
              >
                {/* 👈 DYNAMIC TRANSACTION ID */}
                {transactionId}
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-500 text-sm">Platform fee</p>
              <p className="font-semibold text-gray-800">Not applied</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500 text-sm">Amount Received</p>
              <p className="font-semibold">
                {amount} {currency}{" "}
                {/* 👈 DYNAMIC USD EQUIVALENT */}
                <span className="text-xs text-gray-400">({usdEquivalent})</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-gray-500 text-sm">Memo</p>
            {/* 👈 DYNAMIC MEMO */}
            <p className="font-semibold text-gray-800">{memo}</p>
          </div>
        </div>
      )}
    </div>
    </MinimalLayout>
  );
};

export default TransactionDetails;
