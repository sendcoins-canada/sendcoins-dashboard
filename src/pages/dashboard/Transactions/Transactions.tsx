import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SearchNormal1, Filter, ArrowLeft } from "iconsax-react";
import FilterDrawer from "./components/FilterDrawer";
import TransactionDetails from "./components/TransactionDetails";
import type { Transaction } from "./components/TransactionDetails";


const Transactions = () => {
  const [search, setSearch] = useState("");
 const [openFilter, setOpenFilter] = useState(false);
  const [transactions, _setTransactions] = useState([
    {
      id: 1,
      name: "Dwight Schrute",
      status: "Failed" as const,
      time: "Today, 4:29pm",
      amount: "$20,000",
      color: "bg-[#CCE9FF]",
      textColor: "text-red-500",
      tagColor: "bg-red-100",
      currency: "USD",
    },
    {
      id: 2,
      name: "Michael Scott",
      status: "Successful" as const,
      time: "Today, 4:29pm",
      amount: "$20,000",
      color: "bg-[#DCFCE7]",
      textColor: "text-green-500",
      tagColor: "bg-green-100",
      currency: "USD",
    },
    {
      id: 3,
      name: "Pam Beesly",
      status: "Processing" as const,
      time: "Today, 4:29pm",
      amount: "$20,000",
      color: "bg-[#FAE6FE]",
      textColor: "text-yellow-500",
      tagColor: "bg-yellow-100",
      currency: "USD",
    },
    {
      id: 4,
      name: "Kevin Malone",
      status: "Processing" as const,
      time: "Today, 4:29pm",
      amount: "$20,000",
      color: "bg-[#FEF9C3]",
      textColor: "text-yellow-500",
      tagColor: "bg-green-100",
      currency: "USD",
    },
  ]);
   const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  
  
  // 🟢 If a transaction is selected, show the details view instead
  if (selectedTransaction) {
    return (
      <DashboardLayout>
        <div className="px-6 py-8 md:w-[50%]">
          <button
            onClick={() => setSelectedTransaction(null)}
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black transition"
          >
            <ArrowLeft size={18} /> Back to Transactions
          </button>

          <TransactionDetails transaction={selectedTransaction} />
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="px-6 py-8 md:w-[50%]">
        <h2 className="text-[40px] font-bold mb-4">Transaction</h2>
        
        {/* Search */}
        <div className="relative w-full  mb-6 flex gap-2 items-center">
          <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for countries"
            className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
          />
           <button
            className="bg-[#F5F5F5] p-2 rounded-full"
            title="Filter"
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={18} color="#262626"/>
          </button>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <img
              src="/images/empty-state.png"
              alt="No transactions"
              className="w-40 h-40 mb-4"
            />
            <p className="text-base font-medium">No transactions found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTransaction(item)}
                className="flex items-center justify-between pb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color}`}
                  >
                    <span className="font-semibold text-sm text-gray-800">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-[#262626]">{item.name}</p>
                    <p className={`text-sm text-[#777777]`}>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${item.tagColor} ${item.textColor} mr-1`}
                      >
                        {item.status}
                      </span>
                      {item.time}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm text-[#262626]`}
                >
                  {item.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
       {/* Drawer */}
      <FilterDrawer open={openFilter} onClose={() => setOpenFilter(false)} />
    </DashboardLayout>
  );
};

export default Transactions;
