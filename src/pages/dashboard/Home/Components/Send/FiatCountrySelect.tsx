import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getCurrency } from '@/api/wallet';
import { HeaderWithCancel } from '@/components/onboarding/shared/Header';
import { ArrowLeft2, TickCircle } from 'iconsax-react';
import Input from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FiatCountrySelectionProps {
  onBack: () => void;
  onCountrySelect: (countryCode: string) => void;
}

interface Currency {
  currency_name: string;
  currency_init: string;
  country: string;
  image: string;
  flag: string;
  currency_sign: string;
  flag_emoji: string;
}


const FiatCountrySelection: React.FC<FiatCountrySelectionProps> = ({ onBack, onCountrySelect }) => {
  const [search, setSearch] = useState('');
   const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);


    useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Consuming the API endpoint using your function
        const responseData = await getCurrency();
        
        // Setting state from response.data (which contains the array in your JSON structure)
        setCurrencies(responseData.data || []);
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
        setError("Could not load destination countries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);


  const filteredCountries = currencies.filter(
    (c) =>
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.currency_name.toLowerCase().includes(search.toLowerCase()) ||
      c.currency_init.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <>
    <div className="hidden md:block">
            <HeaderWithCancel />
          </div>
          <div className="md:flex hidden items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4" onClick={onBack}>
                      <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm ">Back</p>
                    </div>
    <div className="w-full max-w-md mt-16 md:mt-0 flex flex-col mx-auto">
      <div className="flex items-center mb-8">
     
        <h2 className="text-2xl font-bold text-gray-800">Choose destination country</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for countries"
          className="w-full pl-10 pr-3 py-2 bg-[#F5F5F5] rounded-full outline-none text-sm border-none focus:ring-1 focus:ring-gray-200"
        />
      </div>

      {/* State Handling */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching supported countries...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Country List */
         <div className="space-y-2">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.currency_name}
                  onClick={() => setSelectedCurrency(country.currency_name)}
                  className={`w-full flex items-center px-3 py-2 rounded-2xl transition-all cursor-pointer group ${
                    selectedCurrency === country.currency_name 
                      ? 'bg-[#F5F5F5]' 
                      : 'bg-white hover:bg-[#F5F5F5]'
                  }`}
                >
                  <img src={country.flag} alt="" className="w-8 h-8 rounded-full object-cover mr-4" />

                  <div className="text-left">
                    <p className={`text-sm uppercase`}>
                      {country.currency_name}
                    </p>
                   
                  </div>
                  <div className="ml-auto">
                    {selectedCurrency === country.currency_name && (
                      <TickCircle size={16} color="#34C759" variant="Bold" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm italic">No countries found matching "{search}"</p>
              </div>
            )}

          </div>
        )}
           {/* Continue Button */}
      {!loading && !error && (
        <div className="mt-8 flex justify-center ">
          <Button
            disabled={!selectedCurrency}
            onClick={() => selectedCurrency && onCountrySelect(selectedCurrency.toUpperCase())}
            className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-10 py-2 w-full"
          >
            Continue
          </Button>
        </div>
      )}
      </div>

   
    
    
    </>
  );
};

export default FiatCountrySelection;