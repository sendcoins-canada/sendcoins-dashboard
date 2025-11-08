import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  DocumentText,
  Setting,
  LogoutCurve,
  ShieldTick,
  Lock,
  MessageQuestion,
  HambergerMenu,
  CloseSquare,
  ArrowDown2
} from "iconsax-react";
import Logo from "../assets/Logosingle.png";
import Code from "../assets/Code.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/user/asyncRequests/fetchUser";
import { logout } from "@/store/auth/slice";
import { clearUser } from "@/store/user/slice";
import { resetRegistration } from "@/store/registration/slice";
import CloseAccountModal from "./CloseAccountModal";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [hasFetched, setHasFetched] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white flex flex-col px-8 pt-10 z-50 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo and Close */}
        <div className="flex items-center justify-between font-bold text-lg">         
          <img src={Logo} alt="logo" />
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseSquare size="24" color="black"/>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 space-y-2 mt-10">
          <NavLink
            to="/dashboard/home"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                <Home size="20" color={isActive ? "#0647F7" : "#262626"} />
                <span
                  className={`${textClasses} text-[14px] font-normal ${
                    isActive ? "text-[#0647F7]" : "text-[#262626]"
                  }`}
                >
                  Home
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/recipients"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                <User size="20" color={isActive ? "#0647F7" : "#262626"} />
                <span
                  className={`${textClasses} text-[14px] font-normal ${
                    isActive ? "text-[#0647F7]" : "text-[#262626]"
                  }`}
                >
                  Recipients
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/transactions"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                <DocumentText size="20" color={isActive ? "#0647F7" : "#262626"} />
                <span
                  className={`${textClasses} text-[14px] font-normal ${
                    isActive ? "text-[#0647F7]" : "text-[#262626]"
                  }`}
                >
                  Transactions
                </span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Settings + Footer */}
        <div className="border-t mt-auto">
          <div className="relative">
            <div
              onClick={() => setOpenSettingsModal(true)}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Setting size="20" color="#262626" />
              <span className="text-[#262626]  text-[14px] font-normal">Settings</span>
            </div>

            {openSettingsModal && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenSettingsModal(false)}
                ></div>
                <div className="absolute bottom-10 left-0 bg-white border shadow-lg rounded-xl p-4 w-fit z-50">
                  <div className="flex flex-col items-center text-center space-y-4 cursor-pointer">
                    <div
                      className="flex gap-2 items-center justify-start hover:bg-[#F5F5F5] p-2 rounded-md"
                      onClick={() => setOpenModal(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-lg">
                        {initials}
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-semibold">{user?.data?.first_name}</p>
                        <p className="text-gray-500 text-xs">
                          {user?.data?.user_email}
                        </p>
                      </div>
                    </div>

                    <div className="w-full space-y-1 text-sm text-left text-[#8C8C8C]">
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <ShieldTick size="18" color="#8C8C8C" /> KYC
                      </div>
                      <div
                        className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2"
                        onClick={() => {
                          setOpenSettingsModal(false);
                          navigate("/dashboard/change-passcode");
                        }}
                      >
                        <Lock size="18" color="#8C8C8C" /> Change passcode
                      </div>
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <Lock size="18" color="#8C8C8C" /> Privacy
                      </div>
                      <div className="flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md hover:text-black p-2">
                        <MessageQuestion size="18" color="#8C8C8C" /> Contact support
                      </div>
                      <div
                        className="flex items-center justify-center gap-2 text-danger mt-2 cursor-pointer hover:bg-red-50 p-2 rounded-md"
                        onClick={handleLogout}
                      >
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center h-16 px-6 pt-9">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HambergerMenu size="26" color="black" />
            </button>

            <div>
              <p className="text-sm text-gray-500">Good Morning 👋</p>
              <p className="font-semibold text-gray-800 text-lg">
                {user
                  ? `${user.data.first_name} ${user.data.last_name}`
                  : "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-1 pr-2 border rounded-full">
            <div className="w-9 h-9 rounded-full bg-pink-300 flex items-center justify-center text-xs text-white font-[500] cursor-pointer">
              {initials}
            </div>
            <ArrowDown2 size="16" color="#8C8C8C" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Close Account Modal */}
      <CloseAccountModal
        open={openModal}
        onOpenChange={setOpenModal}
        userName={user?.data?.first_name || ""}
        userEmail={user?.data?.user_email || ""}
        initials={initials}
        firstName={user?.data?.first_name || ""}
        lastName={user?.data?.last_name || ""}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default DashboardLayout;
