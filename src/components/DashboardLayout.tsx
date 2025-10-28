
import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, User, DocumentText, Setting } from "iconsax-react";
import Logo from "../assets/Logosingle.png";
import Code from "../assets/Code.png"
import type { User as UserType } from "@/types/user";
import { getUser } from "@/api/user";
import CloseAccountModal from "./CloseAccountModal";

 type DashboardLayoutProps = {
   children: ReactNode;
 };

const DashboardLayout: React.FC<DashboardLayoutProps> =({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
console.log(user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optional: redirect to login page if token expired
      }
    };

    fetchUser();
  }, []);

  const initials = user
    ? `${user.data.first_name?.[0] ?? ""}${user.data.last_name?.[0] ?? ""}`.toUpperCase()
    : "??";


    const linkClasses =
    "group flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition-colors";
  const textClasses = "transition-colors";
   const [openModal, setOpenModal] = useState(false);
  
    const handleDeleteAccount = async () => {
      // Call your API here, e.g.:
      // await axios.delete(`/api/user/${userId}`);
      console.log("Deleting account...");
    };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col px-8 pt-10">
        <div className="flex items-center justify-start font-bold text-lg">
          <img src={Logo} alt="logo" />
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
                  className={`${textClasses} ${
                    isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
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
                <User
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${
                    isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
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
                <DocumentText
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${
                    isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
                  }`}
                >
                  Transactions
                </span>
              </>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-blue-50" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Setting
                  size="20"
                  color={isActive ? "#0647F7" : "#8C8C8C"}
                  className="transition-colors"
                />
                <span
                  className={`${textClasses} ${
                    isActive ? "text-[#0647F7]" : "text-[#8C8C8C]"
                  }`}
                >
                  Settings
                </span>
              </>
            )}
          </NavLink>
        </nav>
        <div>
          <img src={Code}/>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center h-16 px-6 pt-9">
          <div>
            <p className="text-sm font-sans text-gray-500">Good Morning 👋</p>
            <p className="font-semibold text-gray-800 text-lg">
              {/* Kevin Malone */}
               {user ? `${user.data.first_name} ${user.data.last_name}` : "Loading..."}
              </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* <select className="border rounded-lg px-3 py-1 text-sm">
              <option>ETH</option>
              <option>BTC</option>
              <option>USD</option>
            </select> */}
            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold cursor-pointer" onClick={() => setOpenModal(true)}>
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

export default DashboardLayout;
