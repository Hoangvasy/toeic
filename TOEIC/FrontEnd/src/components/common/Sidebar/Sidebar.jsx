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