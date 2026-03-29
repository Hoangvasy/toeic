import { Clock } from "lucide-react";

function ActivityCard({ activity }) {
  return (
    <div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-2xl
      p-6
      shadow-sm
      transition
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">
          Hoạt động gần đây
        </h3>
      </div>

      {/* ACTIVITY LIST */}
      {activity?.length ? (
        <ul className="space-y-4 text-sm max-h-56 overflow-y-auto pr-2">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start gap-3 group">
              {/* Timeline dot */}
              <div className="mt-1 w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition" />

              {/* Activity text */}
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {a}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        /* EMPTY STATE */
        <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
          Chưa có hoạt động nào
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
