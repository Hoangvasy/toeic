import { Link } from "react-router-dom";

export default function PracticeResult({ answers }) {
  const correct = answers.filter((a) => a.selected === a.correct).length;

  const total = answers.length;

  const accuracy = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Practice Result</h1>

        <p className="text-lg mb-2">
          Score: {correct} / {total}
        </p>

        <p className="text-gray-500 mb-6">Accuracy: {accuracy}%</p>

        <Link
          to="/practice/review"
          state={{ answers }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Review Answers
        </Link>
      </div>
    </div>
  );
}
