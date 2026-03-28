import useDarkMode from '../../../hooks/useDarkMode';
import Sidebar from '../../../components/common/Sidebar/Sidebar';
import Header from '../../../components/common/Header/Header';
function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header
         darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} />
        
       

        {/* Content */}
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Tổng đề thi</p>
              <p className="text-4xl font-bold mt-2">248</p>
              <p className="text-green-500 text-sm mt-4 flex items-center gap-1">
                <i className="fas fa-arrow-trend-up"></i> +12 đề mới tháng này
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Học viên đã thi</p>
              <p className="text-4xl font-bold mt-2">1,284</p>
              <p className="text-green-500 text-sm mt-4">+89 so với tháng trước</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Điểm trung bình</p>
              <p className="text-4xl font-bold mt-2">685</p>
              <p className="text-amber-500 text-sm mt-4">-12 điểm so với tháng trước</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Tỷ lệ hoàn thành</p>
              <p className="text-4xl font-bold mt-2">94%</p>
              <p className="text-green-500 text-sm mt-4">+3% so với tháng trước</p>
            </div>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Biểu đồ & Thống kê chi tiết</h3>
            <div className="h-96 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-400">
              <div className="text-center">
                <i className="fas fa-chart-line text-6xl mb-4 opacity-30"></i>
                <p>Phần biểu đồ sẽ được thêm sau</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;