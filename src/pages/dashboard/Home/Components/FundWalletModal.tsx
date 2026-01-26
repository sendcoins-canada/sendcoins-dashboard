import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getAllBalanceThunk, getBNBBalanceThunk, getBTCBalanceThunk, getETHBalanceThunk, getUSDCBalanceThunk, getUSDTBalanceThunk } from "@/store/wallet/asyncThunks/getBalances";
import type { RootState } from "@/store";
import type { BalancesResponse } from "@/types/wallet";
import { setSelectedBalance } from "@/store/wallet/slice";
import { Bank } from "iconsax-react";
import NGN from '@/assets/nigerianflag.svg'


type ParsedWallet = {
  name: string;
  address: string;
  usd: string; 
  amount: string; 
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
  const token = localStorage.getItem("azertoken")
  const dispatch = useDispatch()

  const shortenAddress = (address: string, chars = 6) => {
    if (!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  const { allBalances, loading } = useSelector(
    (state: RootState) => state.wallet
  );
  const balances = (allBalances?.data?.balances || {}) as BalancesResponse;

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
      amount: `${wallet.totalAvailableBalance} ${wallet.symbol}`,
      logo: wallet.logo,
      symbol: wallet.symbol,
      isFiat: false
    }))

    // 2. Parse Fiat Accounts
  const fiatAccounts = (allBalances?.data?.fiatAccounts || []) as any[];
  const parsedFiatWallets: ParsedWallet[] = fiatAccounts.map((account) => ({
    name: account.bankName, // Display Bank Name (e.g., Moniepoint...)
    address: account.accountNumber, // Display Account Number
    // Formatting balance (Assuming NGN for now based on your response, or use currency symbol)
    usd: account.currency === 'NGN' ? `₦${account.availableBalance}` : `${account.availableBalance} ${account.currency}`, 
    amount: `${account.availableBalance} ${account.currency}`,
    logo: NGN, // API doesn't return logo for fiat, handled in render
    symbol: account.currency,
    isFiat: true
  }));

  // 3. Combine Lists
  // const allWallets = [...parsedFiatWallets, ...parsedCryptoWallets];

  useEffect(() => {
    if (token) {
      dispatch(getAllBalanceThunk({ token }) as any);
    }
  }, [token, dispatch]);

 const handleWalletClick = (wallet: ParsedWallet) => {
    const symbol = wallet.symbol.toUpperCase();   
    // Convert symbol to lowercase for the network parameter as requested
    const network = wallet.symbol.toLowerCase(); 
    
    // Immediately set the currently clicked wallet for display purposes 
    dispatch(setSelectedBalance({
        usd: wallet.usd,
        amount: wallet.amount,
        symbol: wallet.symbol,
        logo: wallet.logo
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
            dispatch(specificThunk({ token, network: network }) as any)
                .unwrap()
                .then((newBalanceData: any) => {
                    if (newBalanceData && newBalanceData.TotalAvailableBalancePrice) {
                        dispatch(setSelectedBalance({
                            usd: newBalanceData.TotalAvailableBalancePrice, 
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
          <p className="font-bold text-gray-900">{wallet.usd}</p>
          <p className="text-xs text-gray-500">{wallet.amount}</p> 
         
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
