import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SearchNormal1 } from "iconsax-react";
import USDC from "@/assets/Usdc.svg"
import ETH from "@/assets/Eth.svg"
import RecipientDetails from "./components/RecepientDetails";
import MinimalLayout from "@/components/MinimalLayout";
import { useNavigate } from "react-router-dom";

const recipientsData = [
  {
    id: 1,
    name: "Abraham Brian",
    currency: "USDC",
    address: "0x89f8...a1C3",
    initials: "AB",
    color: "bg-[#CCE9FF]",
    coinIcon: USDC,
  },
  {
    id: 2,
    name: "Aiden Schulz",
    currency: "ETH",
    address: "0x89f8...a1C3",
    initials: "AS",
    color: "bg-[#FDE2E4]",
    coinIcon: ETH,
  },
  {
    id: 3,
    name: "Arun Shelwani",
    currency: "USDC",
    address: "0x89f8...a1C3",
    initials: "AS",
    color: "bg-[#E9D6FF]",
    coinIcon: USDC,
  },
];


const Recipients = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [selectedRecipient, _setSelectedRecipient] = useState<any | null>(null);
  const filteredRecipients = recipientsData.filter((recipient) =>
    recipient.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedRecipients = filteredRecipients.reduce((groups, recipient) => {
    const firstLetter = recipient.name[0].toUpperCase();
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(recipient);
    return groups;
  }, {} as { [key: string]: typeof recipientsData });

  const mostRecent = recipientsData; // Simplified for example purposes

  if (selectedRecipient) {
    return (
      <MinimalLayout>
        <RecipientDetails
          recipient={selectedRecipient}
        />
      </MinimalLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-6 py-8 max-w-2xl">
        <h2 className="text-[28px] font-bold mb-6">Recipients</h2>

        {/* Search Input */}
        <div className="relative w-full mb-6 flex gap-2 items-center">
          <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for countries"
            className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
          />
        </div>

        {/* Most Recent */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Most recent</p>
          <div className="flex gap-6">
            {mostRecent.map((recipient) => (
              <div key={recipient.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${recipient.color}`}>
                  <span className="font-medium text-xs">{recipient.initials}</span>
                </div>
                <p className="text-xs text-center mt-1">{recipient.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grouped Recipients by First Letter */}
        {Object.keys(groupedRecipients)
          .sort()
          .map((letter) => (
            <div key={letter} className="mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-4">{letter}</p>
              <div className="space-y-4">
                {groupedRecipients[letter].map((recipient) => (
                  <div key={recipient.id} onClick={() => navigate(`/dashboard/recipients/${recipient.id}`)} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${recipient.color}`}
                        >
                          <span className="font-semibold text-sm text-gray-800">
                            {recipient.initials}
                          </span>
                        </div>
                        <img
                          src={recipient.coinIcon}
                          alt={recipient.currency}
                          className="absolute w-4 h-4 bottom-0 right-0 rounded-full"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-[#262626]">{recipient.name}</p>
                        <p className="text-sm text-[#777777]">
                          {recipient.currency} • {recipient.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
};

export default Recipients;
