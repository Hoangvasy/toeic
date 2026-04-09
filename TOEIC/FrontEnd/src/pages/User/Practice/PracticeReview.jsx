import { useLocation, Link } from "react-router-dom";

export default function PracticeReview() {
  const location = useLocation();

  const answers =
    location.state?.answers ||
    JSON.parse(localStorage.getItem("practiceAnswers")) ||
    [];

  if (!answers.length) {
    return <div className="p-10 text-center">No answers to review</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Review Answers</h1>

      {answers.map((item, index) => (
        <div key={index} className="mb-8 p-6 border rounded-lg bg-white shadow">
          <p className="font-semibold mb-3">Question {index + 1}</p>

          <p className="mb-4">{item.question.question}</p>

          <p>Your answer: {item.selected}</p>

          <p>Correct answer: {item.correct}</p>

          <p className="text-gray-600 mt-2">{item.question.explanation}</p>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        {/* quay lại practice */}
        <Link
          to="/practice"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Back to Practice
        </Link>

        {/* sang trang phân tích */}
        <Link
          to="/practice/analysis"
          state={{ answers }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          View Skill Analysis
        </Link>
      </div>
    </div>
  );
}
