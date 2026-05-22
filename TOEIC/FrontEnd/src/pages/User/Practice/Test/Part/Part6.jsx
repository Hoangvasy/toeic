import React from "react";

export default function Part6({
  group,
  groupIndex,
  answers,
  onSelect,
  submitted,
  showFlag,
  flags,
  onToggleFlag
}) {
  const options = ["A", "B", "C", "D"];

  // ================= ANSWER KEY =================
  const getAnswer = (qIdx) => {
    return answers[`${group.id}-${qIdx}`];
  };

  // ================= COMPLETED CHECK =================
  const isGroupCompleted = () => {
    return group.questions.every((_, idx) => getAnswer(idx) !== undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
            PART 6 - Text Completion
          </span>

          {isGroupCompleted() && (
            <span className="text-xs text-green-600">✓ Hoàn thành</span>
          )}
        </div>

        {showFlag && (
          <button
            onClick={(e) => onToggleFlag(groupIndex, e)}
            className="w-8 h-8 rounded-lg hover:bg-gray-200"
          >
            {flags[groupIndex] ? (
              <span className="text-red-500">🚩</span>
            ) : (
              <span className="text-gray-400">🏁</span>
            )}
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* PASSAGE */}
          <div className="lg:w-1/2">
            <div className="bg-gray-50 rounded-lg p-5 border">
              <div className="whitespace-pre-line text-gray-700 text-sm">
                {group.passage || "No passage data"}
              </div>
            </div>
          </div>

          {/* QUESTIONS */}
          <div className="lg:w-1/2 space-y-4">

            {group.questions.map((q, qIdx) => (
              <div key={q.id} className="border rounded-lg p-4">

                {/* QUESTION */}
                <div className="font-medium text-gray-800 mb-3 text-sm">
                  {q.questionNumber || qIdx + 1}. {q.question || ""}
                </div>

                {/* OPTIONS */}
                <div className="space-y-2">
                  {options.map((opt) => {
                    const isSelected = getAnswer(qIdx) === opt;

                    return (
                      <button
                        key={opt}
                        onClick={() => onSelect(group.id, opt, qIdx)}
                        disabled={submitted}
                        className={`
                          w-full text-left p-2 rounded border text-sm transition
                          ${isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"}
                        `}
                      >
                        <span className="font-semibold mr-2">{opt}.</span>
                        <span className="text-gray-600">
                          {q[`option${opt}`]}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}