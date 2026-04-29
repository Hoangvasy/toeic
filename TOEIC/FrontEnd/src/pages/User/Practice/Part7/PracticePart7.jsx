import { useEffect, useState } from "react";

import Part7Passage from "./Part7Passage";
import Part7Questions from "./Part7Questions";
import QuestionNavigator from "../../../../components/common/Practice/QuestionNavigator";
import Timer from "../../../../components/common/Practice/Timer";

import PracticeResult from "../PracticeResult";

const PracticePart7 = ({ type }) => {
  // danh sách câu hỏi
  const [questions, setQuestions] = useState([]);

  // đáp án người dùng
  const [answers, setAnswers] = useState({});

  // câu hiện tại
  const [current, setCurrent] = useState(0);

  // trạng thái submit
  const [submitted, setSubmitted] = useState(false);

  // session id backend
  const [sessionId, setSessionId] = useState(null);

  // load dữ liệu + tạo session
  useEffect(() => {
    const loadData = async () => {
      try {
        // lấy câu hỏi
        const res = await fetch(
          `http://localhost:8080/api/practice/part7?type=${type}`,
        );
        const data = await res.json();

        setQuestions(data);

        // 🔥 tạo session (fix lỗi chính)
        const session = await fetch(
          "http://localhost:8080/api/practice/session/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: 1,
              part: 7,
              topic: "reading_comprehension",
              questionCount: data.length,
            }),
          },
        ).then((r) => r.json());

        setSessionId(session.id);
      } catch (err) {
        console.error("lỗi load part7:", err);
      }
    };

    loadData();
  }, [type]);

  // loading
  if (!questions.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Đang tải bài đọc...</p>
      </div>
    );
  }

  const passage = questions[0].passage;
  const header = questions[0].header;

  // submit (đã fix)
  const handleSubmit = async () => {
    if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) return;

    let correct = 0;

    try {
      // gửi từng câu trả lời
      await Promise.all(
        questions.map((q) => {
          if (answers[q.id] === q.answer) correct++;

          return fetch("http://localhost:8080/api/practice/answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              questionId: q.id,
              userAnswer: answers[q.id],
              correctAnswer: q.answer,
              timeSpent: 10,
            }),
          });
        }),
      );

      // 🔥 kết thúc session
      await fetch("http://localhost:8080/api/practice/session/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          correctAnswers: correct,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("lỗi submit:", err);
    }
  };

  // hiển thị kết quả
  if (submitted) {
    const formattedAnswers = questions.map((q) => ({
      question: {
        ...q,
        part: 7,
        label: "reading_comprehension",
      },
      selected: answers[q.id],
      correct: q.answer,
    }));

    localStorage.setItem("practiceAnswers", JSON.stringify(formattedAnswers));

    return <PracticeResult answers={formattedAnswers} />;
  }

  // UI
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* header */}

      <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">PART 7 - ĐỌC HIỂU</h1>

        <Timer />
      </div>

      {/* nội dung */}

      <div className="flex flex-1 overflow-hidden">
        {/* passage */}

        <div className="w-1/2 overflow-y-auto p-8 bg-white border-r">
          <div className="text-center font-semibold text-gray-700 mb-6">
            {header}
          </div>

          <Part7Passage passage={passage} />
        </div>

        {/* câu hỏi */}

        <div className="w-1/2 overflow-y-auto p-8">
          <Part7Questions
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            submitted={submitted}
          />
        </div>
      </div>

      {/* navigator */}

      <QuestionNavigator
        questions={questions}
        answers={answers}
        current={current}
        setCurrent={setCurrent}
      />

      {/* submit */}

      <div className="p-4 bg-white border-t flex justify-center">
        <button
          onClick={handleSubmit}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-8
            py-3
            rounded-lg
            font-semibold
          "
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
};

export default PracticePart7;
