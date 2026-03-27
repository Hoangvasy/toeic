import { motion } from "framer-motion";

const mockData = [
  0, 1, 2, 3, 0, 2, 3,
  1, 2, 0, 3, 2, 1, 0,
  2, 3, 3, 1, 0, 2, 1,
];

function getColor(level) {
  switch (level) {
    case 0:
      return "bg-gray-200";
    case 1:
      return "bg-green-200";
    case 2:
      return "bg-green-400";
    case 3:
      return "bg-green-600";
    default:
      return "bg-gray-200";
  }
}

function CalendarCard() {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-blue-900">
          📅 Learning Activity
        </h3>
        <span className="text-sm text-orange-500 font-medium">
          🔥 5 ngày
        </span>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-7 gap-2">
        {mockData.map((level, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded ${getColor(level)} 
            hover:scale-110 transition`}
            title={`Day ${i + 1}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <div className="w-3 h-3 bg-green-200 rounded" />
          <div className="w-3 h-3 bg-green-400 rounded" />
          <div className="w-3 h-3 bg-green-600 rounded" />
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ 25 phút/ngày</span>
        <span>📈 Best: 40 câu</span>
      </div>

      {/* AI Insight */}
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
        🤖 Bạn học tốt nhất vào buổi tối
      </div>
    </motion.div>
  );
}

export default CalendarCard;