import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getAllBalanceThunk, getBNBBalanceThunk, getBTCBalanceThunk, getETHBalanceThunk, getUSDCBalanceThunk, getUSDTBalanceThunk } from "@/store/wallet/asyncThunks/getBalances";
import type { RootState } from "@/store";
import type { BalancesResponse } from "@/types/wallet";
import { setSelectedBalance } from "@/store/wallet/slice";
import { Bank } from "iconsax-react";


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
      symbol: wallet.symbol
    }))

    // 2. Parse Fiat Accounts
  const fiatAccounts = (allBalances?.data?.fiatAccounts || []) as any[];
  const parsedFiatWallets: ParsedWallet[] = fiatAccounts.map((account) => ({
    name: account.bankName, // Display Bank Name (e.g., Moniepoint...)
    address: account.accountNumber, // Display Account Number
    // Formatting balance (Assuming NGN for now based on your response, or use currency symbol)
    usd: account.currency === 'NGN' ? `₦${account.availableBalance}` : `${account.availableBalance} ${account.currency}`, 
    amount: `${account.availableBalance} ${account.currency}`,
    logo: "", // API doesn't return logo for fiat, handled in render
    symbol: account.currency,
    isFiat: true
  }));

  // 3. Combine Lists
  const allWallets = [...parsedFiatWallets, ...parsedCryptoWallets];

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
    
    const specificThunk = balanceThunkMap[symbol as keyof typeof balanceThunkMap];
    
    if (specificThunk && token) {
        // Dispatch the specific balance fetch thunk with the lowercase network
        dispatch(specificThunk({ token, network: network }) as any) // <-- network is now lowercase
            .unwrap()
            .then((newBalanceData: any) => {
                // If the thunk succeeds, update the displayed balance with the fresh data
                // Note: The data structure here depends on what the thunk returns
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
                // Handle error (e.g., set an error state, show a notification)
            });
    }

    onClose(); 
  };


  return (
    <div className="space-y-4 mt-4 ">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="md:text-2xl text-xl font-semibold">Your wallets</h2>
        <Button
          onClick={() => navigate("/dashboard/create-wallet")}
          className="bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
        >
          <span className="">+</span> Add Wallet
        </Button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {loading && <p className="text-center">Loading wallets...</p>}

        {!loading &&
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
          ))}
      </div>
    </div>
  );
};

export default WalletModal;
