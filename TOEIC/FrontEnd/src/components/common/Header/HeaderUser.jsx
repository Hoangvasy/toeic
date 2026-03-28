import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

function HeaderUser() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-blue-900">Dashboard</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm w-40"
          />
        </div>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            3
          </span>
        </div>

        {/* USER */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg"
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
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2">
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

export default HeaderUser;
