import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Add,
  Send2,
  Convert,
  EyeSlash,
  Eye,
  ArrowSwapVertical,
  TransmitSqaure2,
  ArrowDown2,
} from "iconsax-react";
import Coins from "@/assets/coin.svg";
import Search from "@/assets/search.png";
import { Button } from "@/components/ui/button";
import WalletModal from "./Components/FundWalletModal";
import Modal from "@/components/ui/Modal";
import SendOptionsModal from "./Components/Send/SendModal";
import { useNavigate } from "react-router-dom";
import FundOptionsModal from "./Components/Fund/FundOptionsModal";
import Arrow from "../../../assets/swap_vert.svg";
import Eth from "@/assets/Eth.svg";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, _setTransactions] = useState([
    {
      id: 1,
      name: "Dwight Schrute",
      status: "Failed",
      time: "Today, 4:29pm",
      amount: "+$20,000",
      color: "bg-[#CCE9FF]",
      textColor: "text-red-500",
      tagColor: "bg-red-100",
    },
    {
      id: 2,
      name: "Michael Scott",
      status: "Successful",
      time: "Today, 4:29pm",
      amount: "+$20,000",
      color: "bg-[#DCFCE7]",
      textColor: "text-green-500",
      tagColor: "bg-green-100",
    },
    {
      id: 3,
      name: "Pam Beesly",
      status: "Processing",
      time: "Today, 4:29pm",
      amount: "+$20,000",
      color: "bg-[#FAE6FE]",
      textColor: "text-yellow-500",
      tagColor: "bg-yellow-100",
    },
    {
      id: 4,
      name: "Kevin Malone",
      status: "Processing",
      time: "Today, 4:29pm",
      amount: "+$20,000",
      color: "bg-[#FEF9C3]",
      textColor: "text-yellow-500",
      tagColor: "bg-green-100",
    },
  ]);
  const [walletOpen, setWalletOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isFundingOpen, setIsFundingOpen] = useState(false);

  const handleSelectOption = (option: "crypto" | "fiat") => {
    setIsSendModalOpen(false);
    if (option === "crypto") {
      // Navigate to crypto send flow
      navigate("/dashboard/send");
    } else {
      // Navigate to fiat send flow
      console.log("Go to Fiat Send page");
    }
  };

  const handleToggle = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <DashboardLayout>
      {/* Balance Section */}
      <div className="max-w-[651px]">
        <div className="mb-6 mt-10 ">
          <div className="flex items-start justify-between">
            <div>
              <h3
                onClick={() => setWalletOpen(true)}
                className="text-[#262626] text-[12px] cursor-pointer flex items-center gap-1"
              >
                <img src={Eth} alt="ETH" className="w-4 h-4" />
                ETH <ArrowDown2 size="16" color="#262626" className="inline" />
              </h3>
              <p className="text-[28px] font-[200] text-[#777777]">
                <span className="mr-2 text-black mb-2">
                  {" "}
                  {showBalance ? (
                    "0.50"
                  ) : (
                    <span className="text-[#D2D2D2]"> ***** </span>
                  )}
                </span>
                USD
              </p>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-0">
                {showBalance ? "0.0 USDC" : "*******"}
                <img src={Arrow} alt="wave" />
              </p>
            </div>
            <button onClick={handleToggle} className="cursor-pointer">
              {showBalance ? (
                <Eye size="16" color="#777777" />
              ) : (
                <EyeSlash size="16" color="#0647F7" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => setIsFundingOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primaryblue text-white rounded-full hover:bg-blue-700"
            >
              <span>Fund</span>
              <Add size={18} color="white" />
            </button>
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-bggray text-gray-700 rounded-full hover:bg-gray-200"
            >
              <span>Send</span> <Send2 size={18} color="black" />
            </button>
            <button
              onClick={() => navigate("/dashboard/convert")}
              className="flex items-center space-x-2 px-4 py-2 bg-bggray text-gray-700 rounded-full hover:bg-gray-200"
            >
              <span>Convert</span>
              <Convert size={18} color="black" />
            </button>
          </div>
        </div>

        {/* Reminder Card */}
        <div className="bg-bggray rounded-xl px-4 hidden md:flex items-start justify-between mb-6">
          <div>
            <h2 className="text-body-md-strong text-gray-800 pt-4">
              Almost there! 🚀
            </h2>
            <p className=" text-gray-500 mt-2 text-body-sm-regular">
              Finish setting up your details to start sending!
            </p>
          </div>

          <img src={Coins} />
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-body-md-bold text-gray-800">
              Recent transaction
            </h2>
            {transactions.length > 0 && (
              // <button className="text-sm text-[#0647F7] hover:underline">
              //   See all
              // </button>
              <Button
                variant={"outline"}
                onClick={() => navigate("/dashboard/transactions")}
              >
                See all
              </Button>
            )}
          </div>

          {transactions.length > 0 ? (
            <div className="">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-3 px-2"
                >
                  <div className="flex items-center space-x-3 gap-2">
                    <div
                      className={`w-[49px] h-[49px] rounded-full flex items-center justify-center relative ${tx.color}`}
                    >
                      <span className="text-[14.29px] font-[500] text-gray-700">
                        {tx.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div
                        className={`${tx.tagColor} p-1 rounded-full absolute left-10 top-6`}
                      >
                        <TransmitSqaure2
                          size="14"
                          color="#697689"
                          variant="Outline"
                          className=""
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-body-md-strong text-gray-800">
                        {tx.name}
                      </p>
                      <p
                        className={`text-body-sm-regular ${tx.textColor}  mt-1`}
                      >
                        {tx.status}
                        <span className="text-[#777777] ml-1">. {tx.time}</span>
                      </p>
                    </div>
                  </div>
                  <p className="font-normal text-[16px] text-gray-800">
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl">
              <img
                src={Search}
                alt="No transactions"
                className="w-12 h-12 opacity-50 mb-3"
              />
              <p className="text-gray-500 text-sm">No transactions yet</p>
              <p className="text-gray-400 text-xs mt-1 text-center">
                Looks like things are quiet here. Start your first transaction
                to get things moving.
              </p>
              <button className="mt-4 px-5 py-2 bg-[#0647F7] text-white rounded-full hover:bg-blue-700">
                Fund wallet
              </button>
            </div>
          )}
        </div>
        {/* Fund Modal */}
        <Modal
          open={walletOpen}
          onOpenChange={setWalletOpen}
          showCloseIcon
          // closeIconColor="#0647F7"
        >
          <WalletModal />
        </Modal>
        {/* send modal */}
        <SendOptionsModal
          open={isSendModalOpen}
          onOpenChange={setIsSendModalOpen}
          onSelectOption={handleSelectOption}
        />
        <FundOptionsModal
          open={isFundingOpen}
          onOpenChange={setIsFundingOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;
