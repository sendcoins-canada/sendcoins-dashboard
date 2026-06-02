import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { getBNBBalanceThunk, getBTCBalanceThunk, getETHBalanceThunk, getUSDCBalanceThunk, getUSDTBalanceThunk } from "@/store/wallet/asyncThunks/getBalances";
import { useAppDispatch, type RootState } from "@/store";
import { setSelectedBalance } from "@/store/wallet/slice";
import { Bank } from "iconsax-react";
import NGN from '@/assets/nigerianflag.svg'
import { formatCryptoAmount, formatFiatAmount } from "@/utils/formatAmount";
import { useBalances } from "@/query/hooks/useBalances";


type ParsedWallet = {
  name: string;
  address: string;
  usd?: string; 
  amount: number | string; 
  logo: string;
  symbol: string; 
  isFiat?: boolean;
};

const balanceThunkMap = {
    'BTC': getBTCBalanceThunk,
    'ETH': getETHBalanceThunk,
    'BNB': getBNBBalanceThunk,
    'USDC': getUSDCBalanceThunk,
    'USDT': getUSDTBalanceThunk
};

const WalletModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  const shortenAddress = (address: string, chars = 6) => {
    if (!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  // Server data via React Query (auto-cached, no manual fetch needed)
  const { data: balancesData, isLoading: loading } = useBalances();
  const balances = balancesData?.data?.balances || {};

  const parsedCryptoWallets = Object.keys(balances)
    .map((key) => {
      const wallet = balances[key];
      return wallet;
    })
    .filter((wallet: any) => wallet.isWalletAvailable)
    .map((wallet: any) => ({
      name: wallet.name,
      address: shortenAddress(wallet.walletAddress),
      usd: wallet.TotalAvailableBalancePrice,
      amount: wallet.totalAvailableBalance,
      logo: wallet.logo,
      symbol: wallet.symbol,
      isFiat: false
    }))

    // 2. Parse Fiat Accounts
  const fiatAccounts = (balancesData?.data?.fiatAccounts || []) as any[];
  const parsedFiatWallets: ParsedWallet[] = fiatAccounts.map((account) => ({
    name: account.bankName,
    address: account.accountNumber,
    usd: formatFiatAmount(account.usdAvailableBalance ?? 0, { currencyCode: "USD", currencySign: "$", fallbackToCode: false }),
    amount: account.availableBalance,
    logo: NGN,
    symbol: account.currency,
    isFiat: true
  }));

 const handleWalletClick = (wallet: ParsedWallet) => {
    const symbol = wallet.symbol.toUpperCase();   
    // Convert symbol to lowercase for the network parameter as requested
    const network = wallet.symbol.toLowerCase(); 
    
    // Immediately set the currently clicked wallet for display purposes 
  dispatch(setSelectedBalance({
    usd: wallet.usd ? String(wallet.usd) : "",
    amount: wallet.amount !== undefined && wallet.amount !== null ? String(wallet.amount) : "",
    usdAmount: wallet.isFiat
      ? Number((fiatAccounts.find(a => String(a.currency).toUpperCase() === String(wallet.symbol).toUpperCase())?.usdAvailableBalance) ?? 0)
      : Number(String(wallet.usd ?? "").replace(/[^0-9.-]+/g, "")) || 0,
    symbol: wallet.symbol,
    logo: wallet.logo,
    isFiat: wallet.isFiat
  }));
    
    // const specificThunk = balanceThunkMap[symbol as keyof typeof balanceThunkMap];
    
    // if (specificThunk && token) {
    //     // Dispatch the specific balance fetch thunk with the lowercase network
    //     dispatch(specificThunk({ token, network: network }) as any) // <-- network is now lowercase
    //         .unwrap()
    //         .then((newBalanceData: any) => {
    //             // If the thunk succeeds, update the displayed balance with the fresh data
    //             // Note: The data structure here depends on what the thunk returns
    //             if (newBalanceData && newBalanceData.TotalAvailableBalancePrice) {
    //                 dispatch(setSelectedBalance({
    //                     usd: newBalanceData.TotalAvailableBalancePrice, 
    //                     amount: `${newBalanceData.totalAvailableBalance} ${newBalanceData.symbol}`, 
    //                     symbol: newBalanceData.symbol,
    //                     logo: newBalanceData.logo
    //                 }));
    //             }
    //         })
    //         .catch((error: any) => {
    //             console.error(`Failed to fetch fresh ${symbol} balance:`, error);
    //             // Handle error (e.g., set an error state, show a notification)
    //         });
    // }
    // onClose(); 
    // Only fetch fresh balance for crypto
    if (!wallet.isFiat) {
        const specificThunk = balanceThunkMap[symbol as keyof typeof balanceThunkMap];
        if (specificThunk && token) {
            dispatch(specificThunk({ token, network: network }))
                .unwrap()
                .then((newBalanceData: any) => {
          if (newBalanceData && newBalanceData.TotalAvailableBalancePrice) {
            dispatch(setSelectedBalance({
              usd: String(newBalanceData.TotalAvailableBalancePrice), 
              amount: `${newBalanceData.totalAvailableBalance} ${newBalanceData.symbol}`, 
              symbol: newBalanceData.symbol,
              logo: newBalanceData.logo
            }));
          }
                })
                .catch((error: any) => {
                    console.error(`Failed to fetch fresh ${symbol} balance:`, error);
                });
        }
    }
    onClose(); 
  };

  // Helper component to render a wallet row
  const WalletRow = ({ wallet }: { wallet: ParsedWallet }) => (
      <div
        onClick={() => handleWalletClick(wallet)}
        className={`flex justify-between items-center p-3 rounded-xl cursor-pointer border transition-colors ${
            wallet.isFiat 
            ? "bg-blue-50 border-blue-100 hover:bg-blue-100" 
            : "bg-[#F5F5F5] border-transparent hover:bg-[#EBF0FE]" 
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full p-1">
            {wallet.logo ? (
              <img
                src={wallet.logo}
                alt={`${wallet.name} icon`}
                className="w-full h-full object-contain rounded-full"
              />
            ) : (
                // If it's fiat (NGN), you might want to render a flag or specific icon here
                // For now using Bank icon as fallback
                <Bank size="20" color="#555" variant="Bold" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{wallet.name}</p>
            <p className="text-xs text-gray-500">{wallet.isFiat ? "Fiat | " : ""}{wallet.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">
            {wallet.isFiat
              ? formatFiatAmount(wallet.amount, { currencyCode: wallet.symbol, currencySign: wallet.symbol })
              : formatCryptoAmount(wallet.amount, wallet.symbol, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
          </p>
          {/* For crypto: show USD value as the small line. For fiat: hide the duplicate line. */}
          {!wallet.isFiat && wallet.usd ? (
            <p className="text-xs text-gray-500">{wallet.usd}</p>
          ) : null}
         
        </div>
      </div>
  );

  


  return (
    <div className="space-y-4 mt-4 ">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="md:text-2xl text-xl font-semibold">Your wallets</h2>
       
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {/* {loading && <p className="text-center">Loading wallets...</p>} */}

        {/* {!loading &&
          allWallets.map((wallet, i) => (
            <div
              key={i}
              onClick={() => handleWalletClick(wallet)}
              className="flex justify-between items-center border bg-[#F5F5F5] hover:bg-[#EBF0FE] p-3 rounded-xl cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {wallet.logo ? (
                    <img
                      src={wallet.logo}
                      alt={`${wallet.name} icon`}
                      className="w-7 h-7 object-contain"
                    />
                  ) : (
                    <Bank size="20" color="#555" variant="Bold" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{wallet.name}</p>
                  <p className="text-xs text-gray-500">{wallet.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{wallet.usd}</p>
                <p className="text-xs text-gray-500">{wallet.amount}</p>
              </div>
            </div>
          ))} */}
          {!loading && (
            <>
                {/* 1. FIAT SECTION */}
                {parsedFiatWallets.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 ml-1">Fiat</h3>
                        {parsedFiatWallets.map((wallet, i) => (
                            <WalletRow key={`fiat-${i}`} wallet={wallet} />
                        ))}
                    </div>
                )}

                {/* 2. CRYPTO SECTION */}
                {parsedCryptoWallets.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 ml-1">Crypto</h3>
                        {parsedCryptoWallets.map((wallet, i) => (
                            <WalletRow key={`crypto-${i}`} wallet={wallet} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {parsedFiatWallets.length === 0 && parsedCryptoWallets.length === 0 && (
                     <p className="text-center text-gray-400 py-10">No wallets found.</p>
                )}
            </>
        )}


          <div className="text-center">
           <Button
        variant="primary"
          onClick={() => navigate("/dashboard/create-wallet")}
          className=" text-white text-sm rounded-full hover:bg-blue-700 transition"
        >
          <span className="">+</span> Add Wallet
        </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
