import { NavLink, useNavigate } from "react-router-dom";
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
  BookMarked,
} from "lucide-react";

const menu = [
  { name: "Tổng quan", path: "/dashboard", icon: LayoutDashboard },
  { name: "Kiểm tra", path: "/diagnostic", icon: ClipboardList },
  { name: "Luyện tập", path: "/practice", icon: BookOpen },
  { name: "Từ vựng", path: "/vocabulary", icon: BookMarked },
  { name: "AI Path", path: "/ai-path", icon: Cpu },
  { name: "Tiến độ", path: "/progress", icon: BarChart3 },
  { name: "Hồ sơ", path: "/profile", icon: User },
];

function SidebarUser({ collapsed, setCollapsed, onClose }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`
      ${collapsed ? "w-20" : "w-64"}
      h-screen sticky top-0
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-800
      flex flex-col justify-between
      p-4
      transition-all duration-300
      shadow-sm
      `}
    >
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              TOEIC AI
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
            p-2 rounded-lg
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
            "
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition font-medium
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
                  }`
                }
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition" />

                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* USER */}
      <div className="space-y-3">
        <div
          className="
          flex items-center gap-3 p-2 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
          "
        >
          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 rounded-full"
          />

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                Thắng Hoàng
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Free Plan
              </p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          text-red-500
          hover:bg-red-50 dark:hover:bg-red-900/20
          transition
          "
        >
          <LogOut className="w-5 h-5" />

          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}

export default SidebarUser;
