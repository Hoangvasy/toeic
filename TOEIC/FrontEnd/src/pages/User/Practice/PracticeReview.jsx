import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  BookOpen,
  Plus,
  X,
  Layers,
  Volume2,
} from "lucide-react";

import Part7Passage from "./Part7/Part7Passage";

export default function PracticeReview() {
  // lấy dữ liệu từ state hoặc localStorage
  const location = useLocation();

  const answers =
    location.state?.answers ||
    JSON.parse(localStorage.getItem("practiceAnswers")) ||
    [];

  // không có dữ liệu
  if (!answers.length) {
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400">
        Không có dữ liệu để xem lại
      </div>
    );
  }

  // số câu đúng
  const correct = answers.filter((a) => a.selected === a.correct).length;

  // xác định part (5, 6, 7)
  const part = answers[0]?.question?.part || 5;

  // nhóm câu hỏi theo passage
  const groups = {};

  answers.forEach((a) => {
    const passage = a.question.passage || "NO_PASSAGE";

    if (!groups[passage]) {
      groups[passage] = [];
    }

    groups[passage].push(a);
  });

  const groupedEntries = Object.entries(groups);

  // state popup từ vựng
  const [selectedWord, setSelectedWord] = useState(null);
  const [vocab, setVocab] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // state flashcard
  const [sets, setSets] = useState([]);
  const [showSetModal, setShowSetModal] = useState(false);

  // render text có thể click từng từ
  const renderClickableText = (text) => {
    if (!text) return null;

    return text.split(" ").map((word, i) => {
      const cleanWord = word.replace(/[.,!?;:()"]/g, "").toLowerCase();

      return (
        <span
          key={i}
          className="cursor-pointer hover:bg-yellow-200 px-1 rounded"
          onClick={() => handleWordClick(cleanWord)}
        >
          {word}{" "}
        </span>
      );
    });
  };

  // xử lý click từ vựng
  const handleWordClick = async (word) => {
    setSelectedWord(word);
    setVocab(null);

    try {
      const res = await fetch(
        `http://localhost:8080/api/vocab/detail?word=${word}`,
      );

      if (!res.ok) {
        console.log("API error:", res.status);
        setVocab(null);
        setShowPopup(true);
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      setVocab(data);
    } catch (err) {
      console.error("Fetch vocab error:", err);
    }

    setShowPopup(true);
  };

  // phát âm từ
  const playAudio = (word) => {
    const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${word}`);
    audio.play();
  };

  // load danh sách bộ flashcard
  const addFlashcard = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/flashcard/set");
      const data = await res.json();

      setSets(data);
      setShowSetModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // thêm từ vào flashcard
  const addToSet = async (setId) => {
    try {
      await fetch("http://localhost:8080/api/flashcard/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setId,
          word: vocab?.word || selectedWord,
          meaningVi: vocab?.meaningVi || "",
          example: vocab?.example || "",
          ipa: vocab?.ipa || "",
        }),
      });

      alert("Đã thêm vào Flashcard!");
      setShowSetModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">
              Xem lại bài làm
            </h1>

            <p className="text-gray-500 dark:text-gray-400">
              Kiểm tra đáp án và giải thích chi tiết
            </p>
          </div>

          {/* số câu đúng */}
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow text-sm dark:text-gray-200">
            Đúng:
            <span className="ml-1 font-semibold text-green-600">{correct}</span>
            / {answers.length}
          </div>
        </div>

        {/* danh sách nhóm câu hỏi */}

        {groupedEntries.map(([passage, items], groupIndex) => (
          <div
            key={groupIndex}
            className={
              part === 5 ? "flex justify-center" : "grid md:grid-cols-2 gap-10"
            }
          >
            {/* passage */}

            {part !== 5 && passage !== "NO_PASSAGE" && (
              <div className="sticky top-24 h-fit">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
                  {/* part 6 */}
                  {part === 6 && (
                    <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                      {renderClickableText(passage)}
                    </p>
                  )}

                  {/* part 7 */}
                  {part === 7 && (
                    <>
                      {items[0]?.question?.header && (
                        <div className="text-center font-semibold text-gray-700 mb-6">
                          {items[0].question.header}
                        </div>
                      )}

                      <Part7Passage
                        passage={passage}
                        renderClickableText={renderClickableText}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* câu hỏi */}

            <div
              className={
                part === 5 ? "space-y-8 max-w-2xl w-full" : "space-y-8"
              }
            >
              {items.map((item, index) => {
                const q = item.question;
                const isCorrect = item.selected === item.correct;

                return (
                  <div
                    key={index}
                    className="
                      bg-white dark:bg-gray-800
                      p-6
                      rounded-xl
                      shadow
                      border dark:border-gray-700
                    "
                  >
                    {/* header câu */}

                    <div className="flex justify-between items-center mb-4">
                      <p className="font-semibold text-lg dark:text-white">
                        Câu {q.questionNumber || index + 1}
                      </p>

                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle2 size={18} />
                          Đúng
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle size={18} />
                          Sai
                        </span>
                      )}
                    </div>

                    {/* nội dung câu hỏi */}

                    <p className="mb-5 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {renderClickableText(q.question)}
                    </p>

                    {/* đáp án */}

                    <div className="space-y-3">
                      {["A", "B", "C", "D"].map((opt) => {
                        const text = q[`option${opt}`];

                        let style =
                          "flex items-center gap-3 border rounded-lg p-3";

                        if (opt === item.correct) {
                          style +=
                            " bg-green-50 border-green-500 dark:bg-green-900/30";
                        } else if (opt === item.selected) {
                          style +=
                            " bg-red-50 border-red-500 dark:bg-red-900/30";
                        } else {
                          style +=
                            " bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
                        }

                        return (
                          <div key={opt} className={style}>
                            <b className="w-6">{opt}.</b>
                            <span>{renderClickableText(text)}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* giải thích */}

                    {q.explanation && (
                      <div
                        className="
                          mt-6
                          p-4
                          rounded-lg
                          border
                          bg-blue-50
                          border-blue-200
                          dark:bg-blue-900/30
                          dark:border-blue-800
                          text-gray-700 dark:text-gray-200
                        "
                      >
                        <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                          Giải thích
                        </p>

                        <p className="text-sm leading-relaxed">
                          {renderClickableText(q.explanation)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* popup từ vựng */}

        {showPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 w-[420px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">
              {/* đóng popup */}

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

              {/* header */}

              <div className="mb-4 border-b pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="text-blue-600" size={20} />

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {vocab?.word || selectedWord}
                  </h2>
                </div>

                {vocab?.partOfSpeech && (
                  <p className="text-gray-500 text-sm">
                    {vocab.partOfSpeech} • {vocab.ipa}
                  </p>
                )}
              </div>

              {/* nội dung vocab */}

              {vocab ? (
                <div className="space-y-4">
                  {vocab.meaningEn && (
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200">
                        Nghĩa tiếng Anh
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {vocab.meaningEn}
                      </p>
                    </div>
                  )}

                  {vocab.meaningVi && (
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200">
                        Nghĩa tiếng Việt
                      </p>
                      <p className="text-blue-600 dark:text-blue-400">
                        {vocab.meaningVi}
                      </p>
                    </div>
                  )}

                  {vocab.example && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                      <p className="font-semibold mb-1">Ví dụ</p>
                      <p className="italic">{vocab.example}</p>
                    </div>
                  )}

                  {vocab.synonyms && vocab.synonyms.length > 0 && (
                    <div>
                      <p className="font-semibold">Từ đồng nghĩa</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {vocab.synonyms.map((syn, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* các nút thao tác */}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => playAudio(vocab.word)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Volume2 size={16} />
                      Nghe phát âm
                    </button>

                    <button
                      onClick={addFlashcard}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Thêm Flashcard
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-6">
                  Đang tải dữ liệu...
                </p>
              )}

              {/* nút đóng */}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-5 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* modal chọn flashcard */}

        {showSetModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 w-[420px] max-h-[520px] rounded-2xl shadow-2xl flex flex-col">
              {/* header */}

              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen size={22} className="text-blue-600" />
                  <h2 className="text-lg font-bold">Chọn bộ Flashcard</h2>
                </div>

                <button
                  onClick={() => setShowSetModal(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* danh sách set */}

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {sets.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    Bạn chưa có bộ flashcard nào
                  </div>
                )}

                {sets.map((set) => (
                  <div
                    key={set.id}
                    className="
                      border rounded-xl p-4
                      hover:bg-blue-50 dark:hover:bg-gray-700
                      flex justify-between items-center
                      cursor-pointer
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <Layers size={18} />
                      </div>

                      <div>
                        <p className="font-semibold">{set.title}</p>
                        <p className="text-xs text-gray-500">
                          {set.cardCount || 0} từ vựng
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => addToSet(set.id)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Plus size={14} />
                      Thêm
                    </button>
                  </div>
                ))}
              </div>

              {/* footer */}

              <div className="px-6 py-4 border-t flex justify-center">
                <button
                  onClick={() => setShowSetModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* nút quay lại */}

        <div className="flex justify-center gap-4 pt-6">
          <Link
            to="/practice"
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-lg
              bg-gray-500
              text-white
              hover:bg-gray-600
            "
          >
            <ArrowLeft size={18} />
            Quay lại luyện tập
          </Link>
        </div>
      </div>
    </div>
  );
}
