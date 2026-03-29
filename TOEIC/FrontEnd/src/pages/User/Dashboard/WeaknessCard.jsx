function WeaknessCard({ ai }) {
  return (
    <div
      className="
      col-span-2
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-6
      rounded-2xl
      shadow-sm
      space-y-4
      "
    >
      <h3 className="font-semibold text-gray-900 dark:text-gray-200">
        ⚠ Weakness
      </h3>

      <div className="space-y-3">
        {ai.weakTopics.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name}
              </span>

              <span className="text-red-500 font-medium">{item.accuracy}%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mt-1">
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
