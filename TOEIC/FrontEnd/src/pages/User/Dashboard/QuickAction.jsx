import { Zap } from "lucide-react";

function QuickAction() {
  const actions = [
    "🔥 Ôn lại từ sai",
    "✍ Luyện Part 5",
    "🎧 Nghe Part 2",
    "🗣 Shadowing",
  ];

  return (
    <div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-6
      rounded-2xl
      shadow-sm
      transition
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">
          Luyện nhanh
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((a, i) => (
          <button
            key={i}
            className="
            bg-gray-100 dark:bg-gray-800
            hover:bg-blue-100 dark:hover:bg-gray-700
            py-3
            rounded-xl
            text-sm
            transition
            hover:scale-105
            "
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickAction;
