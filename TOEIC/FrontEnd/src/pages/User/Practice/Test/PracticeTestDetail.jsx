import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PracticeTestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [history, setHistory] = useState([]);

  const [selectedParts, setSelectedParts] =
    useState([]);

  const [selectedTime, setSelectedTime] =
    useState("");

  const USER_ID = 1; // TODO: lấy user thật

  // ================= FETCH TEST =================
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/practice-tests/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTest(data);
      })
      .catch((err) => {
        console.error(
          "Fetch test error:",
          err
        );
      });
  }, [id]);

  // ================= FETCH HISTORY =================
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/exam/history/${USER_ID}`
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (item) =>
            Number(item.testId) ===
              Number(id) &&
            item.completed === true
        );

        // mới nhất lên đầu
        filtered.sort(
          (a, b) =>
            new Date(b.endTime) -
            new Date(a.endTime)
        );

        setHistory(filtered);
      })
      .catch((err) => {
        console.error(
          "History error:",
          err
        );
      });
  }, [id]);

  // ================= START PRACTICE =================
  const handleStart = () => {
    if (selectedParts.length === 0) {
      alert(
        "Vui lòng chọn ít nhất một part"
      );
      return;
    }

    const sortedParts =
      [...selectedParts].sort(
        (a, b) => a - b
      );

    const partsParam =
      sortedParts.join("-");

    navigate(
      `/practice/${id}/parts/${partsParam}?time=${selectedTime}`
    );
  };

  // ================= TOGGLE PART =================
  const togglePart = (part) => {
    setSelectedParts((prev) => {
      if (prev.includes(part)) {
        return prev.filter(
          (p) => p !== part
        );
      }

      return [...prev, part];
    });
  };

  // ================= PART DATA =================
  const parts = [
    {
      part: 5,
      title:
        "Grammar & Vocabulary",
      questions: 30,
      color:
        "from-blue-500 to-blue-600",
    },
    {
      part: 6,
      title: "Text Completion",
      questions: 16,
      color:
        "from-green-500 to-green-600",
    },
    {
      part: 7,
      title:
        "Reading Comprehension",
      questions: 54,
      color:
        "from-purple-500 to-purple-600",
    },
  ];

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm opacity-80 mb-2">
            TOEIC Reading Practice
          </p>

          <h1 className="text-4xl font-bold mb-4">
            {test.title}
          </h1>

          <p className="text-blue-100 max-w-2xl">
            {test.description ||
              "Luyện tập TOEIC Reading với Part 5, 6, 7"}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="bg-white/10 px-4 py-2 rounded-xl">
              ⏱ 75 phút
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl">
              📘 3 phần thi
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl">
              ❓ 100 câu hỏi
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= HISTORY ================= */}
        {history.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-5">
              📜 Lịch sử luyện tập
            </h2>

            <div className="space-y-4">
             {history.map((item) => (
  <div
    key={item.id}
    onClick={() =>
      navigate(
        `/practice-history/${item.id}`
      )
    }
    className="bg-white rounded-2xl shadow-md px-6 py-5 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
  >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div>
                      <div className="font-bold text-lg text-gray-800">
                        {item.parts
                          ?.split(",")
                          .map(
                            (p) =>
                              `Part ${p}`
                          )
                          .join(", ")}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.endTime
                          ? new Date(
                              item.endTime
                            ).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-700 font-bold px-5 py-2 rounded-xl">
                        {
                          item.correctAnswers
                        }
                        /
                        {
                          item.totalQuestions
                        }
                      </div>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        Hoàn thành
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PARTS ================= */}
        <h2 className="text-2xl font-bold mb-6">
          Chọn Part để luyện tập
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {parts.map((item) => (
            <div
              key={item.part}
              onClick={() =>
                togglePart(item.part)
              }
              className={`bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 hover:-translate-y-1 ${
                selectedParts.includes(
                  item.part
                )
                  ? "border-blue-500 shadow-xl"
                  : "border-transparent"
              }`}
            >
              {/* HEADER */}
              <div
                className={`bg-gradient-to-r ${item.color} p-6 text-white`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      Part {item.part}
                    </h3>

                    <p className="opacity-90">
                      {item.title}
                    </p>
                  </div>

                  {selectedParts.includes(
                    item.part
                  ) && (
                    <div className="bg-white text-green-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Số câu hỏi
                  </span>

                  <span className="font-bold text-xl">
                    {
                      item.questions
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= TIME ================= */}
        {selectedParts.length >
          0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              Chọn thời gian
              làm bài
            </h2>

            <select
              value={selectedTime}
              onChange={(e) =>
                setSelectedTime(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4 mb-6"
            >
              <option value="">
                Không giới hạn
              </option>

              {[
                5, 10, 15, 20, 30,
                45, 60, 90, 120,
              ].map((time) => (
                <option
                  key={time}
                  value={time}
                >
                  {time} phút
                </option>
              ))}
            </select>

            <button
              onClick={
                handleStart
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition"
            >
              Bắt đầu luyện tập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}