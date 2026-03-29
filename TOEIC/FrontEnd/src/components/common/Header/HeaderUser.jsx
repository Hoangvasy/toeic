import { Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";

function HeaderUser({ darkMode, toggleDarkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-blue-900 dark:text-gray-200">
        Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm w-40 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="
          w-10 h-10 flex items-center justify-center
          border border-gray-300 dark:border-gray-700
          rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
          "
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            3
          </span>
        </div>

        {/* USER */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-lg"
          >
            <img
              src="https://i.pravatar.cc/100"
              className="w-8 h-8 rounded-full"
            />

            <span className="hidden sm:block text-sm font-medium">
              Thắng Hoàng
            </span>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                Hồ sơ
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                Cài đặt
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderUser;
