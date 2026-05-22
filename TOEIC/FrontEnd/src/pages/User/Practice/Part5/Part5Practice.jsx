import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Timer from "../../../../components/common/Practice/Timer";
import PracticeResult from "../PracticeResult";

export default function Part5Practice() {
  // lấy label từ url
  const { label } = useParams();

  const [questions, setQuestions] = useState([]);

  // answers theo question.id
  const [answers, setAnswers] = useState({});

  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(true);

  const [showResult, setShowResult] = useState(false);

  const [sessionId, setSessionId] = useState(null);

  const [userId, setUserId] = useState(null);

  // thời gian bắt đầu
  const [startTime] = useState(Date.now());

  // số câu đã làm
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });

        setUserId(res.data.userId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // đợi có user mới load
    if (!userId) return;

    const loadQuestions = async () => {
      try {
        // lấy câu hỏi
        const res = await axios.get(
          `http://localhost:8080/api/practice/part5/random?label=${label}&limit=20`,
        );

        setQuestions(res.data);

        // tạo practice session
        const session = await axios.post(
          "http://localhost:8080/api/practice/session/start",
          {
            userId: userId,

            part: 5,

            topic: label,

            questionCount: res.data.length,
          },
        );

        setSessionId(session.data.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [label, userId]);

  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  if (showResult) {
    const answerList = questions.map((q) => {
      return {
        question: {
          ...q,
          part: 5,
        },

        selected: answers[q.id],

        correct: q.answer,
      };
    });

    return <PracticeResult answers={answerList} />;
  }

  // câu hiện tại
  const question = questions[current];

  const handleSelect = (questionId, option) => {
    setAnswers({
      ...answers,

      [questionId]: option,
    });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    // chưa có session
    if (!sessionId) return;

    let correct = 0;

    // duyệt tất cả câu hỏi
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      const userAnswer = answers[q.id];

      // tính số câu đúng
      if (userAnswer === q.answer) {
        correct++;
      }

      try {
        // lưu answer
        await axios.post("http://localhost:8080/api/practice/answer", {
          sessionId: sessionId,

          questionId: q.id,

          userAnswer: userAnswer || "",

          correctAnswer: q.answer,

          // placeholder
          timeSpent: 10,
        });
      } catch (err) {
        console.error(err);
      }
    }

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    try {
      // kết thúc session
      await axios.post("http://localhost:8080/api/practice/session/end", {
        sessionId: sessionId,

        correctAnswers: correct,

        durationSeconds: durationSeconds,

        answeredQuestions: answeredCount,
      });

      // lưu local
      localStorage.setItem(
        "practiceAnswers",

        JSON.stringify(answers),
      );

      // chuyển kết quả
      setShowResult(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-10 max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">PART 5</h2>

          {/* NAV */}

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="
              bg-blue-400
              text-white
              px-6 py-2
              rounded
              disabled:opacity-50
              "
            >
              ← Câu trước
            </button>

            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              className="
              bg-blue-600
              text-white
              px-6 py-2
              rounded
              disabled:opacity-50
              "
            >
              Câu tiếp →
            </button>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-6 py-2
              rounded
              font-semibold
              "
            >
              NỘP BÀI
            </button>

            <Timer seconds={7200} />

            <div
              className="
              bg-orange-500
              text-white
              px-6 py-3
              rounded
              text-lg
              font-bold
              "
            >
              {answeredCount}/{questions.length}
            </div>
          </div>
        </div>

        {/* QUESTION */}

        <div className="bg-white p-8 rounded-xl shadow">
          <div className="text-lg font-medium mb-6">
            {question.questionNumber}. {question.question}
          </div>

          {/* OPTIONS */}

          <div className="space-y-4">
            {["A", "B", "C", "D"].map((opt) => {
              const value = question["option" + opt];

              return (
                <label
                  key={opt}
                  className={`
                    flex items-center
                    gap-3
                    border
                    p-4
                    rounded
                    cursor-pointer
                    hover:bg-gray-50

                    ${
                      answers[question.id] === opt
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }
                    `}
                >
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={opt}
                    checked={answers[question.id] === opt}
                    onChange={() => handleSelect(question.id, opt)}
                  />

                  <span>
                    <b>{opt}.</b> {value}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
