// QuestionCard.jsx
import React from "react";

const QuestionCard = ({ question, index, onQuestionChange, onDelete, onAnalyze, loading }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Question {question.number}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {question.label || "No label"}
          </span>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:bg-gray-400"
          >
            {loading ? "Đang xử lý..." : "🤖 AI"}
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      </div>

      <textarea
        value={question.question}
        onChange={(e) => onQuestionChange(index, "question", e.target.value)}
        className="w-full border p-3 rounded mb-3 resize-y"
        placeholder="Nhập câu hỏi..."
      />

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        {["A", "B", "C", "D"].map((opt) => (
          <input
            key={opt}
            value={question.options[opt]}
            onChange={(e) => onQuestionChange(index, opt, e.target.value)}
            placeholder={`Option ${opt}`}
            className={`p-3 rounded border ${
              question.answer === opt ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      <select
        value={question.answer}
        onChange={(e) => onQuestionChange(index, "answer", e.target.value)}
        className="border p-2 rounded mb-3"
      >
        <option value="">Chọn đáp án</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>

      <textarea
        value={question.explanation}
        onChange={(e) => onQuestionChange(index, "explanation", e.target.value)}
        placeholder="Giải thích chi tiết..."
        className="w-full border p-3 rounded resize-y"
      />
    </div>
  );
};

export default QuestionCard;