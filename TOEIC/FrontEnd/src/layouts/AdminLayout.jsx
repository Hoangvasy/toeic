import { Outlet } from "react-router-dom";
import { useState } from "react";

import SidebarAdmin from "../components/common/Sidebar/SidebarAdmin";
import HeaderAdmin from "../components/common/Header/HeaderAdmin";
import useDarkMode from "../hooks/useDarkMode";

function AdminLayout() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* SIDEBAR */}
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <HeaderAdmin darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* CONTENT */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
