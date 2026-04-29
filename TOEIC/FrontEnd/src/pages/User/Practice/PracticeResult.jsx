import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ListChecks,
  BadgeCheck,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function PracticeResult({ answers: propAnswers }) {
  // lấy dữ liệu từ nhiều nguồn (prop → state → localStorage)
  const location = useLocation();

  const answers =
    propAnswers ||
    location.state?.answers ||
    JSON.parse(localStorage.getItem("practiceAnswers")) ||
    [];

  // không có dữ liệu
  if (!answers.length) {
    return (
      <div className="p-10 text-center dark:text-gray-200">
        Không tìm thấy dữ liệu luyện tập
      </div>
    );
  }

  // tính toán kết quả
  const correct = answers.filter((a) => a.selected === a.correct).length;
  const total = answers.length;
  const wrong = total - correct;
  const accuracy = Math.round((correct / total) * 100);

  // đánh giá hiệu suất
  let performance = "Cần cải thiện";
  let badgeColor =
    "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
  let barColor = "bg-red-500";

  if (accuracy >= 90) {
    performance = "Xuất sắc";
    badgeColor =
      "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";
    barColor = "bg-green-500";
  } else if (accuracy >= 70) {
    performance = "Tốt";
    badgeColor =
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
    barColor = "bg-blue-500";
  } else if (accuracy >= 50) {
    performance = "Trung bình";
    badgeColor =
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400";
    barColor = "bg-yellow-500";
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* header */}

        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <BadgeCheck size={20} />

          <span className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full text-sm font-medium">
            Hoàn thành
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Kết quả luyện tập
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Phân tích kết quả bài làm của bạn
          </p>
        </div>

        {/* thẻ kết quả */}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-8">
          {/* điểm số + độ chính xác */}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                {correct}
              </span>

              <span className="text-2xl text-gray-600 dark:text-gray-300">
                / {total}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Độ chính xác
              </p>

              <p className="text-3xl font-semibold dark:text-white">
                {accuracy}%
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
              >
                {performance}
              </span>
            </div>
          </div>

          {/* thanh tiến trình */}

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8">
            <div
              className={`${barColor} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${accuracy}%` }}
            />
          </div>

          {/* thống kê chi tiết */}

          <div className="grid grid-cols-3 gap-4">
            {/* số câu đúng */}

            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-5 text-center">
              <CheckCircle2
                className="mx-auto mb-1 text-green-600 dark:text-green-400"
                size={22}
              />

              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {correct}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">Đúng</p>
            </div>

            {/* số câu sai */}

            <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-5 text-center">
              <XCircle
                className="mx-auto mb-1 text-red-600 dark:text-red-400"
                size={22}
              />

              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {wrong}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">Sai</p>
            </div>

            {/* tổng số câu */}

            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-5 text-center">
              <ListChecks
                className="mx-auto mb-1 text-gray-700 dark:text-gray-300"
                size={22}
              />

              <p className="text-3xl font-bold dark:text-white">{total}</p>

              <p className="text-sm text-gray-600 dark:text-gray-300">Tổng</p>
            </div>
          </div>
        </div>

        {/* các nút hành động */}

        <div className="flex justify-center gap-4 flex-wrap">
          {/* xem lại */}

          <Link
            to="/practice/review"
            state={{ answers }}
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-xl
              font-medium
              text-white
              bg-blue-600
              hover:bg-blue-700
              shadow-sm hover:shadow
              transition
              hover:scale-[1.02]
              active:scale-95
            "
          >
            <RotateCcw size={18} />
            Xem lại bài
          </Link>

          {/* tiếp tục luyện tập */}

          <Link
            to="/practice/part5"
            className="
              group
              flex items-center gap-2
              px-6 py-3
              rounded-xl
              font-medium
              border border-blue-200
              text-blue-600
              bg-blue-50
              hover:bg-blue-100
              dark:bg-gray-700
              dark:border-gray-600
              dark:text-gray-200
              dark:hover:bg-gray-600
              transition
              hover:scale-[1.02]
              active:scale-95
            "
          >
            Tiếp tục luyện tập
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
