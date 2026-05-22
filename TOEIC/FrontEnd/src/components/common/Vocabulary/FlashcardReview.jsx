import { useState } from "react";
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function FlashcardReview({
  currentCard,
  currentIndex,
  total,
  review,
  playAudio,
  refreshSets,
}) {
  const [flipped, setFlipped] = useState(false);

  if (!currentCard) return null;

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* header hiển thị tiến độ */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          {/* tiêu đề */}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Thẻ {currentIndex + 1} / {total}
          </div>

          {/* phần trăm */}
          <div className="text-sm font-semibold text-blue-600">
            {Math.round(progress)}%
          </div>
        </div>

        {/* thanh tiến độ */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="
          relative group
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          shadow-xl hover:shadow-2xl
          rounded-3xl
          px-10 py-14
          text-center
          cursor-pointer
          transition-all duration-300
        "
      >
        {/* nút phát âm */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playAudio(currentCard.word);
          }}
          className="
            absolute top-4 right-4
            p-2 rounded-full
            bg-gray-100 dark:bg-gray-800
            hover:bg-blue-100 dark:hover:bg-blue-900
            transition
          "
        >
          <Volume2 size={20} />
        </button>

        {/* mặt trước */}
        {!flipped ? (
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              {currentCard.word}
            </h2>

            {currentCard.ipa && (
              <p className="text-gray-500 text-lg">{currentCard.ipa}</p>
            )}

            <p className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-6">
              <RotateCcw size={16} />
              click để xem nghĩa
            </p>
          </div>
        ) : (
          /* mặt sau */
          <div className="space-y-4">
            <p className="text-indigo-600 text-2xl font-semibold">
              {currentCard.meaningVi}
            </p>

            {currentCard.example && (
              <p className="italic text-gray-600 dark:text-gray-300">
                {currentCard.example}
              </p>
            )}

            <p className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-6">
              <RotateCcw size={16} />
              click để quay lại
            </p>
          </div>
        )}
      </div>

      {/* nút hành động */}
      <div className="flex justify-center gap-6 pt-4">
        {/* chưa thuộc */}
        <button
          onClick={async () => {
            setFlipped(false);

            await review(0);

            if (refreshSets) {
              refreshSets();
            }
          }}
          className="
            flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-red-500 hover:bg-red-600
            text-white font-medium
            shadow-md hover:shadow-lg
            transition-all
          "
        >
          <XCircle size={20} />
          Chưa thuộc
        </button>

        {/* đã thuộc */}
        <button
          onClick={async () => {
            setFlipped(false);

            await review(3);

            if (refreshSets) {
              refreshSets();
            }
          }}
          className="
            flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-green-600 hover:bg-green-700
            text-white font-medium
            shadow-md hover:shadow-lg
            transition-all
          "
        >
          <CheckCircle2 size={20} />
          Đã thuộc
        </button>
      </div>
    </div>
  );
}
