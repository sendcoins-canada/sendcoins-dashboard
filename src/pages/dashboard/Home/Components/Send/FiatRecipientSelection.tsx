import React, { useState, useEffect } from 'react';
import { Search, PlusIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getRecipientsThunk } from "@/store/recipients/asyncThunks/getAllRecipients";
import { HeaderWithCancel } from '@/components/onboarding/shared/Header';
import { ArrowLeft2 } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';

interface FormattedRecipient {
  keychain: string;
  name: string;
  initials: string;
  color: string;
  icon: string;
  detail: string;
  network: string;
  currency: string;
}

interface FiatRecipientSelectProps {
  country: string;
  onSelectRecipient: (data: { keychain: string; name: string; network: string; address: string }) => void;
  onAddNew: () => void;
}

const colors = [
  "bg-[#CCE9FF]",
  "bg-[#FDE2E4]",
  "bg-[#E9D6FF]",
  "bg-[#FFF4CC]",
  "bg-[#D6FFE3]",
];

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const shortenAddress = (address: string) => {
  if (!address) return "N/A";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const FiatRecipientSelect: React.FC<FiatRecipientSelectProps> = ({ country, onSelectRecipient, onAddNew }) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { recipients, hasLoaded, loading } = useSelector((state: any) => state.recipients);

  useEffect(() => {
    if (!hasLoaded && !loading) {
      const token = localStorage.getItem("azertoken");
      if (token) {
        dispatch(getRecipientsThunk({ token }) as any);
      }
    }
  }, [dispatch, hasLoaded, loading]);

  // Filter for Fiat recipients relevant to the selected country (asset)
  // const fiatRecipients = (recipients || []).filter((r: any) => r.asset === country);

  // Format recipients with initials and colors
  const formattedRecipients: FormattedRecipient[] = recipients.map((rec: any, index: number) => ({
    keychain: rec.keychain,
    name: rec.name,
    initials: getInitials(rec.name),
    color: colors[index % colors.length],
    icon: rec.logo,
    detail: rec.walletAddress,
    network: rec.network,
    currency: rec.asset
  }));

  const filteredRecipients = formattedRecipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedRecipients = filteredRecipients.reduce((groups, recipient) => {
    const firstLetter = recipient.name[0]?.toUpperCase() || '#';
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(recipient);
    return groups;
  }, {} as { [key: string]: FormattedRecipient[] });

  return (
    <>
      <div className="hidden md:block">
        <HeaderWithCancel />
      </div>
      <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
                  <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm ">Back</p>
                </div>
      <div className="w-full max-w-md mt-16 md:mt-0 flex flex-col mx-auto">
       
        <div className="flex items-center md:justify-center gap-6 mb-8">
          <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
            <ArrowLeft2 size="20" color="black" className="" />
          </div>
          

          <h2 className="md:text-2xl font-semibold text-center mx-auto w-fit">
            Choose recipient
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for recipients"
            className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm border-none focus:ring-1 focus:ring-gray-200"
          />
        </div>

        {/* Most Recent Section */}
        {!search && formattedRecipients.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-4">Most recent</p>
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {formattedRecipients.slice(0, 5).map((recipient) => (
                <div key={`recent-${recipient.keychain}`} className="flex flex-col items-center min-w-[64px]">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full relative cursor-pointer ${recipient.color} transition-transform hover:scale-110`}
                    onClick={() => onSelectRecipient({
                      keychain: recipient.keychain,
                      name: recipient.name,
                      network: recipient.network,
                      address: recipient.detail
                    })}
                  >
                    <span className="font-medium text-xs text-gray-800">{recipient.initials}</span>
                    <img
                      src={recipient.icon}
                      alt={recipient.currency}
                      className="absolute w-4 h-4 bottom-0 right-0 rounded-full border border-white bg-white shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-center mt-2 text-gray-700 truncate w-16 font-medium">{recipient.name.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grouped Recipients List */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm animate-pulse italic">Loading recipients...</div>
          ) : Object.keys(groupedRecipients).length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No recipients found for {country}</div>
          ) : (
            Object.keys(groupedRecipients)
              .sort()
              .map((letter) => (
                <div key={letter} className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">{letter}</p>
                  <div className="space-y-5">
                    {groupedRecipients[letter].map((recipient) => (
                      <div
                        key={recipient.keychain}
                        onClick={() => onSelectRecipient({
                          keychain: recipient.keychain,
                          name: recipient.name,
                          network: recipient.network,
                          address: recipient.detail
                        })}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${recipient.color} group-hover:opacity-80 transition-opacity`}>
                              <span className="font-semibold text-sm text-gray-800">
                                {recipient.initials}
                              </span>
                            </div>
                            <img
                              src={recipient.icon}
                              alt={recipient.currency}
                              className="absolute w-4 h-4 bottom-0 right-0 rounded-full border border-white bg-white shadow-sm"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-[#262626] group-hover:text-blue-600 transition-colors">
                              {recipient.name}
                            </p>
                            <p className="text-sm text-[#777777]">
                              {recipient.currency} • {shortenAddress(recipient.detail)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
 <div className="flex justify-center mt-5">
              <Button
                onClick={onAddNew}               
                className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2 w-full"
              >
                <PlusIcon />
                New Recipient
              </Button>
            </div>
                  </div>
    </>
  );
};

export default FiatRecipientSelect;