<<<<<<< HEAD
import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-blue-900">Dashboard</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm w-40"
          />
        </div>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 transition" />

          {/* Badge */}
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
=======
import React from "react";

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex justify-between items-center">
      
      {/* LEFT */}
      <div>
        <h2 className="text-2xl font-semibold">
          TOEIC Admin Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tổng quan hệ thống • 25/03/2026
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm đề thi..."
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {darkMode ? (
            <i className="fas fa-sun"></i>
          ) : (
            <i className="fas fa-moon"></i>
          )}
        </button>

        {/* Bell */}
        <div className="relative">
          <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl">
            <i className="fas fa-bell"></i>
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
>>>>>>> 75b087fa26a87d74313f6378738ecd8b7b904d2b
            3
          </span>
        </div>

<<<<<<< HEAD
        {/* USER */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition"
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

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Hồ sơ
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Cài đặt
              </button>

              <div className="border-t my-1"></div>

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

export default Header;
=======
        {/* User */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl px-3 py-1">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium">Hoàng Văn</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Super Admin
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
>>>>>>> 75b087fa26a87d74313f6378738ecd8b7b904d2b
