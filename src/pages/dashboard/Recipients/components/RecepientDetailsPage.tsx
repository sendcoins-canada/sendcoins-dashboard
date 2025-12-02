import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RecipientDetails from "./RecepientDetails";
import MinimalLayout from "@/components/MinimalLayout";
import type { AppDispatch } from "@/store";
import { getSingleRecipientThunk } from "@/store/recipients/asyncThunks/getSingleRecipient";


const colors = [
  "bg-[#CCE9FF]",
  "bg-[#FDE2E4]",
  "bg-[#E9D6FF]",
  "bg-[#FFF4CC]",
  "bg-[#D6FFE3]",
];

const RecipientDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { keychain } = useParams<{ keychain: string }>();
   const [recipient, setRecipient] = useState<any | null>(null);
 const [loading, setLoading] = useState(true);
   const isMobile = window.innerWidth < 768;

    const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
useEffect(() => {
  const token = localStorage.getItem("azertoken");
  if (!token || !keychain) return;

  setLoading(true);

  dispatch(getSingleRecipientThunk({ token, keychain }))
    .unwrap()
    .then((rec) => {
      const formatted = {
        ...rec,
        initials: getInitials(rec.name),
        color: colors[Math.floor(Math.random() * colors.length)],
        coinIcon: rec.logo,
        currency: rec.asset,
        address: rec.walletAddress,
      };
      setRecipient(formatted);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [dispatch, keychain]);

    // Show loading indicator while fetching
  if (loading) {
    return (
      <div className="px-6 py-10 text-center flex justify-center items-center h-full">
        <p className="text-gray-500">Loading recipient...</p>
      </div>
    );
  }

  if (!recipient) {
    const NotFoundContent = (
      <div className="px-6 py-10 text-center">
        <h2 className="text-xl font-semibold text-danger">Recipient not found</h2>
      </div>
    );
    return isMobile ? NotFoundContent : <MinimalLayout>{NotFoundContent}</MinimalLayout>;
  }

  // No MinimalLayout on mobile
  return isMobile ? (
    <RecipientDetails recipient={recipient} />
  ) : (
    <MinimalLayout>
      <RecipientDetails recipient={recipient} />
    </MinimalLayout>
  );
};

export default RecipientDetailsPage;
