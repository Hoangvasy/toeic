import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function FlashcardQuiz({
  currentCard,
  currentIndex,
  total,
  nextCard,
  refreshSets,
}) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!currentCard || !currentCard.options) return null;

  const progress = ((currentIndex + 1) / total) * 100;
  const labels = ["A", "B", "C", "D"];

  // chuyển sang câu tiếp theo
  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    nextCard();
  };

  // cập nhật tiến độ quiz
  const updateProgress = async (isCorrect) => {
    try {
      if (!currentCard?.reviewId) return;

      await fetch("http://localhost:8080/api/flashcard/progress/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewId: currentCard.reviewId,
          correct: isCorrect,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* header hiển thị tiến độ */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Câu {currentIndex + 1} / {total}
          </span>
          <span className="font-semibold text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* câu hỏi */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-10 text-center">
        <p className="text-sm text-gray-400 mb-2">Chọn nghĩa đúng</p>

        <h2 className="text-4xl font-bold mb-8 tracking-tight">
          {currentCard.word}
        </h2>

        {/* danh sách đáp án */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCard.options.map((opt, i) => {
            const isCorrect = opt === currentCard.correctAnswer;
            const isSelected = selected === opt;

            return (
              <button
                key={i}
                onClick={async () => {
                  if (showAnswer) return;

                  const isCorrect = opt === currentCard.correctAnswer;

                  setSelected(opt);
                  setShowAnswer(true);

                  await updateProgress(isCorrect);

                  if (refreshSets) {
                    refreshSets();
                  }
                }}
                className={`
                  flex items-center gap-4
                  border rounded-2xl p-4 text-left
                  transition-all duration-200
                  
                  ${
                    showAnswer
                      ? isCorrect
                        ? "bg-green-100 border-green-500 text-green-700"
                        : isSelected
                          ? "bg-red-100 border-red-500 text-red-700"
                          : "opacity-60"
                      : isSelected
                        ? "border-blue-500 bg-blue-50 shadow"
                        : "hover:border-gray-400 hover:shadow-sm"
                  }
                `}
              >
                {/* nhãn a b c d */}
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 font-semibold">
                  {labels[i]}
                </div>

                <span className="flex-1">{opt}</span>

                {/* icon hiển thị đúng/sai */}
                {showAnswer && isCorrect && (
                  <CheckCircle2 className="text-green-600" size={20} />
                )}

                {showAnswer && isSelected && !isCorrect && (
                  <XCircle className="text-red-600" size={20} />
                )}
              </button>
            );
          })}
        </div>

        {/* hiển thị đáp án đúng */}
        {showAnswer && (
          <div className="mt-6 text-sm text-gray-500">
            Đáp án đúng:{" "}
            <span className="font-semibold text-green-600">
              {currentCard.correctAnswer}
            </span>
          </div>
        )}
      </div>

      {/* nút chuyển câu */}
      <div className="flex justify-center">
        {showAnswer && (
          <button
            onClick={handleNext}
            className="
              px-8 py-3 rounded-xl font-medium
              bg-green-600 hover:bg-green-700
              text-white shadow-md
            "
          >
            Câu tiếp theo →
          </button>
        )}
      </div>
    </div>
  );
}
