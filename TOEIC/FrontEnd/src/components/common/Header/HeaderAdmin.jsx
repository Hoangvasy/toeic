export default function HeaderAdmin({ darkMode, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex justify-between items-center">
      {/* LEFT */}
      <div>
        <h2 className="text-2xl font-semibold">TOEIC Admin Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tổng quan hệ thống
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
          className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-2xl"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notification */}
        <div className="relative">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-2xl">
            🔔
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-2xl px-3 py-1">
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
