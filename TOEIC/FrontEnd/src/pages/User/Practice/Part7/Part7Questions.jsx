const Part7Questions = ({ questions, answers, setAnswers, submitted }) => {
  // chọn đáp án
  const handleAnswer = (id, opt) => {
    // không cho đổi sau khi đã submit
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [id]: opt,
    }));
  };

  return (
    <div className="space-y-10">
      {questions.map((q) => {
        const correct = q.answer;
        const user = answers[q.id];

        return (
          <div
            key={q.id}
            id={`question-${q.questionNumber}`}
            className="border-b pb-8"
          >
            {/* câu hỏi */}

            <p className="font-semibold text-lg mb-3">
              {q.questionNumber}. {q.question}
            </p>

            {/* các lựa chọn */}

            <div className="space-y-2">
              {["A", "B", "C", "D"].map((opt) => {
                let style = "border";

                // xử lý màu khi đã submit
                if (submitted) {
                  // đáp án đúng
                  if (opt === correct) {
                    style = "border-green-500 bg-green-100";
                  }

                  // đáp án chọn sai
                  if (user === opt && user !== correct) {
                    style = "border-red-500 bg-red-100";
                  }
                }

                return (
                  <label
                    key={opt}
                    className={`flex gap-3 p-3 rounded cursor-pointer ${style}`}
                  >
                    <input
                      type="radio"
                      checked={user === opt}
                      disabled={submitted}
                      onChange={() => handleAnswer(q.id, opt)}
                    />

                    <div>
                      <b>{opt}.</b> {q["option" + opt]}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* kết quả sau khi submit */}

            {submitted && (
              <div className="mt-4 p-4 rounded bg-gray-50 border text-sm">
                {/* đáp án người dùng */}
                <div>
                  Đáp án của bạn:{" "}
                  <b
                    className={
                      user === correct ? "text-green-600" : "text-red-600"
                    }
                  >
                    {user || "Not answered"}
                  </b>
                </div>

                {/* đáp án đúng */}
                <div>
                  Đáp án đúng: <b className="text-green-600">{correct}</b>
                </div>

                {/* giải thích */}
                {q.explanation && (
                  <div className="mt-2 text-gray-700">
                    <b>Giải thích:</b> {q.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Part7Questions;
