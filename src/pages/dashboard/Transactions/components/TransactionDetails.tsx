import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2, XCircle, Copy, CheckCircle } from "lucide-react";
import Send from "@/assets/Send.svg";
import { ArrowLeft2 } from "iconsax-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionDetailThunk } from "@/store/transactions/asyncThunks/getTransactionDetail";
import type { RawApiTransactionList } from "@/types/transaction";
import MinimalLayout from "@/components/MinimalLayout";

// --- STATUS CONFIG ---
const statusStyles = {
  Processing: {
    icon: <Loader2 className="animate-spin text-yellow-500" size={12} />,
    mainColor: "text-yellow-500",
    label: "Processing",
    steps: [
      { label: "Initiated", desc: "You started this transfer.", done: true },
      { label: "Processing", desc: "We’re moving funds through the network.", done: true },
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
      { label: "Failed", desc: "The transaction could not be completed.", done: false },
    ],
  },
};

const TransactionDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"timeline" | "details">("timeline");
  const [copied, setCopied] = useState(false);

  // 1. Get ID from URL
  const { txId } = useParams<{ txId: string }>();

  // 2. Get Raw Data from Redux
  // Ensure your slice/thunk populates 'selectedDetail' with the RawApiTransactionList object
  const { selectedDetail, detailLoading, detailError } = useSelector(
    (state: RootState) => state.transaction
  );

  // 3. Fetch data
  useEffect(() => {
    if (txId) {
      const token = localStorage.getItem("azertoken");
      if (token) {
        dispatch(getTransactionDetailThunk({ token, txId }) as any);
      }
    }
  }, [dispatch, txId]);

  // 4. Helper to copy
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 5. Shorten Address Helper
  const shortenAddress = (address: string | null) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // --- LOADING STATES ---
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

  if (!selectedDetail) {
    return <div className="p-10 text-center text-gray-500">Transaction details not found.</div>;
  }

  // --- 6. DATA MAPPING (Raw -> UI) ---
  // Cast selectedDetail to your Raw Type
  const tx = selectedDetail as unknown as RawApiTransactionList;

  // Derive Display Values
  const isCrypto = tx.asset_type === 'crypto';
  const currencySymbol = isCrypto ? tx.asset : (tx.currency_sign || "NGN"); 
  const displayAmount = `${tx.amount} ${currencySymbol}`;
  // Logic to determine Status Key for Styles
  let statusKey: "Processing" | "Successful" | "Failed" = "Processing";
  if (tx.status === 'completed') statusKey = "Successful";
  else if (tx.status === 'failed') statusKey = "Failed";

  const config = statusStyles[statusKey];

  // Date Formatting
  const dateObj = new Date(tx.created_at);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Names & Addresses
  const senderName = tx.sender_name || "Unknown Sender";
  const recipientName = tx.recipient_name || "Unknown Recipient";
  const senderAddr = tx.sender_account || "N/A";
  const recipientAddr = tx.recipient_account_number || tx.recipient_bank_code || "N/A";
  const networkDisplay = tx.network || (isCrypto ? tx.asset : "Bank Transfer");

  // Timeline Logic
  const firstIncompleteIndex = config.steps.findIndex((step) => !step.done);
  const failureIndex = statusKey === "Failed" 
    ? (firstIncompleteIndex === -1 ? config.steps.length - 1 : firstIncompleteIndex) 
    : -1;

  return (
    <MinimalLayout>
      <div className="flex flex-col items-center justify-center px-4 pb-8 mt-10 md:mt-0">
        <div className="absolute left-6 flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit mt-10 md:mt-0"
          onClick={() => navigate(-1)}>
          <ArrowLeft2 size="20" color="black" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <img src={Send} alt="Send Icon" className="w-full h-full" />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
              {config.icon}
            </div>
          </div>
          <p className="text-gray-600">You sent</p>
          <h2 className="text-4xl font-bold">{displayAmount}</h2>
          {/* Optional: Show USD eq if available in metadata */}
          <p className="text-sm text-[#0647F7] mt-1">
             {tx.metadata?.usd_value ? `~$${tx.metadata.usd_value} USD` : ""}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-full p-1 mb-6">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${activeTab === "timeline" ? "bg-black text-white" : "text-gray-500"}`}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${activeTab === "details" ? "bg-black text-white" : "text-[#262626]"}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </div>

        {/* Timeline View */}
        {activeTab === "timeline" && (
          <div className="w-full max-w-xl bg-white border-6 border-[#F5F5F5] rounded-2xl p-6">
            {config.steps.map((step, idx) => (
              <div key={idx} className="relative pl-8 pb-10 last:pb-0">
                {idx !== config.steps.length - 1 && (
                  <div className={`absolute left-[10px] top-5 h-full w-0.5 ${
                    statusKey === "Failed" && idx >= failureIndex ? "bg-gray-200" : (step.done ? "bg-green-500" : "bg-gray-200")
                  }`} />
                )}
                <div className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full ${
                  step.done ? "bg-green-500" : (statusKey === "Failed" && idx === failureIndex ? "bg-green-50 border border-red-500" : "bg-green-50")
                }`}>
                  {step.done ? <CheckCircle className="h-3 w-3 text-white" /> : 
                   (statusKey === "Failed" && idx === failureIndex ? <XCircle className="h-3 w-3 text-danger" /> : <CheckCircle className="h-3 w-3 text-gray-400" />)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{step.label}</p>
                  <p className="text-sm font-[300] text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details View */}
        {activeTab === "details" && (
          <div className="w-full max-w-md bg-white border-6 border-[#F5F5F5] rounded-2xl p-6 space-y-4">
            {/* Sender */}
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">From</p>
                <p className="font-semibold">{senderName}</p>
                <p className="text-xs text-gray-500">
                  {isCrypto ? shortenAddress(senderAddr) : senderAddr}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Network</p>
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  {networkDisplay}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Recipient */}
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">To</p>
                <p className="font-semibold">{recipientName}</p>
                <p className="text-xs text-gray-500">
                  {isCrypto ? shortenAddress(recipientAddr) : recipientAddr}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusKey === "Successful" ? "bg-green-50 text-green-600" : 
                  statusKey === "Processing" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                }`}>
                  {config.label}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Date & TxID */}
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Date & Time</p>
                <p className="font-semibold">{dateStr} – {timeStr}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Transaction ID</p>
                <p className="font-semibold flex items-center justify-end gap-1 cursor-pointer"
                   onClick={() => handleCopy(tx.tx_id)}>
                  {shortenAddress(tx.tx_id)}
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Amounts */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Platform fee</p>
                <p className="font-semibold text-gray-800">{tx.charge || "0.00"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Amount Received</p>
                <p className="font-semibold">{displayAmount}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Memo/Description */}
            <div>
              <p className="text-gray-500 text-sm">Note</p>
              <p className="font-semibold text-gray-800">{tx.description || tx.note || "No description"}</p>
            </div>
          </div>
        )}
      </div>
    </MinimalLayout>
  );
};

export default TransactionDetails;