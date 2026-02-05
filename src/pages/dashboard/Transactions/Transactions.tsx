// import { useState, useEffect } from "react";
// import DashboardLayout from "@/components/DashboardLayout";
// import { SearchNormal1, Filter, TransmitSqaure2 } from "iconsax-react";
// import FilterDrawer from "./components/FilterDrawer";
// import Input from "@/components/ui/input";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store";
// import { getTransactionsThunk } from "@/store/transactions/asyncThunks/getTransactions";
// // Import the list mapper and necessary raw types
// import { mapListToDisplay } from "@/types/transaction";
// // import type { RawApiTransactionList } from "@/types/transaction";
// import Search from "@/assets/search.png";
// import { useNavigate } from "react-router-dom";


// // The DisplayTransaction type is the output of mapListToDisplay, 
// // which has a common set of display properties (id, name, status, amount, keychain, etc.)
// type DisplayTransaction = ReturnType<typeof mapListToDisplay>;


// const Transactions = () => {
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState("");
//   const [openFilter, setOpenFilter] = useState(false);
//   const navigate = useNavigate()
  
//   // 1. Get transactions and status from Redux
//   const {
//     transactions: fetchedTransactions,
//     loading: transactionsLoading,
//   // Use error from Redux
//     hasLoaded,
    
//   } = useSelector((state: RootState) => state.transaction);
// console.log(fetchedTransactions)


//   // 3. Fetch data if not already loaded
//   useEffect(() => {
//     // Only fetch if NOT loaded and NOT currently loading
//     if (!hasLoaded && !transactionsLoading) {
//       const token = localStorage.getItem("azertoken");
//       if (token) {
//         dispatch(getTransactionsThunk({ token }) as any);
//       }
//     }
//   }, [dispatch, hasLoaded, transactionsLoading]);

  

//   // 4. Apply search filter
//   const filtered = fetchedTransactions.filter((t: DisplayTransaction) =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );
//   console.log(filtered)

//   // 5. Define the click handler to fetch details
//   const handleTransactionSelect = (item: DisplayTransaction) => {
    
//     // Use the keychain from the list item for the detail fetch
//     const txId = item.txId;

//     if (txId) {
//  navigate(`/dashboard/transactions/${txId}`); //  Navigate to the new page
//  } else {
//  console.error("Cannot view details: Missing transaction keychain.");
//  }
//   };

 


//   return (
//     <DashboardLayout>
//       <div className="md:w-[40%]">
//         <h2 className="text-[28px] font-bold mb-4">Transaction</h2>

//         {/* Search */}
//         <div className="relative w-full  my-6 flex gap-2 items-center">
//           <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
//           <Input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search for countries"
//             className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
//           />
//           <button
//             className="bg-[#F5F5F5] p-2 rounded-full"
//             title="Filter"
//             onClick={() => setOpenFilter(true)}
//           >
//             <Filter size={18} color="#262626" />
//           </button>
//         </div>

//         {/* Empty state */}
//         {filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
//             <img
//               src={Search}
//               alt="No transactions"
//               className="w-12 h-12 opacity-50 mb-3"
//             />
//             <p className="text-base font-medium">No transactions found</p>
//             <p className="text-sm text-gray-400">
//               Try adjusting your search or check back later
//             </p>
//           </div>
//         ) : (
//           <div className="flex flex-col space-y-4">
//             {filtered.map((item) => (
//                <div className="">
//                   {fetchedTransactions.map((tx) => {
//                     // --- LOGIC TO DERIVE UI PROPS FROM RAW DATA ---
                    
//                     // 1. Determine Display Name
//                     // If it's a payout (outgoing), show recipient. If deposit (incoming), show sender.
//                     const displayName = tx.recipient_name || tx.sender_name || "Unknown Transaction";
              
//                     // 2. Determine Status Colors
//                     let statusColor = "text-yellow-500"; // Default pending
//                     let bgColor = "bg-yellow-100";
//                     let tagColor = "bg-gray-100";
              
//                     if (tx.status === 'completed') {
//                       statusColor = "text-green-500";
//                       bgColor = "bg-green-100"; // For the circle icon background
//                       tagColor = "bg-[#E8F8F0]"; // For the small tag icon
//                     } else if (tx.status === 'failed') {
//                       statusColor = "text-red-500";
//                       bgColor = "bg-red-100";
//                       tagColor = "bg-red-50";
//                     }
              
//                     // 3. Format Date
//                     const dateObj = new Date(tx.created_at);
//                     const timeDisplay = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//                     // Or simply: const timeDisplay = tx.created_at.split('T')[0];
              
//                     // 4. Format Amount (Add - for payouts)
//                     const isOutgoing = tx.transaction_type === 'payout' || tx.option_type === 'send';
//                     const amountPrefix = isOutgoing ? "-" : "+";
//                     // const displayAmount = `${amountPrefix}${tx.currency_sign}${tx.amount}`;
//                     let displayAmount = "";
              
//                     if (tx.asset_type === 'crypto') {
//                       // Crypto Format: "2 BTC"
//                       displayAmount = `${amountPrefix}${tx.amount} ${tx.asset}`;
//                     } else {
//                       // Fiat Format: "₦50.00" (Fallback to empty string if sign is null)
//                       const sign = tx.currency_sign || ""; 
//                       displayAmount = `${amountPrefix}${sign}${tx.amount}`;
//                     }
              
//                     return (
//                       <div
//                         key={tx.id}
//                         className="flex justify-between items-center py-3 px-2 border-b border-gray-50 last:border-none"
//                         onClick={handleTransactionSelect}
//                       >
//                         <div className="flex items-center space-x-3 gap-2">
//                           {/* Icon Circle */}
//                           <div
//                             className={`w-12 h-12 rounded-full flex items-center justify-center relative ${bgColor}`}
//                           >
//                             {/* Initials */}
//                             <span className="text-xs font-semibold text-gray-700">
//                               {displayName
//                                 .split(" ")
//                                 .slice(0, 2) // Limit to 2 initials
//                                 .map((n) => n[0])
//                                 .join("")
//                                 .toUpperCase()}
//                             </span>
                            
//                             {/* Small Tag Icon */}
//                             <div className={`${tagColor} p-1 rounded-full absolute -right-1 -bottom-1 border border-white`}>
//                               <TransmitSqaure2 size="14" color="#697689" variant="Outline" />
//                             </div>
//                           </div>
              
//                           {/* Text Details */}
//                           <div>
//                             <p className="font-medium text-gray-800 text-sm md:text-base capitalize">
//                               {displayName.toLowerCase()}
//                             </p>
//                             <p className={`text-xs md:text-sm ${statusColor} mt-1 capitalize`}>
//                               {tx.status}
//                               <span className="text-gray-400 ml-1">
//                                 • {timeDisplay}
//                               </span>
//                             </p>
//                           </div>
//                         </div>
              
//                         {/* Amount */}
//                         <p className={`text-sm md:text-base font-semibold ${isOutgoing ? 'text-red-500' : 'text-green-600'}`}>
//                           {displayAmount}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* Drawer */}
//       <FilterDrawer open={openFilter} onClose={() => setOpenFilter(false)} />
//     </DashboardLayout>
//   );
// };

// export default Transactions;

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SearchNormal1, Filter, TransmitSqaure2 } from "iconsax-react";
import FilterDrawer from "./components/FilterDrawer";
import Input from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionsThunk } from "@/store/transactions/asyncThunks/getTransactions";
import type { RawApiTransactionList } from "@/types/transaction";
import Search from "@/assets/search.png";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  
  // 1. Get transactions (Raw Data)
  const {
    transactions: fetchedTransactions,
    loading: transactionsLoading,
    hasLoaded,
  } = useSelector((state: RootState) => state.transaction);

  // 3. Fetch data if not already loaded
  useEffect(() => {
    if (!hasLoaded && !transactionsLoading) {
      const token = localStorage.getItem("azertoken");
      if (token) {
        dispatch(getTransactionsThunk({ token }) as any);
      }
    }
  }, [dispatch, hasLoaded, transactionsLoading]);

  // 4. Apply search filter on RAW data fields
  // We check recipient_name or sender_name because 'name' doesn't exist on raw data
  const filtered = fetchedTransactions.filter((t: RawApiTransactionList) => {
    const nameToCheck = t.recipient_name || t.sender_name || "";
    return nameToCheck.toLowerCase().includes(search.toLowerCase());
  });

  // 5. Click handler
  const handleTransactionSelect = (txId: string) => {
    if (txId) {
      navigate(`/dashboard/transactions/${txId}`);
    } else {
      console.error("Cannot view details: Missing transaction ID.");
    }
  };

  return (
    <DashboardLayout>
      <div className="md:w-[40%]">
        <h2 className="text-[28px] font-bold mb-4">Transaction</h2>

        {/* Search */}
        <div className="relative w-full my-6 flex gap-2 items-center">
          <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for users"
            className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
          />
          <button
            className="bg-[#F5F5F5] p-2 rounded-full"
            title="Filter"
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={18} color="#262626" />
          </button>
        </div>

        {/* List Section */}
        {filtered.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <img
              src={Search}
              alt="No transactions"
              className="w-12 h-12 opacity-50 mb-3"
            />
            <p className="text-base font-medium">No transactions found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          // Transaction List
          <div className="flex flex-col space-y-4">
            {/* FIX: Map over 'filtered' only once. Do NOT map fetchedTransactions inside. */}
            {filtered.map((tx: RawApiTransactionList) => {
              // --- DERIVE UI PROPS ---
              const displayName = tx.recipient_name || tx.sender_name || "Unknown Transaction";
              
              let statusColor = "text-yellow-500";
              let bgColor = "bg-yellow-100";
              let tagColor = "bg-gray-100";

              if (tx.status === 'completed') {
                statusColor = "text-green-500";
                bgColor = "bg-green-100";
                tagColor = "bg-[#E8F8F0]";
              } else if (tx.status === 'failed') {
                statusColor = "text-red-500";
                bgColor = "bg-red-100";
                tagColor = "bg-red-50";
              }

              const dateObj = new Date(tx.created_at);
              const timeDisplay = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const isOutgoing = ['payout', 'outgoing', 'send'].includes(tx.transaction_type || tx.option_type);
              const amountPrefix = isOutgoing ? "-" : "+";
              
              let displayAmount = "";
              if (tx.asset_type === 'crypto') {
                displayAmount = `${amountPrefix}${tx.amount} ${tx.asset}`;
              } else {
                const sign = tx.currency_sign || ""; 
                displayAmount = `${amountPrefix}${sign}${tx.amount}`;
              }

              return (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-3 px-2 cursor-pointer "
                  onClick={() => handleTransactionSelect(tx.tx_id)} // Use raw tx_id
                >
                  <div className="flex items-center space-x-3 gap-2">
                    {/* Icon Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${bgColor}`}>
                      <span className="text-xs font-semibold text-gray-700">
                        {displayName.slice(0, 2).toUpperCase()}
                      </span>
                      <div className={`${tagColor} p-1 rounded-full absolute -right-1 -bottom-1 border border-white`}>
                        <TransmitSqaure2 size="14" color="#697689" variant="Outline" />
                      </div>
                    </div>
                    
                    {/* Text Details */}
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base capitalize">
                        {displayName.toLowerCase()}
                      </p>
                      <p className={`text-xs md:text-sm ${statusColor} mt-1 capitalize`}>
                        {tx.status}
                        <span className="text-gray-400 ml-1">
                          • {timeDisplay}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <p className={`text-sm md:text-base font-semibold ${isOutgoing ? 'text-red-500' : 'text-green-600'}`}>
                    {displayAmount}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <FilterDrawer open={openFilter} onClose={() => setOpenFilter(false)} />
    </DashboardLayout>
  );
};

export default Transactions;