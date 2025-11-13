// components/RecipientDetails.tsx
import { Share, Edit2, Star1, ArrowLeft2 } from "iconsax-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RecipientDetailsProps {
  recipient?: any;  
}

const RecipientDetails: React.FC<RecipientDetailsProps> = ({ recipient }) => {
    const [transactions, _setTransactions] = useState([
        {
          id: 1,
          name: "Dwight Schrute",
          status: "Failed",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#CCE9FF]",
          textColor: "text-red-500",
          tagColor: "bg-red-100",
        },
        {
          id: 2,
          name: "Michael Scott",
          status: "Successful",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#DCFCE7]",
          textColor: "text-green-500",
          tagColor: "bg-green-100",
        },
        {
          id: 3,
          name: "Pam Beesly",
          status: "Processing",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#FAE6FE]",
          textColor: "text-yellow-500",
          tagColor: "bg-yellow-100",
        },
        {
          id: 4,
          name: "Kevin Malone",
          status: "Processing",
          time: "Today, 4:29pm",
          amount: "$20,000",
          color: "bg-[#FEF9C3]",
          textColor: "text-yellow-500",
          tagColor: "bg-green-100",
        },
      ]);
      const navigate = useNavigate()
    
  return (
    <div className="px-6 py-10 flex flex-col md:flex-row md:gap-40 max-w-6xl">
      {/* Left Section */}
      <div className="flex-1/3">
       <div className="absolute left-4 md:hidden flex items-center cursor-pointer border rounded-full justify-center p-2 w-fit" onClick={() => navigate(-1)}>
                                       <ArrowLeft2 size="20" color="black" className="" />
                                     </div>
      <p className="md:text-2xl font-semibold mb-8 text-center">Profile</p>
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold text-white mb-4 relative mx-auto text-center">
          <div
            className={`w-full h-full rounded-full ${recipient.color} flex items-center justify-center`}
          >
            {recipient.initials}
          </div>
          {/* <img
            src={recipient.coinIcon}
            alt="coin"
            className="w-5 h-5 absolute bottom-0 right-0 bg-white rounded-full p-0.5"
          /> */}
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">{recipient.name}</h2>

        <div className="flex gap-4 mb-6 w-full">
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-xl w-28 h-24 flex flex-col items-center justify-center gap-1 text-[#262626]"><Share size="16" color="#777777"/>Share</button>
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-xl w-28 h-24 flex flex-col items-center justify-center gap-1 text-[#262626]"><Edit2 size="16" color="#777777"/>Edit</button>
          <button className="bg-[#F5F5F5] px-4 py-2 rounded-xl w-28 h-24 flex flex-col items-center justify-center gap-1 text-[#262626]"><Star1 size="16" color="#777777"/>Favourited</button>
        </div>

        <div className="text-sm text-gray-600 space-y-3 md:mb-6">
          <div className="flex justify-between">
            <p className="text-sm mb-1">Wallet Address</p>
            <p className="font-mono">{recipient.address}</p>
          </div>
          <div className="flex justify-between items-center gap-2 ">
            <p>Network</p>
            <div className="flex gap-1">

            <img
              src={recipient.coinIcon}
              className="w-4 h-4"
              alt="network"
              />
            <span>{recipient.currency}</span>
              </div>
          </div>
        </div>

        <button className="hidden md:block bg-primaryblue text-white px-6 py-2 rounded-full w-full hover:bg-[#003ad9]">
          Send money
        </button>
      </div>

       <div className="flex-2/3 bg-white rounded-lg py-4 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-medium text-gray-800 ">Transaction history</h3>
          <button className="text-sm  border rounded-full py-2 px-4">See all</button>
        </div>

        <div className="space-y-4 px-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${tx.color} text-sm font-semibold`}
                >
                  {tx.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#262626]">{tx.name}</p>
                  <p className="text-xs text-[#777777]">
                    <span
                      className={`py-0.5 rounded-full text-xs  ${tx.textColor} mr-1`}
                    >
                      {tx.status}
                    </span>
                    {tx.time}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#262626]">{tx.amount}</p>
            </div>
          ))}
        </div>
        <button className="md:hidden block bg-primaryblue text-white px-6 py-2 rounded-full mx-auto hover:bg-[#003ad9] mt-6">
          Send money
        </button>
      </div>
    </div>
  );
};

export default RecipientDetails;
