import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AIPath() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const options = ["A", "B", "C", "D"];

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:8080/api/ai-path/entry-test");
        const data = res.data;

        const normalized = [
          ...(data.part5 || []).map(q => ({ ...q, type: "part5" })),
          ...(data.part6Groups || []).map(g => ({ ...g, type: "part6" })),
          ...(data.part7Groups || []).map(g => ({ ...g, type: "part7" }))
        ];

        setQuestions(normalized);
        setAnswers({});
      } catch (err) {
        console.error("LOAD ERROR:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= HELPER FUNCTIONS =================
  const getAnswerKey = (questionIndex, subIndex = null) => {
    return subIndex !== null ? `${questionIndex}-${subIndex}` : questionIndex;
  };

  const getCurrentAnswer = (subIndex = null) => {
    const key = getAnswerKey(currentIndex, subIndex);
    return answers[key];
  };

  const isCurrentQuestionAnswered = () => {
    const current = questions[currentIndex];
    if (current?.type === "part6" || current?.type === "part7") {
      return current.questions.every((_, idx) => getCurrentAnswer(idx));
    }
    return !!getCurrentAnswer();
  };

  const getUnansweredQuestions = () => {
    const unanswered = [];
    questions.forEach((q, i) => {
      if (q.type === "part6" || q.type === "part7") {
        q.questions.forEach((_, idx) => {
          const key = `${i}-${idx}`;
          if (!answers[key]) {
            unanswered.push({ questionIndex: i, subIndex: idx });
          }
        });
      } else {
        if (!answers[i]) {
          unanswered.push({ questionIndex: i, subIndex: null });
        }
      }
    });
    return unanswered;
  };

  // ================= SELECT HANDLER =================
  const handleSelect = async (opt, subIndex = null) => {
  const indexSnapshot = currentIndex;
  const current = questions[indexSnapshot];

  const key = getAnswerKey(indexSnapshot, subIndex);

  setAnswers(prev => ({ ...prev, [key]: opt }));

  if (current.type !== "part5") return;

  try {
    const res = await axios.post(
      "http://localhost:8080/api/ai-path/answer",
      {
        label: current.label,
        correctAnswer: current.answer,
        userAnswer: opt,
        questionId: current.idpart5 || current.id
      },
      { withCredentials: true }
    );

    const data = res.data;

   if (data.nextQuestion) {
  setQuestions(prev => {
    const exists = prev.some(q => q.id === data.nextQuestion.id);
    if (exists) return prev;

    // 🚨 chặn tối đa 25 câu
    if (prev.length >= 25) return prev;

    return [...prev, data.nextQuestion];
  });
}

  } catch (err) {
    console.error("HANDLE ANSWER ERROR:", err);
  }
};

  // ================= NAVIGATION =================
  const next = () => {
  // 🚫 chưa trả lời thì không cho qua
  if (!isCurrentQuestionAnswered()) {
    alert("⚠️ Vui lòng chọn đáp án!");
    return;
  }

  if (currentIndex < questions.length - 1) {
    setCurrentIndex(prev => prev + 1);
  }
};

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentIndex(index);
  };

  // ================= SCORE CALCULATION =================
  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    questions.forEach((q, i) => {
      if (q.type === "part6" || q.type === "part7") {
        q.questions.forEach((subQ, idx) => {
          total++;
          if (answers[`${i}-${idx}`] === subQ.answer) correct++;
        });
      } else {
        total++;
        if (answers[i] === q.answer) correct++;
      }
    });

    return { correct, total, score: Math.floor((correct / total) * 100) };
  };

  // ================= SUBMIT =================
  const submit = async () => {
  // const unanswered = getUnansweredQuestions();
  // if (unanswered.length > 0) {
  //   alert(`⚠️ Bạn còn ${unanswered.length} câu chưa trả lời!`);
  //   return;
  // }

  const { score, total, correct } = calculateScore();

  try {
    setSubmitting(true);

    const res = await axios.post(
      "http://localhost:8080/api/ai-path/submit",
      {
        score,
        total,
        correct,
        answers,
        questions,
      },
      { withCredentials: true }
    );

    navigate(`/overview/${res.data.attemptId}`, {
      state: {
        score,
        total,
        correct,
        answers,
        questions,
      },
    });

  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    alert("❌ Nộp bài thất bại. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.");
  } finally {
    setSubmitting(false);
  }
};

  // ================= LOADING STATES =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-700 text-lg">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 text-lg">Không thể tải dữ liệu</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const unansweredCount = getUnansweredQuestions().length;

  // ================= MAIN RENDER =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex gap-5">
        
        {/* MAIN CONTENT - Bên trái */}
        <div className="flex-1">
          {/* Progress Bar nhẹ nhàng */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-5">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>📌 Câu {currentIndex + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Part Badge nhỏ gọn */}
              <div className="mb-4">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold
                  ${current.type === 'part5' ? 'bg-purple-100 text-purple-700' : ''}
                  ${current.type === 'part6' ? 'bg-green-100 text-green-700' : ''}
                  ${current.type === 'part7' ? 'bg-orange-100 text-orange-700' : ''}
                `}>
                  {current.type === 'part5' && 'PART 5'}
                  {current.type === 'part6' && 'PART 6'}
                  {current.type === 'part7' && 'PART 7'}
                </span>
              </div>

              {/* Part 5 */}
              {current.type === "part5" && (
                <div className="space-y-5">
                  <div className="text-base text-gray-800 p-4 bg-gray-50 rounded-lg leading-relaxed">
                    {current.question}
                  </div>
                  <div className="grid gap-2 max-h-[450px] overflow-y-auto pr-1">
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        className={`text-left p-3 rounded-lg border transition-all duration-200
                          ${getCurrentAnswer() === opt 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }
                        `}
                      >
                        <span className="font-semibold text-blue-600 mr-2">{opt}.</span>
                        <span className="text-gray-700 text-sm">{current[`option${opt}`]}</span>
                        {getCurrentAnswer() === opt && (
                          <span className="float-right text-blue-500 text-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Part 6 & Part 7 */}
              {(current.type === "part6" || current.type === "part7") && (
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Passage */}
                  <div className="lg:w-1/2">
                    <div className="bg-gray-50 rounded-lg p-5 border max-h-[550px] overflow-y-auto">
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {current.passage}
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="lg:w-1/2 space-y-4 max-h-[550px] overflow-y-auto pr-1">
                    {current.questions.map((q, qIdx) => (
                      <div key={qIdx} className="border rounded-lg p-4">
                        <div className="font-medium text-gray-800 text-sm mb-3 pb-2 border-b">
                          {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleSelect(opt, qIdx)}
                              className={`w-full text-left p-2.5 rounded-lg border text-sm transition
                                ${getCurrentAnswer(qIdx) === opt 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }
                              `}
                            >
                              <span className="font-semibold text-blue-600 mr-2">{opt}.</span>
                              <span className="text-gray-700">{q[`option${opt}`]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 pt-5 border-t">
                <button
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="px-5 py-2 rounded-lg font-medium text-sm transition
                    disabled:opacity-40 disabled:cursor-not-allowed
                    bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  ◀ Trước
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 
                      text-white rounded-lg font-medium text-sm hover:from-orange-600 
                      hover:to-red-600 transition shadow-md disabled:opacity-50"
                  >
                    {submitting ? "⏳ Đang xử lý..." : "📤 Nộp bài"}
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                      text-white rounded-lg font-medium text-sm hover:from-blue-700 
                      hover:to-indigo-700 transition shadow-md"
                  >
                    Tiếp ▶
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Danh sách câu hỏi */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md sticky top-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">📋 Câu hỏi</span>
                {unansweredCount > 0 && (
                  <span className="bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {unansweredCount}
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = (() => {
                    if (q.type === "part6" || q.type === "part7") {
                      return q.questions.every((_, subIdx) => answers[`${idx}-${subIdx}`]);
                    }
                    return !!answers[idx];
                  })();
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToQuestion(idx)}
                      className={`
                        w-9 h-9 rounded-lg text-center font-medium text-sm transition-all
                        ${currentIndex === idx 
                          ? 'ring-2 ring-blue-500 bg-blue-500 text-white shadow-sm' 
                          : isAnswered 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }
                      `}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            {unansweredCount > 0 && (
              <div className="p-2 bg-yellow-50 border-t border-yellow-100 text-center">
                <p className="text-yellow-700 text-xs">⚠️ {unansweredCount} câu chưa làm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}