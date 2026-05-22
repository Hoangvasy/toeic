import React from "react";

const QuestionCard = ({
  question,
  index,
  onQuestionChange,
  onDelete,
  onAnalyze,
  loading,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          Question {question.number}

          {question.label && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {question.label}
            </span>
          )}

          {question.aiLabel && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              🤖 {question.aiLabel}
            </span>
          )}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="px-3 py-1 bg-gray-800 text-white rounded"
          >
            {loading ? "AI..." : "🤖 AI"}
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* QUESTION EN */}
      <textarea
        value={question.question}
        onChange={(e) =>
          onQuestionChange(index, "question", e.target.value)
        }
        className="w-full border p-3 rounded mb-2"
      />

      {/* QUESTION VI */}
      <textarea
        value={question.translationVn || ""}
        onChange={(e) =>
          onQuestionChange(index, "translationVn", e.target.value)
        }
        placeholder="Dịch tiếng Việt"
        className="w-full border p-3 rounded mb-4 bg-gray-50"
      />

      {/* OPTIONS */}
      <div className="grid md:grid-cols-2 gap-3 mb-2">
        {["A", "B", "C", "D"].map((opt) => (
          <div key={opt} className="space-y-1">
            {/* EN */}
            <input
              value={question.options[opt]}
              onChange={(e) =>
                onQuestionChange(index, opt, e.target.value)
              }
              className="w-full p-2 border rounded"
              placeholder={`Option ${opt}`}
            />

            {/* VI */}
            <input
              value={question.optionsVn?.[opt] || ""}
              onChange={(e) =>
                onQuestionChange(index, opt + "Vn", e.target.value)
              }
              className="w-full p-2 border rounded bg-gray-50"
              placeholder={`Dịch ${opt}`}
            />
          </div>
        ))}
      </div>

      {/* ANSWER */}
      <select
        value={question.answer}
        onChange={(e) =>
          onQuestionChange(index, "answer", e.target.value)
        }
        className="border p-2 rounded mb-3"
      >
        <option value="">Chọn đáp án</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>

      {/* EXPLANATION */}
      <textarea
        value={question.explanation}
        onChange={(e) =>
          onQuestionChange(index, "explanation", e.target.value)
        }
        className="w-full border p-3 rounded"
      />
    </div>
  );
};

export default QuestionCard;