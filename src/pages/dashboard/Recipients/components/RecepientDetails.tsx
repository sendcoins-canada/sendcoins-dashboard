// components/RecipientDetails.tsx
import { ArrowLeft } from "iconsax-react";
import { useState } from "react";

interface RecipientDetailsProps {
  recipient: any;
  onBack: () => void;
}

const RecipientDetails: React.FC<RecipientDetailsProps> = ({ recipient, onBack }) => {
    const [transactions, _setTransactions] = useState([
        {
          id: 1,
          name: "Dwight Schrute",
          status: "Failed",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#CCE9FF]",
          textColor: "text-red-500",
          tagColor: "bg-red-100",
        },
        {
          id: 2,
          name: "Michael Scott",
          status: "Successful",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#DCFCE7]",
          textColor: "text-green-500",
          tagColor: "bg-green-100",
        },
        {
          id: 3,
          name: "Pam Beesly",
          status: "Processing",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#FAE6FE]",
          textColor: "text-yellow-500",
          tagColor: "bg-yellow-100",
        },
        {
          id: 4,
          name: "Kevin Malone",
          status: "Processing",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#FEF9C3]",
          textColor: "text-yellow-500",
          tagColor: "bg-green-100",
        },
      ]);

  return (
    <div className="px-6 py-10 flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="flex-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black transition"
        >
          <ArrowLeft size={18} /> Back to Recipients
        </button>

        <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold text-white mb-4 relative">
          <div
            className={`w-full h-full rounded-full ${recipient.color} flex items-center justify-center`}
          >
            {recipient.initials}
          </div>
          <img
            src={recipient.coinIcon}
            alt="coin"
            className="w-5 h-5 absolute bottom-0 right-0 bg-white rounded-full p-0.5"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">{recipient.name}</h2>

        <div className="flex gap-4 mb-6">
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-md text-sm">Share</button>
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-md text-sm">Edit</button>
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-md text-sm">Favourited</button>
        </div>

        <div className="text-sm text-gray-600 space-y-3 mb-6">
          <div>
            <p className="text-xs mb-1">Wallet Address</p>
            <p className="font-mono">{recipient.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={recipient.coinIcon}
              className="w-4 h-4"
              alt="network"
            />
            <span>{recipient.network}</span>
          </div>
        </div>

        <button className="bg-[#0047FF] text-white px-6 py-2 rounded-full hover:bg-[#003ad9]">
          Send money
        </button>
      </div>

       <div className="flex-1 bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800">Transaction history</h3>
          <button className="text-sm text-[#0047FF]">See all</button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${tx.color} text-sm font-semibold`}
                >
                  {tx.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#262626]">{tx.name}</p>
                  <p className="text-xs text-[#777777]">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${tx.tagColor} ${tx.textColor} mr-1`}
                    >
                      {tx.status}
                    </span>
                    {tx.time}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#262626]">{tx.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientDetails;
