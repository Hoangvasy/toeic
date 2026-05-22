import { Link } from "react-router-dom";

export default function PracticePartCard({
  title,
  description,
  icon,
  path,
  color,
  btnColor,
}) {
  return (
    <Link
      to={path}
      className="
      group bg-white dark:bg-gray-800
      rounded-2xl shadow-md hover:shadow-xl
      transition-all duration-300
      p-6 relative overflow-hidden
      border border-gray-200 dark:border-gray-700
      hover:-translate-y-1
      "
    >
      {/* hover background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition ${color}`}
      />

      <div className="flex flex-col items-center text-center relative z-10">
        {/* icon */}
        <div className={`text-white p-4 rounded-xl mb-4 ${color}`}>{icon}</div>

        {/* title */}
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {title}
        </h2>

        {/* description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {description}
        </p>

        {/* button */}
        <button
          className={`
          mt-4 px-5 py-2.5
          rounded-lg text-sm font-semibold text-white
          bg-gradient-to-r ${btnColor}
          shadow-md hover:shadow-lg
          transform hover:scale-105 active:scale-95
          transition-all duration-200
          `}
        >
          Bắt đầu luyện tập
        </button>
      </div>
    </Link>
  );
}
