import FlashcardSetCard from "./FlashcardSetCard";
import { BookOpen } from "lucide-react";

export default function FlashcardSetList({
  sets,
  selectedSet,
  loadCards,
  mode,
}) {
  return (
    <div className="mb-10">
      {/* trạng thái khi chưa có dữ liệu */}
      {sets.length === 0 && (
        <div
          className="
          flex
          flex-col
          items-center
          justify-center
          text-center
          py-16
          text-gray-500
          dark:text-gray-400
        "
        >
          <BookOpen size={40} className="mb-4 opacity-60" />

          <p className="text-lg font-medium">Chưa có bộ từ vựng nào</p>

          <p className="text-sm">Hãy tạo bộ flashcard đầu tiên của bạn</p>
        </div>
      )}

      {/* danh sách dạng grid */}
      {sets.length > 0 && (
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
          "
        >
          {sets.map((set) => (
            <FlashcardSetCard
              key={set.id}
              set={set}
              selectedSet={selectedSet}
              loadCards={loadCards}
              mode={mode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
