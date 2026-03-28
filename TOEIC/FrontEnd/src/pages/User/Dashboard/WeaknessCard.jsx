function WeaknessCard({ ai }) {
  return (
    <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-3">⚠️ Weakness</h3>

      <div className="space-y-2">
        {ai.weakTopics.map((item, i) => (
          <div key={i}>
            <p className="text-sm">{item.name}</p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-red-500 h-2 rounded"
                style={{ width: `${item.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeaknessCard;