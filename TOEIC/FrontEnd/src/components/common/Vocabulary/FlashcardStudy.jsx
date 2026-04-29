import { Volume2 } from "lucide-react";

export default function FlashcardStudy({
  currentCard,
  flipped,
  setFlipped,
  review,
  playAudio,
  currentIndex,
  total,
}) {
  if (!currentCard) return null;

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="max-w-5xl mx-auto">
      {/* header hiển thị tiến độ */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Thẻ {currentIndex + 1} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-green-500 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="
          relative
          bg-white dark:bg-gray-900
          border dark:border-gray-700
          shadow-lg rounded-2xl
          h-[320px]
          flex items-center justify-center
          text-center cursor-pointer
          hover:shadow-xl transition
        "
      >
        {/* nút phát âm */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playAudio(currentCard.word);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-500"
        >
          <Volume2 size={24} />
        </button>

        {/* mặt trước */}
        {!flipped ? (
          <div>
            <p className="text-sm text-gray-400 mb-3">Câu hỏi</p>

            <h2 className="text-4xl font-bold">{currentCard.word}</h2>

            {currentCard.ipa && (
              <p className="text-gray-500 mt-2">{currentCard.ipa}</p>
            )}

            <p className="text-xs text-gray-400 mt-4">(click để xem đáp án)</p>
          </div>
        ) : (
          /* mặt sau */
          <div>
            <p className="text-sm text-gray-400 mb-3">Đáp án</p>

            <p className="text-2xl font-semibold text-blue-600">
              {currentCard.meaningVi}
            </p>

            {currentCard.example && (
              <p className="italic mt-3 text-gray-500">{currentCard.example}</p>
            )}
          </div>
        )}
      </div>

      {/* các nút đánh giá */}
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        {/* học lại */}
        <button
          onClick={() => review(0)}
          className="
            bg-red-500 text-white
            px-4 py-2 rounded-xl
            hover:bg-red-600
          "
        >
          Học lại
        </button>

        {/* khó */}
        <button
          onClick={() => review(1)}
          className="
            bg-orange-500 text-white
            px-4 py-2 rounded-xl
            hover:bg-orange-600
          "
        >
          Khó
        </button>

        {/* tốt */}
        <button
          onClick={() => review(2)}
          className="
            bg-green-500 text-white
            px-4 py-2 rounded-xl
            hover:bg-green-600
          "
        >
          Tốt
        </button>

        {/* dễ */}
        <button
          onClick={() => review(3)}
          className="
            bg-blue-500 text-white
            px-4 py-2 rounded-xl
            hover:bg-blue-600
          "
        >
          Dễ
        </button>
      </div>
    </div>
  );
}
