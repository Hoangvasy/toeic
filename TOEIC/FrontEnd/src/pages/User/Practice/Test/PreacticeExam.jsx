import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Part5, Part6, Part7 } from "./Part";
import axios from "axios";

export default function PracticeExam() {
  const { id, parts } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const time = query.get("time");

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [flatQuestions, setFlatQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(time ? Number(time) * 60 : null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [flag, setFlag] = useState({});
  const [sessionId, setSessionId] = useState(null);

  // ================= HELPER =================
  const determineType = (item) => {
    if (item.questions && item.questions.length > 0) return "part7";
    if (item.groupId && item.passage) return "part6";
    return "part5";
  };

  const findQuestionById = (questionId) => {
    for (const group of questions) {
      const found = group.questions.find((q) => q.id === questionId);
      if (found) return { ...found, groupType: group.type };
    }
    return null;
  };

  // ================= FETCH EXAM =================
  useEffect(() => {
    fetch(`http://localhost:8080/api/practice-exam?testId=${id}&parts=${parts}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Raw API Data:", data);

        const processed = data.map((item) => ({
          ...item,
          type: item.type || determineType(item),
        }));

        const groupedMap = processed.reduce((acc, item) => {
          const groupKey = `${item.type}-${item.groupId || item.id}`;

          if (!acc[groupKey]) {
            acc[groupKey] = {
              id: item.groupId || item.id,
              type: item.type,
              passage: item.passage || "",
              header: item.header || "",
              questions: [],
            };
          }

          if (item.questions && item.questions.length > 0) {
            acc[groupKey].questions = item.questions.map((q) => ({
              ...q,
              part: 7,
            }));
          } else {
            acc[groupKey].questions.push({
              ...item,
              part: item.type === "part6" ? 6 : 5,
            });
          }

          return acc;
        }, {});

        const grouped = Object.values(groupedMap);
        setQuestions(grouped);

        const flat = grouped.flatMap((group) =>
          group.questions.map((q) => ({
            id: q.id,
            number: q.questionNumber,
            answerKey: q.id,
            groupType: group.type,
          }))
        );

        setFlatQuestions(flat);

        // ================= START EXAM =================
        fetch("http://localhost:8080/api/exam/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            testId: Number(id),
            parts,
            totalQuestions: flat.length,
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then((session) => {
            console.log("Session:", session);
            setSessionId(session.id);
          })
          .catch((err) => console.error("Start exam error:", err));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id, parts]);

  // ================= TIMER =================
  useEffect(() => {
    if (seconds === null || submitted) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => handleSubmit(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted, seconds]);

  const formatTime = (s) => {
    if (s === null) return "∞";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ================= ANSWER =================
  const handleSelect = (questionId, option) => {
    if (submitted) return;

    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    if (!sessionId) return;

    const question = findQuestionById(questionId);
    if (!question) return;

    fetch("http://localhost:8080/api/exam/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sessionId,
        questionId: question.id,
        part: question.part || 5,
        questionNumber: question.questionNumber,
        userAnswer: option,
        correctAnswer: question.answer,
        timeSpent: 0,
        label: question.label,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Saved answer:", data))
      .catch((err) => console.error("Save answer error:", err));
  };

  // ================= SUBMIT =================
const handleSubmit = async () => {
  if (submitted) return;
  setSubmitted(true);

  try {
    // Chuẩn bị dữ liệu - CHỈ gửi câu đã làm
    const allQuestions = [];
    const attemptedAnswers = {}; // CHỈ chứa câu đã trả lời
    
    questions.forEach((group) => {
      if (group.type === "part7" || group.type === "part6") {
        // Cho part6/part7
        const groupQuestions = group.questions.map((q, idx) => {
          // CHỈ lấy answer nếu có
          if (answers[q.id]) {
            attemptedAnswers[`${group.id}-${idx}`] = answers[q.id];
          }
          
          return {
            id: q.id,
            type: group.type,
            answer: q.answer,
            label: q.label || q.text?.substring(0, 100),
            questionNumber: q.questionNumber
          };
        });
        
        allQuestions.push({
          type: group.type,
          passage: group.passage,
          questions: groupQuestions
        });
      } else {
        // Cho part5
        group.questions.forEach((q) => {
          if (answers[q.id]) {
            attemptedAnswers[q.id] = answers[q.id];
          }
          
          allQuestions.push({
            id: q.id,
            type: "part5",
            answer: q.answer,
            label: q.label || q.text?.substring(0, 100),
            questionNumber: q.questionNumber
          });
        });
      }
    });

    // Tính số câu đúng - CHỈ tính trên câu đã làm
    let correctCount = 0;
    for (const [qId, userAnswer] of Object.entries(answers)) {
      const question = findQuestionById(parseInt(qId));
      if (question && userAnswer === question.answer) {
        correctCount++;
      }
    }

    const totalAttempted = Object.keys(answers).length;
    const totalQuestions = flatQuestions.length;

    // 1. Gọi finish exam để lưu session (nếu cần)
    if (sessionId) {
  const res = await fetch(`http://localhost:8080/api/exam/finish/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(allQuestions),
  });

  console.log("FINISH STATUS:", res.status);

  const text = await res.text();
  console.log("FINISH RESPONSE:", text);
}

    // 2. Gọi attempt/submit - CHỈ gửi câu đã làm
    await axios.post(
      "http://localhost:8080/api/attempt/submit",
      {
        answers: attemptedAnswers,  // CHỈ câu đã trả lời
        questions: allQuestions,     // Tất cả câu hỏi (để biết đáp án đúng)
        score: correctCount,
        total: totalAttempted,       // Tổng số câu ĐÃ LÀM
        correct: correctCount,
      },
      {
        withCredentials: true,
      }
    );

    // 3. Chuyển sang trang kết quả
    navigate("/result", {
  state: {
    sessionId,

    // thêm dòng này
    selectedParts: parts,

    answered: totalAttempted,
    total: totalQuestions,
    correct: correctCount,
  },
});
  } catch (err) {
    console.error("Finish exam error:", err);
    setSubmitted(false);
  }
};

  // ================= SCROLL & FLAG =================
  const scrollToQuestion = (id) => {
    const el = document.getElementById(`q-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFlag = (questionId, e) => {
    if (e) e.stopPropagation();
    setFlag((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.reduce((sum, g) => sum + g.questions.length, 0);
  const flaggedCount = Object.keys(flag).filter((id) => flag[id]).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải đề thi...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* MAIN CONTENT */}
      <div className="pr-[280px]">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="space-y-6">
            {questions.map((group) => (
              <div key={group.id} id={`q-${group.questions[0]?.id || group.id}`}>
                {group.type === "part7" && (
                  <Part7
                    group={group}
                    answers={answers}
                    onSelect={handleSelect}
                    submitted={submitted}
                    flags={flag}
                    onToggleFlag={toggleFlag}
                  />
                )}
                {group.type === "part6" && (
                  <Part6
                    group={group}
                    answers={answers}
                    onSelect={handleSelect}
                    submitted={submitted}
                    flags={flag}
                    onToggleFlag={toggleFlag}
                  />
                )}
                {group.type === "part5" && (
                  <Part5
                    question={group.questions[0]}
                    answer={answers[group.questions[0]?.id]}
                    onSelect={handleSelect}
                    submitted={submitted}
                    flag={flag[group.questions[0]?.id]}
                    onToggleFlag={toggleFlag}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - FULL VERSION */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 w-[280px] bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        {/* Timer */}
        <div className="p-4 border-b text-center">
          <div className="text-red-500 font-bold text-2xl">⏱ {formatTime(seconds)}</div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-b">
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className={`w-full py-3 rounded-lg font-bold transition ${
              submitted
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {submitted ? "Đã nộp bài" : "Nộp bài"}
          </button>
          <p className="text-xs mt-3 text-center text-gray-500">
            📝 {answeredCount} / {totalQuestions} câu đã trả lời
          </p>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 text-xs flex justify-between border-b">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Đã làm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Đánh dấu</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded border"></div>
            <span>Chưa làm</span>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 gap-2">
            {flatQuestions.map((q) => {
              const isAnswered = answers[q.answerKey] !== undefined;
              const isFlagged = flag[q.id];

              let buttonClass = "py-2 text-sm font-medium transition rounded border ";

              if (isFlagged) buttonClass += "bg-red-500 text-white border-red-600";
              else if (isAnswered) buttonClass += "bg-green-500 text-white border-green-600";
              else buttonClass += "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700";

              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={buttonClass}
                  title={`Câu ${q.number}`}
                >
                  {q.number}
                  {isFlagged && <span className="ml-0.5 text-xs">🚩</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-center text-xs text-gray-400">
          🚩 {flaggedCount} câu đã đánh dấu
        </div>
      </div>
    </div>
  );
}