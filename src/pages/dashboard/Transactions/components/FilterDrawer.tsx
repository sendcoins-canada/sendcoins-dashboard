import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const FilterDrawer: React.FC<FilterDrawerProps> = ({ open, onClose }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Date: true,
    Status: true,
    "Transaction type": true,
    "Currency type": true,
    "Flat currency": true,
    "Crypto currency": true,
  });

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
            <p>Collapse</p>
        <ChevronUp size={18} className="" />
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[#6A91FB]">
            <p>Expand</p>
        <ChevronDown size={18} className="text-blue-500" />
        </div>
      )}
    </div>
  );

  const renderOptionButtons = (
    options: string[],
    active: string = "All"
  ) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {options.map((item) => (
        <Button
          key={item}
          variant={item === active ? "white" : "white"}
          size="sm"
          className={`border text-sm rounded-full ${
            item === active
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {item}
        </Button>
      ))}
    </div>
  );

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

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed top-0 right-0 h-full w-[25%] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5">
              <h2 className="text-[28px] font-semibold">Filter by</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
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
                      {renderOptionButtons([
                        "All",
                        "This week",
                        "This month",
                        "Custom",
                      ])}
                      <div className="flex items-center gap-2 pb-2">
                        <Input
                          type="date"
                          placeholder="DD/MM/YYYY"
                          className=""
                        />
                        <span className="text-gray-400 text-sm">To</span>
                        <Input
                          type="date"
                          placeholder="DD/MM/YYYY"
                          className=""
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Section */}
              <div>
                {renderSectionHeader("Status")}
                <AnimatePresence>
                  {openSections["Status"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {renderOptionButtons([
                        "All",
                        "Completed",
                        "Processing",
                        "Failed",
                      ])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Transaction Type */}
              <div>
                {renderSectionHeader("Transaction type")}
                <AnimatePresence>
                  {openSections["Transaction type"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {renderOptionButtons([
                        "All",
                        "Deposit",
                        "Withdraw",
                        "Convert",
                      ])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Type */}
              <div>
                {renderSectionHeader("Currency type")}
                <AnimatePresence>
                  {openSections["Currency type"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {renderOptionButtons(["All", "Fiat", "Crypto"])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Flat Currency */}
              <div>
                {renderSectionHeader("Flat currency")}
                <AnimatePresence>
                  {openSections["Flat currency"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {renderOptionButtons(["All", "USD", "EUR", "GBP"])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Crypto Currency */}
              <div>
                {renderSectionHeader("Crypto currency")}
                <AnimatePresence>
                  {openSections["Crypto currency"] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {renderOptionButtons(["All", "BNB", "ETH"])}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t flex gap-3">
              {/* <Button
                variant="white"
                size="lg"
                onClick={onClose}
                className="flex-1 border border-gray-300"
              >
                Cancel
              </Button> */}
              <Button size="lg" className="bg-[#0647F7] text-white hover:bg-[#2563EB] flex-1 " variant="primary">
                Apply
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
