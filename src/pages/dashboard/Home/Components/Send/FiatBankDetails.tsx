import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Input from '@/components/ui/input';
import { useBanks } from '@/store/hooks/useBanks';
import { HeaderWithCancel } from '@/components/onboarding/shared/Header';
import { ArrowLeft2 } from 'iconsax-react';
import { useVerifyBankAccount } from '@/store/hooks/useVerifyBankDetails';

interface EnterBankDetailsProps {
  country: string;
  onBack: () => void;
  onSubmit: (data: { name: string; bankName: string; accountNumber: string; transitNumber: string; country: string }) => void;
}

const EnterBankDetails: React.FC<EnterBankDetailsProps> = ({ country, onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transitNumber, setTransitNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { banks } = useBanks(country);
  const [bankCode, setBankCode] = useState("");
  
  const {
    verifyAccount,
    accountName,
    loading: verifying,
    error: verifyError,
  } = useVerifyBankAccount();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bankName || !accountNumber || !accountName) return;

    setIsSubmitting(true);
    // Simulate delay
    setTimeout(() => {
      onSubmit({
        name,
        bankName,
        accountNumber,
        transitNumber,
        country,
      });
      setIsSubmitting(false);
    }, 500);
  };

  // Helper for the display name of the country
  const getCountryDisplay = (code: string) => {
    switch (code.toUpperCase()) {
      case 'CAD': return '🇨🇦 Canada';
      case 'NGN': return '🇳🇬 Nigeria';
      case 'GHS': return '🇬🇭 Ghana';
      case 'PHP': return '🇵🇭 Philippines';
      default: return code;
    }
  };



  return (
    <>
      <div className="hidden md:block">
        <HeaderWithCancel />
      </div>
      <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={onBack}>
        <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm ">Back</p>
      </div>
      <div className="w-full max-w-md mt-16 md:mt-0 flex flex-col mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <h2 className="text-[28px] font-bold text-[#262626]">Enter recipient&apos;s bank details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#777777] ml-1">Full Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Recipient's full legal name"
              className=""
            />
          </div>

          {/* Bank Name Custom Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#777777] ml-1">Bank Name</label>
            <Select
              placeholder="Select bank"
              value={bankName}
              onChange={(selectedName) => {
                const selectedBank = banks.find(
                  (bank) => bank.name === selectedName
                );

                if (!selectedBank) return;

                setBankName(selectedBank.name);
                setBankCode(selectedBank.code); //  AUTO SET
                 // Reset verification when bank changes
              setAccountNumber("");
              }}
              options={banks.map((bank) => ({
                label: bank.name,
                value: bank.name,
              }))}
            />

          </div>

          {/* Account Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#777777] ml-1">Account Number</label>
            <Input
              type="number"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setAccountNumber(value);
                verifyAccount(value, bankCode);
                  // Reset state on edit

              }}

              placeholder="Recipient's bank account number"
              className=""
            />
          </div>
          {verifying && (
            <p className="text-sm text-gray-500 mt-1">
              Verifying account...
            </p>
          )}

          {accountName && (
            <p className="text-sm text-green-600 mt-1 font-medium">
              ✓ {accountName}
            </p>
          )}

          {verifyError && (
            <p className="text-sm text-red-500 mt-1">
              {verifyError}
            </p>
          )}


          {/* Transit Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#777777] ml-1">Transit number</label>
            <Input
              type="text"
              value={transitNumber}
              onChange={(e) => setTransitNumber(e.target.value)}
              placeholder="Transit/Branch number (optional)"
              className=""
            />
          </div>

          {/* Country (Read-only Display) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#777777] ml-1">Country</label>
            <div className="w-full flex items-center justify-between bg-[#F5F5F5] rounded-full py-3 px-6 text-gray-700">
              <span className="font-medium">
                {getCountryDisplay(country)}
              </span>
              <Lock size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !bankName || !accountNumber || !name}
              className="w-full py-7 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EnterBankDetails;