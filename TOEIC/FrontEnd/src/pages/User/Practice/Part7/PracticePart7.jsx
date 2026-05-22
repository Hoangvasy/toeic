import { useEffect, useState } from "react";

import Part7Passage from "./Part7Passage";
import Part7Questions from "./Part7Questions";

import QuestionNavigator from "../../../../components/common/Practice/QuestionNavigator";
import Timer from "../../../../components/common/Practice/Timer";

import PracticeResult from "../PracticeResult";

const PracticePart7 = ({ type }) => {
  // group passage
  const [group, setGroup] = useState(null);

  // answers user
  const [answers, setAnswers] = useState({});

  // current question
  const [current, setCurrent] = useState(0);

  // submit state
  const [submitted, setSubmitted] = useState(false);

  // session
  const [sessionId, setSessionId] = useState(null);

  // current user
  const [userId, setUserId] = useState(null);

  // loading
  const [loading, setLoading] = useState(true);

  // start time
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        setUserId(data.userId);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // reset state khi đổi type
        setAnswers({});
        setSubmitted(false);
        setCurrent(0);

        // fetch group theo type
        const res = await fetch(
          `http://localhost:8080/api/practice/part7?type=${type}`,
        );

        const data = await res.json();

        setGroup(data);

        // create session
        const session = await fetch(
          "http://localhost:8080/api/practice/session/start",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              userId,

              part: 7,

              topic: data.structureType || "reading_comprehension",

              questionCount: data.questions.length,
            }),
          },
        ).then((r) => r.json());

        setSessionId(session.id);
      } catch (err) {
        console.error("Lỗi load part7:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, userId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Đang tải bài đọc...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Không có dữ liệu</p>
      </div>
    );
  }

  const questions = group.questions || [];

  const passage = group.passage;

  const header = group.header;

  const handleSubmit = async () => {
    if (!sessionId) return;

    if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) {
      return;
    }

    let correct = 0;

    const answeredQuestions = Object.keys(answers).length;

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    try {
      await Promise.all(
        questions.map((q) => {
          if (answers[q.id] === q.answer) {
            correct++;
          }

          return fetch("http://localhost:8080/api/practice/answer", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              sessionId,

              questionId: q.id,

              userAnswer: answers[q.id] || "",

              correctAnswer: q.answer,

              timeSpent: 10,
            }),
          });
        }),
      );

      // end session
      await fetch("http://localhost:8080/api/practice/session/end", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          sessionId,

          correctAnswers: correct,

          durationSeconds,

          answeredQuestions,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Lỗi submit:", err);
    }
  };

  if (submitted) {
    const formattedAnswers = questions.map((q) => ({
      question: {
        ...q,

        part: 7,

        label: group.structureType,
      },

      selected: answers[q.id],

      correct: q.answer,
    }));

    localStorage.setItem("practiceAnswers", JSON.stringify(formattedAnswers));

    return <PracticeResult answers={formattedAnswers} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* HEADER */}

      <div
        className="
        flex justify-between items-center
        px-6 py-4
        bg-white border-b shadow-sm
        "
      >
        <h1
          className="
          text-xl font-bold text-blue-600
          "
        >
          PART 7 - {group.structureType}
        </h1>

        <div className="flex items-center gap-4">
          <Timer />

          <div
            className="
            bg-blue-600 text-white
            px-5 py-2
            rounded-lg font-semibold
            "
          >
            {Object.keys(answers).length}/{questions.length}
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 overflow-hidden">
        {/* PASSAGE */}

        <div
          className="
          w-1/2 overflow-y-auto
          p-8 bg-white border-r
          "
        >
          <div
            className="
            text-center font-semibold
            text-gray-700 mb-6
            "
          >
            {header}
          </div>

          <Part7Passage passage={passage} />
        </div>

        {/* QUESTIONS */}

        <div className="w-1/2 overflow-y-auto p-8">
          <Part7Questions
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            submitted={submitted}
          />
        </div>
      </div>

      {/* NAVIGATOR */}

      <QuestionNavigator
        questions={questions}
        answers={answers}
        current={current}
        setCurrent={setCurrent}
      />

      {/* SUBMIT */}

      <div
        className="
        p-4 bg-white border-t
        flex justify-center
        "
      >
        <button
          onClick={handleSubmit}
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-8 py-3
          rounded-lg
          font-semibold
          transition
          "
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
};

export default PracticePart7;
