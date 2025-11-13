import { useParams } from "react-router-dom";
import RecipientDetails from "./RecepientDetails";
import MinimalLayout from "@/components/MinimalLayout";
import USDC from "@/assets/Usdc.svg";
import ETH from "@/assets/Eth.svg";

const recipientsData = [
  {
    id: 1,
    name: "Abraham Brian",
    currency: "USDC",
    address: "0x89f8...a1C3",
    initials: "AB",
    color: "bg-[#CCE9FF]",
    coinIcon: USDC,
  },
  {
    id: 2,
    name: "Aiden Schulz",
    currency: "ETH",
    address: "0x89f8...a1C3",
    initials: "AS",
    color: "bg-[#FDE2E4]",
    coinIcon: ETH,
  },
  {
    id: 3,
    name: "Arun Shelwani",
    currency: "USDC",
    address: "0x89f8...a1C3",
    initials: "AS",
    color: "bg-[#E9D6FF]",
    coinIcon: USDC,
  },
];

const RecipientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const recipient = recipientsData.find((r) => r.id === Number(id));
  const isMobile = window.innerWidth < 768;

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
