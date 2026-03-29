function StatsCard({ title, value }) {
  return (
    <div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-5
      rounded-2xl
      shadow-sm
      transition
      hover:shadow-md
      "
    >
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>

      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
