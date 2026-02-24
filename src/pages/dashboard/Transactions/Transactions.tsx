import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SearchNormal1, Filter, TransmitSqaure2, Convert } from "iconsax-react";
import FilterDrawer from "./components/FilterDrawer";
import Input from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionsThunk } from "@/store/transactions/asyncThunks/getTransactions";
import type { RawApiTransactionList } from "@/types/transaction";
import SearchIcon from "@/assets/search.png"; // Renamed to avoid confusion with search state
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState({
    status: "All",
    transactionType: "All",
    currencyType: "All",
    fiat: "All",
    crypto: "All",
    dateRange: { start: "", end: "", value: "All" },
    // crypto_currency: "All",
    asset_type: "All"
  });

  const {
    transactions: fetchedTransactions,
    loading: transactionsLoading,
    hasLoaded,
  } = useSelector((state: RootState) => state.transaction);

  // --- Logic: Fetch Data ---
  const fetchTransactions = (currentFilters = filters) => {
    const token = localStorage.getItem("azertoken");
    if (!token) return;
    const dateFilterMapping: Record<string, string> = {
    "All": "All",
    "This week": "this_week",
    "This month": "this_month",
    "Custom": "custom"
  };

  const backendDateFilter = dateFilterMapping[currentFilters.dateRange.value] || "All";

    dispatch(getTransactionsThunk({
      token,
      date_filter: currentFilters.dateRange.start ? "custom" : backendDateFilter,
      status: currentFilters.status,
      transaction_type: currentFilters.transactionType,
      asset_type: currentFilters.currencyType,
      crypto_currency: currentFilters.crypto
    }) as any);
  };

  useEffect(() => {
    if (!hasLoaded && !transactionsLoading) {
      fetchTransactions();
    }
  }, [hasLoaded]);

  const handleApplyFilters = () => {
    fetchTransactions();
    setOpenFilter(false);
  };

  // --- Logic: Search (Local Filtering on top of Server Results) ---
  const filtered = useMemo(() => {
    return fetchedTransactions.filter((t: RawApiTransactionList) => {
      // Check names OR check if the description matches for conversions
      const nameToCheck = t.recipient_name || t.sender_name || t.description || "";
      return nameToCheck.toLowerCase().includes(search.toLowerCase());
    });
  }, [fetchedTransactions, search]);

  const handleTransactionSelect = (txId: string) => {
    if (txId) navigate(`/dashboard/transactions/${txId}`);
  };

  return (
    <DashboardLayout>
      <div className="md:w-[40%]">
        <h2 className="text-[28px] font-bold mb-4">Transaction</h2>

        <div className="relative w-full my-6 flex gap-2 items-center">
          <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for transactions"
            className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
          />
          <button
            className="bg-[#F5F5F5] p-2 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={18} color="#262626" />
          </button>
        </div>

        {transactionsLoading ? (
           <div className="flex justify-center py-20 text-primary animate-pulse font-medium">
             Loading transactions...
           </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <img src={SearchIcon} alt="No transactions" className="w-12 h-12 opacity-50 mb-3" />
            <p className="text-base font-medium">No transactions found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filtered.map((tx: RawApiTransactionList) => {
              // --- Irregularity Fix: Handle Conversion Names ---
              const isConversion = tx.reference?.startsWith('conv_') || tx.description?.toLowerCase().includes('conversion');
              
              let displayName = tx.recipient_name || tx.sender_name;
              if (isConversion) {
                const source = tx.metadata?.sourceAsset || "Crypto";
                const dest = tx.asset || "Fiat";
                displayName = `${source} to ${dest} Conversion`;
              } else if (!displayName) {
                displayName = "Unknown Transaction";
              }

              // --- Derive Status Styles ---
              const status = tx.status?.toLowerCase();
              const isCompleted = status === 'completed' || status === 'success';
              const isFailed = status === 'failed' || status === 'cancelled';
              
              const statusColor = isCompleted ? "text-green-500" : isFailed ? "text-red-500" : "text-yellow-500";
              const bgColor = isCompleted ? "bg-green-100" : isFailed ? "bg-red-100" : "bg-yellow-100";
              const tagColor = isCompleted ? "bg-[#E8F8F0]" : isFailed ? "bg-red-50" : "bg-gray-100";

              const timeDisplay = new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isOutgoing = ['payout', 'outgoing', 'send'].includes(tx.transaction_type?.toLowerCase() || tx.option_type?.toLowerCase());
              const amountPrefix = isOutgoing ? "-" : "+";

              return (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => handleTransactionSelect(tx.tx_id)}
                >
                  <div className="flex items-center space-x-3 gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${bgColor}`}>
                      {isConversion ? (
                        <Convert size="20" color="#262626" />
                      ) : (
                        <span className="text-xs font-semibold text-gray-700">
                          {displayName.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                        </span>
                      )}
                      <div className={`${tagColor} p-1 rounded-full absolute -right-1 -bottom-1 border border-white`}>
                        <TransmitSqaure2 size="14" color="#697689" variant="Outline" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base line-clamp-1">
                        {displayName}
                      </p>
                      <p className={`text-xs md:text-sm ${statusColor} mt-1 capitalize`}>
                        {tx.status}
                        <span className="text-gray-400 ml-1 font-normal lowercase">
                          • {timeDisplay}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <p className={`text-sm md:text-base font-bold ${isOutgoing ? 'text-red-500' : 'text-green-600'}`}>
                    {amountPrefix}{tx.currency_sign || ""}{Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.asset_type === 'crypto' ? tx.asset : ''}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <FilterDrawer 
        open={openFilter} 
        onClose={() => setOpenFilter(false)} 
        filters={filters} 
        setFilters={setFilters} 
        onApply={handleApplyFilters}
      />
    </DashboardLayout>
  );
};

export default Transactions;