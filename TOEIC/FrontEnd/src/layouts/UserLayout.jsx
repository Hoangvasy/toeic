import { useState } from "react";
import { Outlet } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

import Sidebar from "../components/common/Sidebar/SidebarUser";
import Header from "../components/common/Header/HeaderUser";
import Footer from "../components/common/Footer/Footer";

function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
