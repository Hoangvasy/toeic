import { useEffect, useState } from "react";
import axios from "axios";

export default function TodayLearning() {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    axios.get("http://localhost:8080/api/learning-path/today", {
      withCredentials: true,
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  const allQuestions = [
    ...(data?.review || []),
    ...(data?.new || [])
  ];

  const current = allQuestions[currentIndex];

  // ================= HANDLE ANSWER =================
  const handlePart5Answer = (opt) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: opt
    }));

    setCurrentIndex(prev => prev + 1);
  };

  const handleSubAnswer = (qIndex, opt) => {
    const key = `${currentIndex}-${qIndex}`;

    setAnswers(prev => ({
      ...prev,
      [key]: opt
    }));
  };

  // ================= CALC =================
  const calculateResult = () => {
    let correct = 0;

    allQuestions.forEach((q, i) => {
      if (q.type === "part5" || q.type === "review") {
        if (answers[i] === q.answer) correct++;
      } else {
        q.questions.forEach((sub, j) => {
          if (answers[`${i}-${j}`] === sub.answer) correct++;
        });
      }
    });

    return correct;
  };

  const calculateTotal = () => {
    let total = 0;

    allQuestions.forEach((q) => {
      if (q.type === "part5" || q.type === "review") total++;
      else total += q.questions.length;
    });

    return total;
  };

  // ================= SUBMIT =================
  const submit = async () => {
    try {
      setSubmitting(true);

      const correct = calculateResult();
      const total = calculateTotal();

      await axios.post(
        "http://localhost:8080/api/attempt/submit",
        {
          answers,
          questions: allQuestions,
          score: correct,
          total,
          correct
        },
        { withCredentials: true }
      );

      alert("Đã lưu kết quả!");
    } catch (e) {
      console.error(e);
      alert("Lỗi submit");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DONE =================
  if (!current) {
    return (
      <div className="p-10 text-center">
        🎉 Hoàn thành bài học!

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          {submitting ? "Đang lưu..." : "Nộp bài"}
        </button>
      </div>
    );
  }

  // ================= PART 5 =================
  if (current.type === "part5" || current.type === "review") {
    return (
      <div className="p-10 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          Question {currentIndex + 1}
        </h2>

        <p className="mb-6">{current.question}</p>

        {["A","B","C","D"].map(opt => (
          <button
            key={opt}
            className="block w-full border p-3 mb-2 rounded hover:bg-gray-100"
            onClick={() => handlePart5Answer(opt)}
          >
            {opt}. {current["option" + opt]}
          </button>
        ))}
      </div>
    );
  }

  // ================= PART 6 =================
  if (current.type === "part6") {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Part 6</h2>

        <p className="mb-6">{current.passage}</p>

        {current.questions.map((q, i) => (
          <div key={i} className="mb-4">
            <p>Blank {i + 1}</p>

            {["A","B","C","D"].map(opt => (
              <button
                key={opt}
                className={`block w-full border p-2 mb-1 ${
                  answers[`${currentIndex}-${i}`] === opt ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSubAnswer(i, opt)}
              >
                {opt}. {q["option" + opt]}
              </button>
            ))}
          </div>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentIndex(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    );
  }

  // ================= PART 7 =================
  if (current.type === "part7") {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Part 7</h2>

        <p className="mb-4 font-semibold">{current.header}</p>
        <p className="mb-6">{current.passage}</p>

        {current.questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="mb-2">{q.question}</p>

            {["A","B","C","D"].map(opt => (
              <button
                key={opt}
                className={`block w-full border p-2 mb-1 ${
                  answers[`${currentIndex}-${i}`] === opt ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSubAnswer(i, opt)}
              >
                {opt}. {q["option" + opt]}
              </button>
            ))}
          </div>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentIndex(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    );
  }

  return null;
}