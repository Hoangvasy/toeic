import { Play } from "lucide-react";

export default function FlashcardSetCard({
  set,
  selectedSet,
  loadCards,
  mode,
}) {
  const isActive = selectedSet === set.id;

  // map progress theo mode
  const progressMap = {
    review: set.progressReview,
    anki: set.progressAnki,
    quiz: set.progressQuiz,
    match: set.progressMatch,
  };

  const learnedMap = {
    review: set.learnedReview,
    anki: set.learnedAnki,
    quiz: set.learnedQuiz,
    match: set.learnedMatch,
  };

  const progress = progressMap[mode] ?? 0;
  const learned = learnedMap[mode] ?? 0;
  const count = set.cardCount || 0;

  // cấu hình giao diện theo mode
  const modeConfig = {
    review: {
      label: "Ôn tập",
      color: "text-blue-600",
      bar: "bg-blue-500",
      border: "border-blue-500",
    },
    anki: {
      label: "Anki",
      color: "text-purple-600",
      bar: "bg-purple-500",
      border: "border-purple-500",
    },
    quiz: {
      label: "Trắc nghiệm",
      color: "text-green-600",
      bar: "bg-green-500",
      border: "border-green-500",
    },
    match: {
      label: "Ghép thẻ",
      color: "text-pink-600",
      bar: "bg-pink-500",
      border: "border-pink-500",
    },
  };

  const currentMode = modeConfig[mode] || modeConfig.review;

  return (
    <div
      className={`
        p-5 rounded-xl border transition
        hover:shadow-lg hover:-translate-y-1

        ${
          isActive
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }
      `}
    >
      {/* nhãn bộ từ vựng */}
      <span
        className={`
          text-xs px-2 py-1 rounded-full
          ${
            isActive
              ? "bg-white/20 text-white"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          }
        `}
      >
        bộ từ vựng
      </span>

      {/* tiêu đề */}
      <h3 className="font-semibold text-lg mt-2 dark:text-gray-100">
        {set.title}
      </h3>

      {/* thông tin số lượng */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {learned} / {count} {mode === "match" ? "cặp" : "từ"}
      </p>

      {/* thanh tiến độ */}
      <div className="mt-3">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
          <div
            className={`h-2 rounded transition-all duration-300 ${currentMode.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* hiển thị phần trăm */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}% hoàn thành
        </span>

        <div
          className={`
            w-10 h-10 rounded-full border-4 flex items-center justify-center text-xs font-semibold
            ${
              isActive
                ? "border-white text-white"
                : `${currentMode.border} text-gray-700 dark:text-gray-300`
            }
          `}
        >
          {progress}%
        </div>
      </div>

      {/* nút bắt đầu */}
      <button
        onClick={() => loadCards(set.id, mode)}
        className={`
          group flex items-center gap-2 mt-5 text-sm font-medium transition

          ${isActive ? "text-white" : `${currentMode.color} dark:text-gray-300`}

          hover:scale-105
        `}
      >
        <Play size={16} className="group-hover:translate-x-1 transition" />
        {currentMode.label}
      </button>
    </div>
  );
}
