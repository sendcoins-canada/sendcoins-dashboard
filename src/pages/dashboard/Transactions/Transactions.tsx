import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SearchNormal1, Filter } from "iconsax-react";
import FilterDrawer from "./components/FilterDrawer";
import Input from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionsThunk } from "@/store/transactions/asyncThunks/getTransactions";
// Import the list mapper and necessary raw types
import { mapListToDisplay } from "@/types/transaction";
import type { RawApiTransactionList } from "@/types/transaction";
import Search from "@/assets/search.png";
import { useNavigate } from "react-router-dom";


// The DisplayTransaction type is the output of mapListToDisplay, 
// which has a common set of display properties (id, name, status, amount, keychain, etc.)
type DisplayTransaction = ReturnType<typeof mapListToDisplay>;


const Transactions = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate()
  
  // 1. Get transactions and status from Redux
  const {
    transactions: fetchedTransactions,
    loading: transactionsLoading,
  // Use error from Redux
    hasLoaded,

  } = useSelector((state: RootState) => state.transaction);

  // 2. Map fetched list data to the display format (DisplayTransaction[])
  // We use 'as any' here if fetchedTransactions is typed generically in Redux, 
  // but ideally it should be typed as RawApiTransactionList[]
  const rawTransactions = fetchedTransactions as RawApiTransactionList[];
  const processedTransactions = rawTransactions.map(mapListToDisplay);

  // 3. Fetch data if not already loaded
  useEffect(() => {
    // Only fetch if NOT loaded and NOT currently loading
    if (!hasLoaded && !transactionsLoading) {
      const token = localStorage.getItem("azertoken");
      if (token) {
        dispatch(getTransactionsThunk({ token }) as any);
      }
    }
  }, [dispatch, hasLoaded, transactionsLoading]);

  

  // 4. Apply search filter
  const filtered = processedTransactions.filter((t: DisplayTransaction) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  // 5. Define the click handler to fetch details
  const handleTransactionSelect = (item: DisplayTransaction) => {
    
    // Use the keychain from the list item for the detail fetch
    const txId = item.txId;

    if (txId) {
 navigate(`/dashboard/transactions/${txId}`); //  Navigate to the new page
 } else {
 console.error("Cannot view details: Missing transaction keychain.");
 }
  };

 


  return (
    <DashboardLayout>
      <div className="md:w-[50%]">
        <h2 className="text-[40px] font-bold mb-4">Transaction</h2>

        {/* Search */}
        <div className="relative w-full my-6 flex gap-2 items-center">
          <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
          <Input
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
            <Filter size={18} color="#262626" />
          </button>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
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
          <div className="flex flex-col space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                // 🛑 Use the new click handler
                onClick={() => handleTransactionSelect(item)}
                className="flex items-center justify-between pb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color}`}
                  >
                    <span className="font-semibold text-sm text-gray-800">
                      {item.name
                        .split(" ")
                        .map((n: string) => n[0])
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