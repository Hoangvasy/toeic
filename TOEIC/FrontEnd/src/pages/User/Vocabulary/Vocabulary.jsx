import { useEffect, useState } from "react";
import { Plus, Search, Grid, List, ArrowLeft } from "lucide-react";
import { RefreshCcw, Brain, ListChecks, Pencil, Puzzle } from "lucide-react";

// import các component
import FlashcardSetList from "../../../components/common/Vocabulary/FlashcardSetList";
import FlashcardStudy from "../../../components/common/Vocabulary/FlashcardStudy";
import FlashcardCreate from "../../../components/common/Vocabulary/FlashcardCreate";
import FlashcardReview from "../../../components/common/Vocabulary/FlashcardReview";
import FlashcardQuiz from "../../../components/common/Vocabulary/FlashcardQuiz";
import FlashcardMatch from "../../../components/common/Vocabulary/FlashcardMatch";

export default function Vocabulary() {
  // state quản lý dữ liệu
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  const [cards, setCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [flipped, setFlipped] = useState(false);

  const [newSetName, setNewSetName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("review");

  // xác định card hiện tại
  const currentCard =
    mode === "anki"
      ? queue.length > 0
        ? queue[0]
        : null
      : cards.length > 0 && currentIndex < cards.length
        ? cards[currentIndex]
        : null;

  // gọi api lấy danh sách bộ flashcard
  const fetchSets = () => {
    fetch("http://localhost:8080/api/flashcard/set", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("API lỗi");
        return res.json();
      })
      .then(setSets)
      .catch(console.error);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  // load danh sách card theo mode
  const loadCards = (setId, modeParam) => {
    const currentMode = modeParam || mode;

    // reset state
    setCards([]);
    setQueue([]);
    setCurrentIndex(0);
    setFlipped(false);
    setSelectedSet(setId);

    let url = "";

    if (currentMode === "review") {
      url = `/api/flashcard/review-all?setId=${setId}`;
    } else if (currentMode === "anki") {
      url = `/api/flashcard/due?setId=${setId}`;
    } else if (currentMode === "quiz") {
      url = `/api/flashcard/quiz?setId=${setId}`;
    } else if (currentMode === "match") {
      url = `/api/flashcard/review-all?setId=${setId}`;
    } else {
      url = `/api/flashcard/review-all?setId=${setId}`;
    }

    fetch(`http://localhost:8080${url}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("API lỗi: " + res.status);
        return res.json();
      })
      .then((data) => {
        let newData = [...data];

        // trộn card khi ở chế độ review
        if (currentMode === "review") {
          newData.sort(() => Math.random() - 0.5);
        }

        setCards(newData);

        // anki dùng queue riêng
        if (currentMode === "anki") {
          setQueue(newData);
        }
      })
      .catch(console.error);
  };

  // tạo bộ flashcard mới
  const createSet = async (description) => {
    if (!newSetName.trim()) return;

    await fetch("http://localhost:8080/api/flashcard/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: newSetName,
        description,
      }),
    });

    setNewSetName("");
    fetchSets();
  };

  // xử lý review / anki
  const review = async (rating) => {
    try {
      if (!currentCard?.reviewId) {
        nextCard();
        return;
      }

      let url = null;

      if (mode === "review") {
        url = "/api/flashcard/review-simple";
      } else if (mode === "anki") {
        url = "/api/flashcard/review-srs";
      }

      if (!url) {
        nextCard();
        return;
      }

      await fetch(`http://localhost:8080${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewId: currentCard.reviewId,
          rating,
        }),
      });

      fetchSets();

      // logic anki
      if (mode === "anki") {
        setQueue((prev) => {
          let newQueue = [...prev];

          newQueue.shift();

          // nếu sai thì đưa xuống cuối
          if (rating === 0) {
            newQueue.push(currentCard);
          }

          return newQueue;
        });

        return;
      }

      // mode review bình thường
      nextCard();
    } catch (err) {
      console.error(err);
    }
  };

  // chuyển sang card tiếp theo
  const nextCard = () => {
    setFlipped(false);

    // anki
    if (mode === "anki") {
      setQueue((prev) => {
        const newQueue = prev.slice(1);
        setCards(newQueue);
        return newQueue;
      });
      return;
    }

    // review thường
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert("🎉 Bạn đã học xong!");
      setSelectedSet(null);
      setCards([]);
      fetchSets();
    }
  };

  // phát audio
  const playAudio = (word) => {
    new Audio(`https://dict.youdao.com/dictvoice?audio=${word}`).play();
  };

  // lọc bộ theo search
  const filteredSets = sets.filter((set) =>
    set.title.toLowerCase().includes(search.toLowerCase()),
  );

  // giao diện
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* danh sách bộ */}
      {!selectedSet && (
        <>
          {/* toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* bên trái */}
            <div className="flex items-center gap-3 min-w-0">
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Mới nhất</option>
                <option>Cũ nhất</option>
              </select>

              <button className="p-2 rounded bg-blue-600 text-white shrink-0">
                <Grid size={18} />
              </button>

              <button className="p-2 rounded border shrink-0">
                <List size={18} />
              </button>

              {/* ô tìm kiếm */}
              <div className="flex items-center border rounded-lg px-3 py-2 w-64">
                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  placeholder="Lọc theo tiêu đề..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* bên phải */}
            <div className="flex items-center gap-3 shrink-0">
              {/* chọn mode */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl shadow-inner">
                {[
                  {
                    key: "review",
                    label: "Ôn tập",
                    icon: RefreshCcw,
                    active: "bg-blue-500 text-white",
                  },
                  {
                    key: "anki",
                    label: "Anki",
                    icon: Brain,
                    active: "bg-purple-500 text-white",
                  },
                  {
                    key: "quiz",
                    label: "Trắc nghiệm",
                    icon: ListChecks,
                    active: "bg-green-500 text-white",
                  },
                  {
                    key: "match",
                    label: "Ghép thẻ",
                    icon: Puzzle,
                    active: "bg-pink-500 text-white",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = mode === item.key;

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setMode(item.key);
                        setSelectedSet(null);
                        setCards([]);
                        setQueue([]);
                        setCurrentIndex(0);
                        setFlipped(false);
                      }}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium
                        transition-all duration-200 whitespace-nowrap
                        ${
                          isActive
                            ? `${item.active} shadow-md`
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* nút thêm bộ */}
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 whitespace-nowrap"
              >
                <Plus size={18} />
                Thêm
              </button>
            </div>
          </div>

          <FlashcardSetList
            sets={filteredSets}
            selectedSet={selectedSet}
            loadCards={loadCards}
            mode={mode}
          />
        </>
      )}

      {/* màn hình học */}
      {selectedSet && (
        <>
          {mode === "match" && cards.length > 0 && (
            <FlashcardMatch
              cards={cards}
              refreshSets={fetchSets}
              onBack={() => {
                setSelectedSet(null);
                setCards([]);
                setCurrentIndex(0);
              }}
            />
          )}

          {mode === "review" && currentCard && (
            <FlashcardReview
              currentCard={currentCard}
              currentIndex={currentIndex}
              total={cards.length}
              review={review}
              playAudio={playAudio}
              refreshSets={fetchSets}
            />
          )}

          {mode === "anki" && currentCard && (
            <FlashcardStudy
              currentCard={currentCard}
              flipped={flipped}
              setFlipped={setFlipped}
              review={review}
              playAudio={playAudio}
              currentIndex={currentIndex}
              total={cards.length}
            />
          )}

          {mode === "quiz" && currentCard && (
            <FlashcardQuiz
              currentCard={currentCard}
              currentIndex={currentIndex}
              total={cards.length}
              nextCard={nextCard}
              refreshSets={fetchSets}
            />
          )}
        </>
      )}
      {/* trạng thái hoàn thành */}
      {selectedSet && mode !== "match" && !currentCard && (
        <div className="flex items-center justify-center py-16">
          <div
            className="
      w-full max-w-md
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-3xl
      shadow-xl
      p-8 text-center
      space-y-5
      animate-fade-in
    "
          >
            {/* icon */}
            <div
              className="
        w-16 h-16 mx-auto
        flex items-center justify-center
        rounded-full
        bg-green-100 dark:bg-green-900/30
      "
            >
              <span className="text-3xl">🎉</span>
            </div>

            {/* tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {mode === "anki" ? "Hoàn thành hôm nay!" : "Ôn tập hoàn tất!"}
            </h2>

            {/* mô tả */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === "anki"
                ? "Bạn đã hoàn thành tất cả thẻ cần học hôm nay. Hẹn gặp lại vào lần tiếp theo!"
                : "Bạn đã ôn tập toàn bộ thẻ trong bộ này. Tiếp tục giữ phong độ nhé!"}
            </p>

            {/* nút hành động */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setSelectedSet(null)}
                className="
            px-6 py-2 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            shadow-md hover:shadow-lg
            transition-all
          "
              >
                Quay về danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal tạo bộ */}
      {showCreate && (
        <FlashcardCreate
          newSetName={newSetName}
          setNewSetName={setNewSetName}
          createSet={createSet}
          setShowCreate={setShowCreate}
        />
      )}
    </div>
  );
}
