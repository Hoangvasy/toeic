function QuickAction() {
  const actions = [
    "🔥 Ôn lại từ sai",
    "✍ Luyện Part 5",
    "🎧 Nghe Part 2",
    "🗣 Shadowing",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="mb-4 font-semibold">⚡ Luyện nhanh</h3>

      <div className="grid grid-cols-4 gap-4">
        {actions.map((a, i) => (
          <button
            key={i}
            className="bg-gray-100 hover:bg-blue-100 py-3 rounded-xl"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickAction;