import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  LayoutDashboard,
  FileText,
  Database,
  CalendarCheck,
  BarChart3,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Quản lý đề thi", path: "/admin/upload", icon: FileText },
  { name: "Ngân hàng câu hỏi", path: "/admin/questions", icon: Database },
  { name: "Lịch & Ca thi", path: "/admin/schedule", icon: CalendarCheck },
  { name: "Thống kê", path: "/admin/reports", icon: BarChart3 },
];

function SidebarAdmin({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true },
      );

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-64"}
        h-screen
        sticky top-0
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        flex flex-col justify-between
        p-4
        transition-all duration-300
      `}
    >
      {/* TOP */}
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              TOEIC Admin
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* MENU */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={collapsed ? item.name : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm dark:bg-gray-800"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-3">
        {/* ADMIN INFO */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 rounded-full"
          />

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-500">System Manager</p>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}

export default SidebarAdmin;
