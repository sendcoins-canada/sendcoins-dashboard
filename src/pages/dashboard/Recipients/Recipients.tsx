  import { useState, useEffect } from "react";
  import DashboardLayout from "@/components/DashboardLayout";
  import { SearchNormal1 } from "iconsax-react";
  import { useNavigate } from "react-router-dom";
  import Input from "@/components/ui/input";
  import { useDispatch, useSelector } from "react-redux";
  import type { RootState } from "@/store";
  import { getRecipientsThunk } from "@/store/recipients/asyncThunks/getAllRecipients";
import type { RawRecipient } from "@/types/recipients";
import Search from "@/assets/search.png"



  

const colors = [
  "bg-[#CCE9FF]",
  "bg-[#FDE2E4]",
  "bg-[#E9D6FF]",
  "bg-[#FFF4CC]",
  "bg-[#D6FFE3]",
];

type FormattedRecipient = RawRecipient & {
  initials: string;
  color: string;
  coinIcon: string; // your logo URL
  currency: string;
  address: string;
};

  const Recipients = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const dispatch = useDispatch()
    const { recipients, hasLoaded, loading } = useSelector((state: RootState) => state.recipients)
   
    const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};
const formattedRecipients: FormattedRecipient[] = recipients.map((rec, index) => ({
  ...rec,
  initials: getInitials(rec.name),
  color: colors[index % colors.length], // rotate colors
  coinIcon: rec.logo, // use logo for the avatar corner
  currency: rec.asset, // map asset to currency
  address: rec.walletAddress, // map walletAddress
}));

 const filteredRecipients = formattedRecipients.filter((recipient) =>
      recipient.name.toLowerCase().includes(search.toLowerCase())
    );

    const groupedRecipients = filteredRecipients.reduce((groups, recipient) => {
      const firstLetter = recipient.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(recipient);
      return groups;
    }, {} as { [key: string]: FormattedRecipient[] });

     useEffect(() => {
       // Only fetch if NOT loaded and NOT currently loading
       if (!hasLoaded && !loading) {
         const token = localStorage.getItem("azertoken");
         if (token) {
           dispatch(getRecipientsThunk({ token }) as any);
         }
       }
     }, [dispatch, hasLoaded, loading]);

     const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
   const handleSelectRecipient = async (keychain: string) => {
  
      navigate(`/dashboard/recipients/${keychain}`);
    
  }


    return (
      <DashboardLayout>
        <div className="w-full md:w-[40%]">
          <h2 className="text-[28px] font-bold mb-6">Recipients</h2>

{/* EMPTY STATE */}
        {!loading && recipients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl mt-4">
            <img
              src={Search}
              alt="No recipients"
              className="w-12 h-12 opacity-50 mb-3"
            />
            <p className="text-[#262626] font-semibold">No recipients yet</p>
            <p className="text-[#777777] text-sm mt-1 text-center max-w-xs">
              Looks like things are quiet here. Start your first transaction to
              save recipients automatically.
            </p>
            <button
              onClick={() => navigate("/dashboard/home")}
              className="mt-4 px-5 py-2 bg-[#0647F7] text-white rounded-full hover:bg-blue-700 cursor-pointer"
            >
              Send Money
            </button>
          </div>
        ) : (
        !loading && (
          <>
          {/* Search Input */}
          <div className="relative  mb-6 flex gap-2 items-center">
            <SearchNormal1 className="absolute left-3 top-2 text-gray-400" size={18} color="#262626" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for countries"
              className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm"
            />
          </div>

          {/* Most Recent */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">Most recent</p>
            <div className="flex gap-6">
              {formattedRecipients.map((recipient) => (
                <div key={recipient.keychain} className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full relative ${recipient.color}`} onClick={() => handleSelectRecipient(recipient.keychain)}>
                    <span className="font-medium text-xs">{recipient.initials}</span>
                     <img
    src={recipient.logo} // your logo url
    alt={recipient.asset}
    className="absolute w-4 h-4 bottom-0 right-0 rounded-full border border-white"
  />
                  </div>
                   {/* Logo positioned at bottom-right */}
 
                  <p className="text-xs text-center mt-1">{recipient.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grouped Recipients by First Letter */}
          {Object.keys(groupedRecipients)
            .sort()
            .map((letter) => (
              <div key={letter} className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-4">{letter}</p>
                <div className="space-y-4">
                  {groupedRecipients[letter].map((recipient) => (
                    <div key={recipient.keychain} onClick={() => handleSelectRecipient(recipient.keychain)} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${recipient.color}`}
                          >
                            <span className="font-semibold text-sm text-gray-800">
                              {recipient.initials}
                            </span>
                          </div>
                          <img
                            src={recipient.coinIcon}
                            alt={recipient.currency}
                            className="absolute w-4 h-4 bottom-0 right-0 rounded-full"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-[#262626]">{recipient.name}</p>
                          <p className="text-sm text-[#777777]">
                            {recipient.currency} • {shortenAddress(recipient.address)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </>
        )
          )}
        </div>
      </DashboardLayout>
    );
  };

  export default Recipients;
