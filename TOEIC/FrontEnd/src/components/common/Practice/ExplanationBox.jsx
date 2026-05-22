export default function ExplanationBox({ isCorrect, answer, explanation }) {
  return (
    <div className="mt-6 p-4 rounded-lg border bg-gray-50">
      <p
        className={`font-semibold mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}
      >
        {isCorrect ? "Correct!" : `Wrong. Correct answer: ${answer}`}
      </p>

      <p className="text-gray-600">{explanation}</p>
    </div>
  );
}
