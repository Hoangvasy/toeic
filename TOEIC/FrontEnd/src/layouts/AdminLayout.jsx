import { Outlet } from "react-router-dom";

import SidebarAdmin from "../components/admin/SidebarAdmin";
import HeaderAdmin from "../components/admin/HeaderAdmin";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <HeaderAdmin />

        {/* CONTENT */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
