import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (val: any) => void;
  onApply: () => void;
};

const FilterDrawer: React.FC<FilterDrawerProps> = ({ open, onClose, filters, setFilters, onApply }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Date: true,
    Status: true,
    "Transaction type": true,
    "Currency type": true,
    "Fiat currency": true,
    "Crypto currency": true,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderSectionHeader = (label: string) => (
    <div
      className="flex justify-between items-center cursor-pointer mb-2"
      onClick={() => toggleSection(label)}
    >
      <h3 className="text-sm font-medium">{label}</h3>
      {openSections[label] ? (
        <div className="flex items-center gap-1 text-[#6A91FB]">
          <p className="text-xs">Collapse</p>
          <ChevronUp size={16} />
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[#6A91FB]">
          <p className="text-xs">Expand</p>
          <ChevronDown size={16} />
        </div>
      )}
    </div>
  );

  // Updated to handle state changes
  const renderOptionButtons = (sectionKey: string, options: string[]) => {
    // Determine which value is currently active in state
    // const activeValue = filters[sectionKey] || "All";
    const activeValue = sectionKey === "dateRangeValue" 
    ? filters.dateRange.value 
    : filters[sectionKey] || "All";

    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map((item) => (
          <Button
            key={item}
            type="button"
            variant="white"
            size="sm"
            // onClick={() => setFilters({ ...filters, [sectionKey]: item })}
            onClick={() => {
            if (sectionKey === "dateRangeValue") {
              // Handle nested dateRange object
              setFilters({ 
                ...filters, 
                dateRange: { ...filters.dateRange, value: item } 
              });
            } else {
              setFilters({ ...filters, [sectionKey]: item });
            }
          }}
            className={`border text-sm rounded-full transition-all ${
              item === activeValue
                ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer or Modal */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className={`fixed bg-white z-50 shadow-2xl flex flex-col ${
              isMobile
                ? "bottom-0 left-0 right-0 h-[90%] rounded-t-3xl"
                : "top-0 right-0 h-full md:w-[25%] w-[80%]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-[22px] font-semibold">Filter by</h2>
                <button 
                  onClick={() => setFilters({
                    status: "All",
                    transactionType: "All",
                    currencyType: "All",
                    fiat: "All",
                    crypto: "All",
                    dateRange: { start: "", end: "", value: "All" }
                  })}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Reset all
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Date Section */}
              <div>
                {renderSectionHeader("Date")}
                <AnimatePresence>
                  {openSections["Date"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Using a separate key for preset date ranges in state */}
                      {renderOptionButtons("dateRangeValue", ["All", "This week", "This month", "Custom"])}
                      
                      {/* <div className="flex items-center gap-2 pb-2 mt-2">
                        <Input 
                          type="date" 
                          value={filters.dateRange.start}
                          onChange={(e) => setFilters({
                            ...filters, 
                            dateRange: {...filters.dateRange, start: e.target.value}
                          })}
                        />
                        <span className="text-gray-400 text-sm">To</span>
                        <Input 
                          type="date" 
                          value={filters.dateRange.end}
                          onChange={(e) => setFilters({
                            ...filters, 
                            dateRange: {...filters.dateRange, end: e.target.value}
                          })}
                        />
                      </div> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Section */}
              <div>
                {renderSectionHeader("Status")}
                {openSections["Status"] && renderOptionButtons("status", ["All", "Completed", "Processing", "Failed"])}
              </div>

              {/* Transaction Type */}
              <div>
                {renderSectionHeader("Transaction type")}
                {openSections["Transaction type"] && renderOptionButtons("transactionType", ["All", "Deposit", "Withdraw", "Convert"])}
              </div>

              {/* Currency Type */}
              <div>
                {renderSectionHeader("Currency type")}
                {openSections["Currency type"] && renderOptionButtons("currencyType", ["All", "fiat", "crypto"])}
              </div>

              {/* Fiat Currency */}
              {/* <div>
                {renderSectionHeader("Fiat currency")}
                {openSections["Fiat currency"] && renderOptionButtons("fiat", ["All", "USD", "EUR", "GBP", "NGN"])}
              </div> */}

              {/* Crypto Currency */}
              <div>
                {renderSectionHeader("Crypto currency")}
                {openSections["Crypto currency"] && renderOptionButtons("crypto", ["All", "btc", "eth", "bnb"])}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t flex gap-3 bg-white">
              <Button
                size="lg"
                className="bg-[#0647F7] text-white hover:bg-[#2563EB] flex-1 rounded-full h-12 font-bold"
                variant="primary"
                onClick={onApply}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;