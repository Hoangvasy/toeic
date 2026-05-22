import { useState } from "react";

export default function Part5({ data = [] }) {
  const [answers, setAnswers] = useState({});

  const handleSelect = (qId, choice) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: choice
    }));
  };

  const getScore = () => {
    return data.filter(q => answers[q.id] === q.answer).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-3xl flex items-center gap-3 shadow-lg">
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-bold tracking-wider">PART 5</div>
                <div className="text-xs -mt-1 opacity-90">INCOMPLETE SENTENCES</div>
              </div>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              {Object.keys(answers).length} / {data.length} câu đã làm
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white shadow-sm px-5 h-11 rounded-3xl">
            <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${(Object.keys(answers).length / data.length) * 100 || 0}%`
                }}
              />
            </div>
            <span className="font-semibold text-emerald-600 text-sm">
              {Math.round((Object.keys(answers).length / data.length) * 100) || 0}%
            </span>
          </div>
        </div>

        {/* QUESTIONS */}
        {data.map((q, index) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.answer;
          const showExplanation = userAnswer !== undefined;

          return (
            <div key={q.id} className="bg-white rounded-3xl shadow-xl border border-slate-100 mb-8 overflow-hidden">

              {/* HEADER QUESTION */}
              <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">
                      Câu {index + 1}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Incomplete Sentence
                    </div>
                  </div>
                </div>

                {showExplanation && (
                  <div className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                    isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}>
                    {isCorrect ? "✓ ĐÚNG" : "✗ SAI"}
                  </div>
                )}
              </div>

              {/* QUESTION (nhỏ lại) */}
              <div className="px-8 pt-6 pb-4">
                <p className="text-[18px] leading-relaxed text-slate-800 font-medium">
                  {q.question}
                </p>
              </div>

              {/* OPTIONS (nhỏ + gọn hơn) */}
              <div className="px-8 pb-6 space-y-2">
                {["A", "B", "C", "D"].map((opt) => {
                  const optionText = q[`option${opt}`];
                  const isSelected = userAnswer === opt;
                  const isCorrectAnswer = q.answer === opt;

                  return (
                    <div
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      } ${showExplanation && isCorrectAnswer ? "border-emerald-500 bg-emerald-50" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600 w-6">
                          {opt}.
                        </span>
                        <span className="text-slate-700">
                          {optionText}
                        </span>
                      </div>

                      {isSelected && <span className="text-blue-500">●</span>}
                      {showExplanation && isCorrectAnswer && (
                        <span className="text-emerald-500">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EXPLANATION (giữ nguyên, chỉ nhẹ lại chút spacing) */}
              {showExplanation && (
                <div className="mx-8 mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">

                  <div className="font-semibold text-slate-700 mb-2 text-sm">
                    📖 Giải thích
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    {q.explanation || "Không có giải thích cho câu này."}
                  </p>

                   {q.translationVn && (
                    <div className="mt-4 pt-3 border-t text-xs text-slate-500">
                      <span className="font-medium text-blue-600">
                        Dịch câu hỏi:
                      </span>{" "}
                      {q.translationVn}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-2">
                      Dịch nghĩa
                    </div>

                    <div className="space-y-1 text-xs">
                      {["A", "B", "C", "D"].map((opt) => (
                        <div key={opt} className="flex gap-2 text-slate-700">
                          <span className="w-5 font-medium">{opt}.</span>
                          <span>{q[`option${opt}Vn`] || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </div>
              )}
            </div>
          );
        })}

        {/* SCORE */}
        <div className="sticky bottom-6 bg-white/95 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-3xl p-5 flex justify-between items-center">
          <div className="text-lg">
            Điểm hiện tại:{" "}
            <span className="font-bold text-emerald-600">
              {getScore()}
            </span>{" "}
            / {data.length}
          </div>
          <button
            onClick={() => setAnswers({})}
            className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl font-medium"
          >
            🔄 Làm lại tất cả
          </button>
        </div>

      </div>
    </div>
  );
}