import { motion } from "framer-motion";
import { CalendarDays, Flame } from "lucide-react";

const mockData = [
  0, 1, 2, 3, 0, 2, 3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 3, 1, 0, 2, 1,
];

function getColor(level) {
  switch (level) {
    case 0:
      return "bg-gray-200 dark:bg-gray-700";
    case 1:
      return "bg-green-200 dark:bg-green-700";
    case 2:
      return "bg-green-400 dark:bg-green-500";
    case 3:
      return "bg-green-600 dark:bg-green-400";
    default:
      return "bg-gray-200";
  }
}

function CalendarCard() {
  return (
    <motion.div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-6
      rounded-2xl
      shadow-sm
      space-y-5
      transition
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">
            Learning Activity
          </h3>
        </div>

        <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
          <Flame className="w-4 h-4" />5 ngày
        </span>
      </div>

      {/* HEATMAP */}
      <div className="grid grid-cols-7 gap-2">
        {mockData.map((level, i) => (
          <div
            key={i}
            className={`
              w-6 h-6 rounded-md
              ${getColor(level)}
              hover:scale-110 hover:ring-2 hover:ring-blue-400
              transition
              cursor-pointer
            `}
            title={`Day ${i + 1}`}
          />
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>

        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-3 h-3 bg-green-200 dark:bg-green-700 rounded" />
          <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded" />
          <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded" />
        </div>

        <span>More</span>
      </div>

      {/* STATS */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>⏱ 25 phút/ngày</span>
        <span>📈 Best: 40 câu</span>
      </div>

      {/* AI INSIGHT */}
      <div
        className="
        bg-blue-50 dark:bg-blue-900/30
        text-blue-700 dark:text-blue-300
        p-3
        rounded-xl
        text-sm
        "
      >
        🤖 Bạn học tốt nhất vào buổi tối
      </div>
    </motion.div>
  );
}

export default CalendarCard;
