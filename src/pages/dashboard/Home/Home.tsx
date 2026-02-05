import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Add, Send2, Convert, EyeSlash, Eye, ArrowSwapVertical, TransmitSqaure2, ArrowDown2 } from "iconsax-react";
import Coins from "@/assets/coin.svg"
import CoinsMobile from "@/assets/CoinsMobile.png"
import Search from "@/assets/search.png"
import { Button } from "@/components/ui/button";
import WalletModal from "./Components/FundWalletModal";
import Modal from "@/components/ui/Modal";
import SendOptionsModal from "./Components/Send/SendModal";
import { useNavigate } from "react-router-dom";
import FundOptionsModal from "./Components/Fund/FundOptionsModal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { getTransactionsThunk } from "@/store/transactions/asyncThunks/getTransactions";
import { getAllBalanceThunk } from "@/store/wallet/asyncThunks/getBalances";


const Home: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showBalance, setShowBalance] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isFundingOpen, setIsFundingOpen] = useState(false)
  // 1. Get transaction data and loading state from the Redux store
    const { transactions: fetchedTransactions, loading: transactionsLoading, error: transactionsError   } = useSelector((state: RootState) => state.transaction);
    
const {selectedBalance, allBalances } = useSelector((state: RootState) => state.wallet);
const defaultFiatBalance = useMemo(() => {
    const fiatAccount = allBalances?.data?.fiatAccounts?.[0]; // Get the first fiat account
    
    if (fiatAccount) {
      return {
        symbol: fiatAccount.currency,
        
        usd: `${fiatAccount.currency} ${fiatAccount.availableBalance}`, 
        amount: `${fiatAccount.availableBalance} ${fiatAccount.currency}`,
        logo: "https://flagcdn.com/w40/ng.png" 
      };
    }
    return null;
  }, [allBalances]);
  // console.log()
  const displayedBalance = selectedBalance?.symbol ? selectedBalance : defaultFiatBalance || 
  {
    symbol: "",
    usd: "$0.00",
    amount: "0.00 XXX",
    logo: ""
  }

  // console.log(displayedBalance)

  // Casting to 'any' to handle the nested structure safely as done before
  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;
  
  // Check conditions: Show reminder if PIN is NOT found OR User is NOT verified
  const hasPin = userData?.isPinAvailable?.found === true;
  const isVerified = userData?.verified === true;
  const showReminder = !hasPin || !isVerified;
  
  // 3. Fetch transactions on component mount
   useEffect(() => {
  const token = localStorage.getItem("azertoken");
  if (token) {
    // 1. Fetch transactions immediately
    dispatch(getTransactionsThunk({ token }) as any);

    if (!selectedBalance) {
      dispatch(getAllBalanceThunk({ token }) as any);
    }
  }
}, [dispatch]); 


    // const processedTransactions = fetchedTransactions.map(mapListToDisplay);
    console.log(fetchedTransactions)
    // console.log(processedTransactions)

  const handleSelectOption = (option: "crypto" | "fiat") => {
    setIsSendModalOpen(false);
    if (option === "crypto") {
      // Navigate to crypto send flow
      navigate("/dashboard/send-crypto");
    } else {
      // Navigate to fiat send flow
      navigate("/dashboard/send-fiat");
    }
  };


  const handleToggle = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <DashboardLayout>
      {/* Balance Section */}
      <div className="md:w-[50%]">
        <div className="mb-6  ">
          <div className="flex items-start justify-between">
            <div>
              <h3 onClick={() => setWalletOpen(true)} 
              className="text-primary text-xs cursor-pointer mb-4 flex gap-2 bg-[#F5F5F5] w-fit p-2 rounded-full">
                
                <img src={displayedBalance.logo} alt="logo"  className="h-4 w-4 rounded-full"/>
                {displayedBalance.symbol} 
                <ArrowDown2 size="14" color="#262626" className="inline" />
                </h3>
             
              <p className="text-[28px] text-[#777777]">
                <span className="text-primary text-5xl">
                  {showBalance
                    ? String(displayedBalance.amount).replace('$', '') 
                    : <span className="text-[#D2D2D2]"> ***** </span>}
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {showBalance
                  ? String(displayedBalance.usd)
                  : "*******"}
                <ArrowSwapVertical size="14" color="black" variant="Outline" className="inline ml-2" />
              </p>
            </div>
            <button onClick={handleToggle} className="cursor-pointer">
              {showBalance ? (
                <Eye size="16" color="#777777" />
              ) : (
                <EyeSlash size="16" color="#0647F7" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4 text-sm">
            <button onClick={() => setIsFundingOpen(true)} className="flex items-center space-x-2 px-[20px] py-[12px] bg-primaryblue text-white rounded-full hover:bg-blue-700 cursor-pointer">
              <span>Fund</span><Add size={16} color="white" />
            </button>
            <button onClick={() => setIsSendModalOpen(true)} className="flex items-center space-x-2 px-[20px] py-[12px] bg-bggray hover:bg-[#777777]  text-primary rounded-full cursor-pointer">
              <span>Send</span> <Send2 size={16} color="black" />
            </button>
            <button onClick={() => navigate('/dashboard/convert')} className="flex items-center space-x-2 px-[20px] py-[12px] bg-bggray hover:bg-[#777777] text-primary rounded-full cursor-pointer">
              <span>Convert</span><Convert size={16} color="black" />
            </button>
          </div>
        </div>

       

        {/* --- REMINDER CARD (Conditional) --- */}
        {showReminder && (
          <>
            {/* Desktop Version */}
            <div 
              onClick={() => navigate('/cta')} // Navigate to CTA on click
              className="bg-bggray rounded-[16px] px-4 hidden md:flex items-start justify-between mb-6 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div>
                <h2 className="font-[500] text-primary pt-4">Almost there! 🚀</h2>
                <p className="text-neutral mt-2">
                  Finish setting up your details to start sending!
                </p>
              </div>
              <img src={Coins} alt="coins" />
            </div>

            {/* Mobile Version */}
            <div 
              onClick={() => navigate('/cta')} // Navigate to CTA on click
              className="bg-bggray rounded-xl px-4 flex gap-2 md:hidden items-center justify-between mb-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <img src={CoinsMobile} alt="coins" />
              <div>
                <h2 className="font-[500] text-primary text-sm">Almost there! 🚀</h2>
                <p className="text-neutral mt-1 text-sm">
                  Finish setting up your details to start sending!
                </p>
              </div>
            </div>
          </>
        )}

        {/* Transactions Section
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-800">Recent transaction</h2>
            {!transactionsLoading && !transactionsError && processedTransactions.length > 0 ? (
              // <button className="text-sm text-[#0647F7] hover:underline">
              //   See all
              // </button>
              <Button variant={'outline'} onClick={() => navigate('/dashboard/transactions')}>See all</Button>
            )}
          </div>

          {!transactionsLoading && !transactionsError && processedTransactions.length > 0 ? (
            <div className="">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-3 px-2"
                >
                  <div className="flex items-center space-x-3 gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center relative ${tx.color}`}
                    >
                      <span className="text-xs font-semibold text-gray-700">
                        {tx.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div className={`${tx.tagColor} p-1 rounded-full absolute left-8 top-6`}>

                        <TransmitSqaure2 size="14" color="#697689" variant="Outline" className="" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base">{tx.name}</p>
                      <p
                        className={`text-xs md:text-sm ${tx.textColor}  mt-1`}
                      >
                        {tx.status}
                        <span className="text-gray-400 ml-1">. {tx.time}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-primary text-sm md:text-base">{tx.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl">
              <img
                src={Search}
                alt="No transactions"
                className="w-12 h-12 opacity-50 mb-3"
              />
              <p className="text-gray-500 text-sm">No transactions yet</p>
              <p className="text-gray-400 text-xs mt-1 text-center">
                Looks like things are quiet here. Start your first transaction
                to get things moving.
              </p>
              <button className="mt-4 px-5 py-2 bg-[#0647F7] text-white rounded-full hover:bg-blue-700">
                Fund wallet
              </button>
            </div>
          )}
        </div> */}
        {/* Transactions Section */}
<div>
  <div className="flex justify-between items-center mb-3">
    <h2 className="font-semibold text-primary">Recent transaction</h2>
    {/* Use processedTransactions length for the See all button */}
    {!transactionsLoading && !transactionsError && fetchedTransactions.length > 0 && (
      <Button variant={'outline'} onClick={() => navigate('/dashboard/transactions')}>See all</Button>
    )}
  </div>

  {/* Display Loading/Error State (handled correctly in the previous step, keeping it separate) */}
  {transactionsLoading && (
    <p className="text-center text-primary p-10">Loading transactions...</p>
  )}
  {transactionsError && (
    <p className="text-center text-danger p-10">Error fetching transactions: {transactionsError}</p>
  )}

  {/* Display Fetched Transactions (using processedTransactions) */}
  {!transactionsLoading && !transactionsError && fetchedTransactions.length > 0 ? (
  <div className="">
    {fetchedTransactions.map((tx) => {
      // --- LOGIC TO DERIVE UI PROPS FROM RAW DATA ---
      
      // 1. Determine Display Name
      // If it's a payout (outgoing), show recipient. If deposit (incoming), show sender.
      const displayName = tx.recipient_name || tx.sender_name || "Unknown Transaction";

      // 2. Determine Status Colors
      let statusColor = "text-yellow-500"; // Default pending
      let bgColor = "bg-yellow-100";
      let tagColor = "bg-gray-100";

      if (tx.status === 'completed') {
        statusColor = "text-green-500";
        bgColor = "bg-green-100"; // For the circle icon background
        tagColor = "bg-[#E8F8F0]"; // For the small tag icon
      } else if (tx.status === 'failed') {
        statusColor = "text-red-500";
        bgColor = "bg-red-100";
        tagColor = "bg-red-50";
      }

      // 3. Format Date
      const dateObj = new Date(tx.created_at);
      const timeDisplay = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Or simply: const timeDisplay = tx.created_at.split('T')[0];

      // 4. Format Amount (Add - for payouts)
      const isOutgoing = tx.transaction_type === 'payout' || tx.option_type === 'send';
      const amountPrefix = isOutgoing ? "-" : "+";
      // const displayAmount = `${amountPrefix}${tx.currency_sign}${tx.amount}`;
      let displayAmount = "";

      if (tx.asset_type === 'crypto') {
        // Crypto Format: "2 BTC"
        displayAmount = `${amountPrefix}${tx.amount} ${tx.asset}`;
      } else {
        // Fiat Format: "₦50.00" (Fallback to empty string if sign is null)
        const sign = tx.currency_sign || ""; 
        displayAmount = `${amountPrefix}${sign}${tx.amount}`;
      }

      return (
        <div
          key={tx.id}
          className="flex justify-between items-center py-3 px-2 border-b border-gray-50 last:border-none"
        >
          <div className="flex items-center space-x-3 gap-2">
            {/* Icon Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center relative ${bgColor}`}
            >
              {/* Initials */}
              <span className="text-xs font-semibold text-gray-700">
                {displayName
                  .split(" ")
                  .slice(0, 2) // Limit to 2 initials
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
              
              {/* Small Tag Icon */}
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
) : (
    // Display No Transactions state only when not loading, no error, and list is empty
    !transactionsLoading && !transactionsError && fetchedTransactions.length === 0 && (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl">
        <img
          src={Search}
          alt="No transactions"
          className="w-12 h-12 opacity-50 mb-3"
        />
        <p className="text-primary font-semibold">No transactions yet</p>
        <p className="text-neutral text-sm mt-1 text-center max-w-xs">
          Looks like things are quiet here. Start your first transaction
          to get things moving.
        </p>
        <button onClick={() => setIsFundingOpen(true)} className="mt-4 px-5 py-2 bg-primaryblue text-white rounded-full hover:bg-blue-700 cursor-pointer">
          Fund wallet
        </button>
      </div>
    )
  )}
</div>
        {/* Fund Modal */}
        <Modal
          open={walletOpen}
          onOpenChange={setWalletOpen}
          showCloseIcon
        // closeIconColor="#0647F7"
        >
          <WalletModal onClose={() => setWalletOpen(false)} />
        </Modal>
        {/* send modal */}
        <SendOptionsModal
          open={isSendModalOpen}
          onOpenChange={setIsSendModalOpen}
          onSelectOption={handleSelectOption}
        />
        <FundOptionsModal
          open={isFundingOpen}
          onOpenChange={setIsFundingOpen}

        />
      </div>

    </DashboardLayout>
  );
};

export default Home;
