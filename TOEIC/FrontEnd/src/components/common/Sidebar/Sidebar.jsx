<<<<<<< HEAD
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Cpu,
  BarChart3,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menu = [
  { name: "Tổng quan", path: "/dashboard", icon: LayoutDashboard },
  { name: "Kiểm tra", path: "/diagnostic", icon: ClipboardList },
  { name: "Luyện tập", path: "/practice", icon: BookOpen },
  { name: "AI Path", path: "/ai-path", icon: Cpu },
  { name: "Tiến độ", path: "/progress", icon: BarChart3 },
  { name: "Hồ sơ", path: "/profile", icon: User },
];

function Sidebar({ collapsed, setCollapsed, onClose }) {
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full bg-white border-r flex flex-col justify-between p-4 transition-all duration-300`}
    >
      {/* TOP */}
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold text-blue-600">TOEIC AI</h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
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
                onClick={onClose}
                title={collapsed ? item.name : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
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
        {/* USER */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 rounded-full"
          />
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Thắng Hoàng</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
=======
// src/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-2">
          <i className="fas fa-book-open"></i> TOEIC Admin
        </h1>
      </div>

      <nav className="p-4 space-y-1">
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-gray-800 rounded-2xl font-medium"
        >
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </a>
        <a 
          href="../../../admin/Upload" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
        >
          <i className="fas fa-file-alt"></i> Quản lý Đề thi
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
        >
          <i className="fas fa-layer-group"></i> Ngân hàng câu hỏi
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
        >
          <i className="fas fa-calendar-check"></i> Lịch & Ca thi
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
        >
          <i className="fas fa-chart-pie"></i> Thống kê & Báo cáo
        </a>
      </nav>
    </div>
  );
}
>>>>>>> 75b087fa26a87d74313f6378738ecd8b7b904d2b
