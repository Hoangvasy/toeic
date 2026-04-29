import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function FlashcardMatch({ cards, refreshSets, onBack }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [finished, setFinished] = useState(false);

  // khởi tạo dữ liệu
  useEffect(() => {
    if (!cards || cards.length === 0) return;

    let temp = [];

    cards.forEach((c, index) => {
      temp.push({
        id: `${index}-w`,
        text: c.word,
        pairId: index,
        type: "word",
      });
      temp.push({
        id: `${index}-m`,
        text: c.meaningVi,
        pairId: index,
        type: "meaning",
      });
    });

    temp.sort(() => Math.random() - 0.5);

    setItems(temp);
    setSelected([]);
    setMatched([]);
    setFinished(false);
  }, [cards]);

  // gọi api cập nhật tiến độ match
  const updateMatchProgress = async (card) => {
    try {
      if (!card?.reviewId) return;

      await fetch("http://localhost:8080/api/flashcard/progress/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewId: card.reviewId,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // xử lý click chọn thẻ
  const handleClick = async (item) => {
    if (finished) return;
    if (selected.length === 2) return;
    if (selected.some((s) => s.id === item.id)) return;
    if (matched.includes(item.id)) return;

    const newSelected = [...selected, item];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [a, b] = newSelected;

      if (matched.includes(a.id) || matched.includes(b.id)) return;

      if (a.pairId === b.pairId) {
        const wordCard = cards[a.pairId];

        await updateMatchProgress(wordCard);

        setTimeout(() => {
          setMatched((prev) => [...prev, a.id, b.id]);
          setSelected([]);
        }, 250);
      } else {
        setTimeout(() => setSelected([]), 600);
      }
    }
  };

  // kiểm tra hoàn thành
  useEffect(() => {
    if (items.length > 0 && matched.length === items.length) {
      setFinished(true);

      if (refreshSets) {
        refreshSets();
      }

      setTimeout(() => {
        if (onBack) onBack();
      }, 300);
    }
  }, [matched, items]);

  // chơi lại
  const restart = () => {
    if (!cards) return;

    let temp = [];

    cards.forEach((c, index) => {
      temp.push({
        id: `${index}-w`,
        text: c.word,
        pairId: index,
        type: "word",
      });
      temp.push({
        id: `${index}-m`,
        text: c.meaningVi,
        pairId: index,
        type: "meaning",
      });
    });

    temp.sort(() => Math.random() - 0.5);

    setItems(temp);
    setSelected([]);
    setMatched([]);
    setFinished(false);
  };

  // tính phần trăm tiến độ
  const progress = cards?.length
    ? Math.round((matched.length / 2 / cards.length) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* header hiển thị tiến độ */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Đã ghép: {matched.length / 2} / {cards?.length || 0}
          </span>
          <span className="text-blue-600 font-semibold">{progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* lưới hiển thị các thẻ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const isSelected = selected.some((s) => s.id === item.id);
          const isMatched = matched.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`
                relative p-5 rounded-2xl border text-center cursor-pointer
                transition-all duration-300 select-none

                ${
                  item.type === "word"
                    ? "bg-indigo-50 dark:bg-indigo-900/20"
                    : "bg-orange-50 dark:bg-orange-900/20"
                }

                ${isMatched && "bg-green-100 border-green-400 opacity-50 scale-95"}
                ${isSelected && "border-blue-500 bg-blue-50 scale-105 shadow-lg"}
                ${!isSelected && !isMatched && "hover:shadow-md hover:scale-105"}
              `}
            >
              {item.text}

              {isMatched && (
                <CheckCircle2
                  size={18}
                  className="absolute top-2 right-2 text-green-600"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
