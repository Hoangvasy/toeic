function AICard({ ai }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold">🤖 AI Insight</h3>

      <ul className="mt-2 text-sm space-y-1">
        {ai.weakTopics.map((t, i) => (
          <li key={i}>
            ⚠ {t.name}: {t.accuracy}%
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm">
        👉 Focus luyện Part 5 trong 5 ngày tới
      </p>
    </div>
  );
}

export default AICard;