import { CheckCircle2, Loader2, XCircle, Copy, CheckCircle } from "lucide-react";
import Send from "@/assets/Send.svg";
import { useState } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";

type TransactionStatus = "Processing" | "Successful" | "Failed";

export interface Transaction {
  id: number;
  name: string;
  status: TransactionStatus;
  time: string;
  amount: string;
  color: string;
  textColor: string;
  tagColor: string;
  currency: string;
}

interface TransactionDetailsProps {
  transaction: Transaction;
}

const statusStyles = {
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

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const { amount, currency, status } = transaction;
  const navigate = useNavigate()
  const config = statusStyles[status] || statusStyles["Processing"];
   const [activeTab, setActiveTab] = useState<"timeline" | "details">("timeline");
  const firstIncompleteIndex = config.steps.findIndex((step) => !step.done);
  const failureIndex =
    status === "Failed"
      ? firstIncompleteIndex === -1
        ? config.steps.length - 1
        : firstIncompleteIndex
      : -1;

  return (
    // <div className="bg-green-500 w-full">
          <div className="flex flex-col items-center justify-center px-4 pb-8 mt-10 md:mt-0">
             <div className="absolute top-0 left-6 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit mt-10 md:mt-0" onClick={() => navigate(-1)}>
                                                   <ArrowLeft2 size="20" color="black" className="" />
                                                 </div>
      {/* Header with main send icon + small status icon */}
      <div className="text-center mb-8">
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
          ~${Number(amount.replace(/[^0-9.-]+/g, "")).toFixed(2)} USD
        </p>
      </div>

      {/* Tabs */}
       <div className="flex rounded-full p-1 mb-6">
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            activeTab === "timeline" ? "bg-black text-white" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("timeline")}
        >
          Timeline
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            activeTab === "details" ? "bg-black text-white" : "text-[#262626]"
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
                className={`absolute left-[10px] top-5 h-full w-0.5 ${
                  status === "Failed"
                    ? idx < failureIndex
                      ? "bg-green-500"
                      : "bg-gray-200"
                    : step.done
                    ? "bg-green-500"
                    : "bg-gray-200"
                } ${
                  status === "Failed" && idx === failureIndex ? "relative overflow-hidden bg-green-50" : ""
                }`}
              >
                {status === "Failed" && idx === failureIndex && (
                  <span className="absolute inset-x-0 top-0 h-1/2 w-full bg-red-500" />
                )}
              </div>
            )}
            <div
              className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full ${
                step.done
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
      {/* Details View */}
      {activeTab === "details" && (
        <div className="w-full max-w-md bg-white border-6 border-[#F5F5F5] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">From</p>
              <p className="font-semibold">Your Wallet</p>
              <p className="text-xs text-gray-500">ETH | 0x89f8...a1C3</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Network</p>
              <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Ethereum
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">To</p>
              <p className="font-semibold">Dwight Schrute</p>
              <p className="text-xs text-gray-500">ETH | 0x89f8...a1C3</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === "Successful"
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
              <p className="font-semibold">Sep 14, 2025 – 2:30 PM</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Transaction ID</p>
              <p className="font-semibold flex items-center justify-end gap-1">
                TX123456789 <Copy className="w-4 h-4 text-gray-400" />
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
                <span className="text-xs text-gray-400">(5 USD)</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-gray-500 text-sm">Memo</p>
            <p className="font-semibold text-gray-800">Payment for last week</p>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default TransactionDetails;
