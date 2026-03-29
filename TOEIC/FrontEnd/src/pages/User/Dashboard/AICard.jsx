import { Brain, AlertTriangle } from "lucide-react";

function AICard({ ai }) {
  return (
    <div
      className="
      bg-gradient-to-r from-purple-500 to-indigo-500
      dark:from-purple-700 dark:to-indigo-700
      text-white
      p-6
      rounded-2xl
      shadow-sm
      transition
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5" />
        <h3 className="font-semibold">AI Insight</h3>
      </div>

      {/* WEAK TOPICS */}
      <div className="space-y-3">
        {ai.weakTopics.map((t, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
                {t.name}
              </span>

              <span className="font-medium">{t.accuracy}%</span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full bg-white/20 rounded-full h-2 mt-1">
              <div
                className="bg-yellow-300 h-2 rounded-full"
                style={{ width: `${t.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RECOMMENDATION */}
      <div
        className="
        mt-4
        bg-white/20
        backdrop-blur
        p-3
        rounded-xl
        text-sm
        "
      >
        👉 Focus luyện <b>Part 5</b> trong <b>5 ngày tới</b>
      </div>
    </div>
  );
}

export default AICard;
