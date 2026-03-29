import { TrendingUp, Users, FileText, Target } from "lucide-react";

function AdminDashboard() {
  return (
    <>
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FileText size={16} /> Tổng đề thi
          </p>
          <p className="text-4xl font-bold mt-2">248</p>
          <p className="text-green-500 text-sm mt-4 flex items-center gap-1">
            <TrendingUp size={16} /> +12 đề mới tháng này
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Users size={16} /> Học viên đã thi
          </p>
          <p className="text-4xl font-bold mt-2">1,284</p>
          <p className="text-green-500 text-sm mt-4">+89 so với tháng trước</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Target size={16} /> Điểm trung bình
          </p>
          <p className="text-4xl font-bold mt-2">685</p>
          <p className="text-amber-500 text-sm mt-4">
            -12 điểm so với tháng trước
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Tỷ lệ hoàn thành</p>
          <p className="text-4xl font-bold mt-2">94%</p>
          <p className="text-green-500 text-sm mt-4">+3% so với tháng trước</p>
        </div>
      </div>

      {/* CHART */}
      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold mb-6">
          Biểu đồ & Thống kê chi tiết
        </h3>

        <div className="h-96 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400">
          Phần biểu đồ sẽ được thêm sau
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
