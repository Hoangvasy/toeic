import React from "react";

export default function Part5({
  question,
  answer,
  onSelect,
  submitted,
  showFlag,
  flag,
  onToggleFlag,
}) {
  const options = [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-1">
            
            {/* QUESTION NUMBER (FIXED) */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${
                answer
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {question.questionNumber}
            </div>

            <div className="flex-1">
              <p className="text-gray-800 leading-relaxed">
                {question.question}
              </p>
            </div>
          </div>

          {/* FLAG */}
          {showFlag && (
            <button
              onClick={(e) => onToggleFlag(question.id, e)}
              className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
            >
              {flag ? (
                <span className="text-red-500 text-lg">🚩</span>
              ) : (
                <span className="text-gray-400 text-lg">🏁</span>
              )}
            </button>
          )}
        </div>

        {/* OPTIONS */}
        <div className="ml-11 space-y-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onSelect(question.id, opt.key)}
              disabled={submitted}
              className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-200
                ${
                  answer === opt.key
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }
                ${submitted ? "cursor-not-allowed opacity-75" : ""}
              `}
            >
              <span className="font-semibold mr-3">{opt.key}.</span>
              <span className="text-gray-700">{opt.text}</span>

              {answer === opt.key && (
                <span className="float-right text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}