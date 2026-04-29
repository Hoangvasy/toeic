import ExplanationBox from "../../../../components/common/Practice/ExplanationBox";

export default function QuestionGroup({
  questions = [],
  answers = {},
  handleSelect,
  submitted = false,
  questionRefs,
}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {questions.map((q) => {
        const selected = answers[q.id];
        const isCorrect = selected === q.answer;

        return (
          <div
            key={q.id}
            ref={(el) => {
              if (questionRefs) questionRefs.current[q.id] = el;
            }}
            className="bg-white p-6 border rounded-lg shadow-sm"
          >
            {/* QUESTION NUMBER */}
            <p className="font-bold mb-4">{q.questionNumber}.</p>

            {/* OPTIONS */}
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((opt) => {
                const text = q[`option${opt}`];
                if (!text) return null;

                let style = "hover:bg-gray-100";

                if (submitted) {
                  if (opt === q.answer) {
                    style = "bg-green-200";
                  } else if (selected === opt) {
                    style = "bg-red-200";
                  }
                } else if (selected === opt) {
                  style = "bg-blue-100 border border-blue-400";
                }

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${style}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={selected === opt}
                      onChange={() => handleSelect(q.id, opt)}
                    />

                    <span>
                      {opt}. {text}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* EXPLANATION */}
            {submitted && (
              <ExplanationBox
                isCorrect={isCorrect}
                answer={q.answer}
                explanation={q.explanation}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
