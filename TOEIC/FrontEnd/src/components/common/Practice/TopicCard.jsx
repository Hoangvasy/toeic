import { Link } from "react-router-dom";

export default function TopicCard({ title, description, path, color }) {
  return (
    <Link
      to={path}
      className="
      group relative overflow-hidden
      p-6 rounded-2xl
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      shadow-sm hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-1
      block
      "
    >
      {/* Hover background */}
      <div
        className={`
        absolute inset-0 opacity-0
        group-hover:opacity-10
        transition duration-300
        ${color}
        `}
      />

      <div className="relative z-10">
        {/* Title */}
        <h3
          className="
        font-semibold text-lg mb-2
        text-gray-800 dark:text-gray-200
        "
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="
        text-sm mb-4
        text-gray-500 dark:text-gray-400
        "
        >
          {description}
        </p>

        {/* Practice link */}
        <span
          className="
          inline-flex items-center gap-1
          text-sm font-medium
          text-blue-600 dark:text-blue-400
          group-hover:gap-2
          transition-all duration-200
          "
        >
          Luyện tập →
        </span>
      </div>
    </Link>
  );
}
