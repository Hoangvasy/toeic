import { TrendingUp } from "lucide-react";

function PredictionCard({ ai }) {
  return (
    <div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-6
      rounded-2xl
      shadow-sm
      space-y-4
      transition
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">
          Dự đoán
        </h3>
      </div>

      {/* SCORE */}
      <div className="flex items-end gap-2">
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {ai.prediction}
        </p>

        <span className="text-sm text-green-500 font-medium">+30</span>
      </div>

      {/* PROGRESS */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
          style={{ width: "75%" }}
        />
      </div>

      {/* MESSAGE */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Nếu duy trì học tập đều đặn, bạn có thể đạt thêm
        <span className="font-medium text-green-500"> +30 điểm</span>.
      </p>
    </div>
  );
}

export default PredictionCard;
