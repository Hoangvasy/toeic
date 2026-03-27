import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "../components/common/Sidebar/Sidebar";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";

function UserLayout() {
  const [open, setOpen] = useState(false); // mobile sidebar
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  return (
    <div className="flex min-h-screen">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 flex transition-all duration-300
        ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {/* SIDEBAR */}
        <div
          className={`w-64 h-full bg-white
          border-r border-gray-200
          shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar
            collapsed={false}
            setCollapsed={() => {}}
            onClose={() => setOpen(false)}
          />
        </div>

        {/* OVERLAY */}
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col bg-blue-50">
        {/* MOBILE HEADER (menu button) */}
        <div className="md:hidden flex items-center px-4 py-3 bg-white border-b">
          <button onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="ml-4 font-bold text-blue-600">TOEIC AI</h1>
        </div>

        {/* HEADER (desktop + mobile đều dùng) */}
        <Header />

        {/* CONTENT */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
