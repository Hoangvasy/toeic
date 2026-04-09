export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="bg-blue-500 h-2 rounded transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
