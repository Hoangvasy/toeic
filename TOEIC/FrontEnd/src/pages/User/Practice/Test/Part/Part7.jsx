import React from "react";

export default function Part7({
  group,
  groupIndex,
  answers,
  onSelect,
  submitted,
  showFlag,
  flags,
  onToggleFlag,
}) {
  const options = ["A", "B", "C", "D"];

  if (!group) return null;

  const questions = group.questions || [];

  const getAnswer = (qid) =>
    answers?.[qid] || null;

  return (
    <div className="bg-white rounded-lg border shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between p-3 bg-gray-50 border-b">
        <span className="font-semibold text-purple-600">
          PART 7 - Reading
        </span>

        {showFlag && (
          <button onClick={(e) => onToggleFlag(groupIndex, e)}>
            {flags[groupIndex] ? "🚩" : "🏁"}
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="lg:flex gap-6">

          {/* PASSAGE */}
          <div className="lg:w-1/2 bg-gray-50 p-4 rounded text-sm whitespace-pre-line">
            {group.passage || "No passage"}
          </div>

          {/* QUESTIONS */}
          <div className="lg:w-1/2 space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="border p-3 rounded">

                <div className="font-medium mb-2">
                  {q.questionNumber}. {q.question}
                </div>

                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onSelect(q.id, opt, i)}   // 🔥 FIX QUAN TRỌNG
                    disabled={submitted}
                    className={`block w-full text-left p-2 border rounded mb-1 transition ${
                      getAnswer(q.id) === opt
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {opt}. {q[`option${opt}`]}
                  </button>
                ))}

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}