import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Timer from "../../../../components/common/Practice/Timer";
import PracticeResult from "../PracticeResult";

export default function Part5Practice() {
  // lấy label từ url (grammar / vocab)
  const { label } = useParams();

  // danh sách câu hỏi
  const [questions, setQuestions] = useState([]);

  // lưu đáp án người dùng
  const [answers, setAnswers] = useState({});

  // câu hiện tại
  const [current, setCurrent] = useState(0);

  // trạng thái loading
  const [loading, setLoading] = useState(true);

  // hiển thị kết quả
  const [showResult, setShowResult] = useState(false);

  // session id backend
  const [sessionId, setSessionId] = useState(null);

  // số câu đã làm
  const answeredCount = Object.keys(answers).length;

  // load câu hỏi + tạo session
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // gọi api lấy câu hỏi
        const res = await axios.get(
          `http://localhost:8080/api/practice/part5/random?label=${label}&limit=20`,
        );

        setQuestions(res.data);

        // tạo session luyện tập
        const session = await axios.post(
          "http://localhost:8080/api/practice/session/start",
          {
            userId: 1,
            part: 5,
            topic: label,
            questionCount: res.data.length,
          },
        );

        setSessionId(session.data.id);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadQuestions();
  }, [label]);

  // trạng thái loading
  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  // hiển thị kết quả sau khi submit
  if (showResult) {
    const answerList = questions.map((q, index) => {
      return {
        question: { ...q, part: 5 },
        selected: answers[index],
        correct: q.answer,
      };
    });

    return <PracticeResult answers={answerList} />;
  }

  // câu hiện tại
  const question = questions[current];

  // chọn đáp án
  const handleSelect = (option) => {
    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  // sang câu tiếp theo
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // quay lại câu trước
  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  // nộp bài
  const handleSubmit = async () => {
    let correct = 0;

    // duyệt tất cả câu hỏi
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];

      // tính số câu đúng
      if (userAnswer === q.answer) correct++;

      try {
        // gửi từng câu trả lời lên server
        await axios.post("http://localhost:8080/api/practice/answer", {
          sessionId: sessionId,
          questionId: q.id,
          userAnswer: userAnswer || "",
          correctAnswer: q.answer,
          timeSpent: 10,
        });
      } catch (err) {
        console.error(err);
      }
    }

    // kết thúc session
    await axios.post("http://localhost:8080/api/practice/session/end", {
      sessionId: sessionId,
      correctAnswers: correct,
    });

    // chuyển sang màn hình kết quả
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-10 max-w-5xl mx-auto">
        {/* thanh điều hướng trên cùng */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">PART 5</h2>

          {/* nút chuyển câu */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="bg-blue-400 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              ← Câu trước
            </button>

            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Câu tiếp →
            </button>
          </div>

          {/* submit + timer + progress */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold"
            >
              NỘP BÀI
            </button>

            {/* bộ đếm thời gian */}
            <Timer seconds={7200} />

            {/* số câu đã làm */}
            <div className="bg-orange-500 text-white px-6 py-3 rounded text-lg font-bold">
              {answeredCount}/{questions.length}
            </div>
          </div>
        </div>

        {/* câu hỏi */}

        <div className="bg-white p-8 rounded-xl shadow">
          <div className="text-lg font-medium mb-6">
            {question.questionNumber}. {question.question}
          </div>

          {/* các đáp án */}
          <div className="space-y-4">
            {["A", "B", "C", "D"].map((opt) => {
              const value = question["option" + opt];

              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 border p-4 rounded cursor-pointer hover:bg-gray-50
                  ${
                    answers[current] === opt ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    checked={answers[current] === opt}
                    onChange={() => handleSelect(opt)}
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
