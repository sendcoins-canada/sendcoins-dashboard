
import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, TransactionMinus, People, Setting, ArrowLeft2, LogoutCurve, ShieldTick, Lock, MessageQuestion, CloseSquare } from "iconsax-react";
import Logo from "../assets/Logosingle.png";
import Code from "../assets/Code.png"
import { useNavigate } from "react-router-dom";
import CloseAccountModal from "./CloseAccountModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/user/asyncRequests/fetchUser";
import { logout } from "@/store/auth/slice";
import { clearUser } from "@/store/user/slice";
import { resetRegistration } from "@/store/registration/slice";


type MinimalLayoutProps = {
  children: ReactNode;
};

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [hasFetched, setHasFetched] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loading && !hasFetched && !error) {
      setHasFetched(true);
      dispatch(fetchUser());
    }
  }, [dispatch, user, loading, hasFetched, error]);

  const initials = user
    ? `${user.data.first_name?.[0] ?? ""}${user.data.last_name?.[0] ?? ""}`.toUpperCase()
    : "??";


  const linkClasses =
    "group flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition-colors";
  const textClasses = "transition-colors";

  const [openModal, setOpenModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleDeleteAccount = async () => {

    console.log("Deleting account...");
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    dispatch(resetRegistration());
    setOpenSettingsModal(false);
    navigate("/login");
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white flex flex-col px-8 pt-10 z-50 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between font-bold text-lg">
          <img src={Logo} alt="logo" />
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseSquare size="24" color="black" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 mt-10">
          {/* Home */}
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Home
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${isActive ? "text-primaryblue" : "text-[#8C8C8C]"
                    }`}
                >
                  Home
                </span>
              </>
            )}
          </NavLink>

          {/* Recipients */}
          <NavLink
            to="/dashboard/recipients"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <People
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
                    }`}
                >
                  Recipients
                </span>
              </>
            )}
          </NavLink>

          {/* Transactions */}
          <NavLink
            to="/dashboard/transactions"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <TransactionMinus
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
                    }`}
                >
                  Transactions
                </span>
              </>
            )}
          </NavLink>

          {/* Settings */}

        </nav>
        <div className="border-t">
          {/* Settings */}

          <div className="relative">
            <div
              onClick={() => setOpenSettingsModal(true)}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Setting size="20" color="#8C8C8C" />
              <span className="text-[#8C8C8C]">Settings</span>
            </div>

            {openSettingsModal && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenSettingsModal(false)}
                ></div>
                <div
                  className="absolute bottom-10 left-0 bg-white border shadow-lg rounded-xl p-4 w-fit z-50"
                >
                  <div className="flex flex-col items-center text-center space-y-4 cursor-pointer">
                    {/* Profile header */}
                    <div className="flex gap-2 items-center justify-start hover:bg-[#F5F5F5] p-2 rounded-md" onClick={() => setOpenModal(true)}>

                      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg">
                        {initials}
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-semibold">{user?.data?.first_name}</p>
                        <p className="text-gray-500 text-xs">{user?.data?.user_email}</p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="w-full space-y-1 text-sm text-left text-[#8C8C8C]">
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <ShieldTick size="18" color="#8C8C8C" /> KYC
                      </div>
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2" onClick={() => {
                        setOpenSettingsModal(false);
                        navigate("/dashboard/change-passcode");
                      }}>
                        <Lock size="18" color="#8C8C8C" /> Change passcode
                      </div>
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <Lock size="18" color="#8C8C8C" /> Privacy
                      </div>
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <MessageQuestion size="18" color="#8C8C8C" /> Contact support
                      </div>
                      <div className="flex items-center justify-center gap-2 text-danger mt-2 cursor-pointer hover:bg-red-50 p-2 rounded-md"  onClick={handleLogout}>
                        <LogoutCurve size="18" color="#FF4D4F" /> Logout
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>


          <img src={Code} />
        </div>
      </aside>

       {/* Overlay when sidebar is open (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-[80%]">
        {/* Header */}
        <header className="flex justify-between items-center h-16 px-6 pt-9">
           {/* Hamburger for mobile */}
                      {/* <button
                        className="md:hidden text-gray-700"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <HambergerMenu size="26" color="black" />
                      </button> */}
          <div className="flex items-center cursor-pointer border rounded-full w-fit md:ml-2 ml-6 justify-center py-2 px-4" onClick={() => navigate(-1)}>
            <ArrowLeft2 size="16" color="black" className="" /><p className="text-sm font-semibold">Back</p>
          </div>

          <div className="flex space-x-4">

            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          </div>
        </header>


        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      {/*  Modal */}
      <CloseAccountModal
        open={openModal}
        onOpenChange={setOpenModal}
        userName={user?.data?.first_name || ''}
        userEmail={user?.data?.user_email || ""}
        initials={initials}
        firstName={user?.data?.first_name || ''}
        lastName={user?.data?.last_name || ''}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default MinimalLayout;
