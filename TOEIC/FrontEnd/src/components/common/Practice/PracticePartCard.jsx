import { Link } from "react-router-dom";

export default function PracticePartCard({
  title,
  description,
  icon,
  path,
  color,
}) {
  return (
    <Link
      to={path}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition ${color}`}
      />

      <div className="flex flex-col items-center text-center relative z-10">
        <div className={`text-white p-4 rounded-xl mb-4 ${color}`}>{icon}</div>

        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        <p className="text-gray-500 text-sm">{description}</p>

        <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
          Start Practice
        </button>
      </div>
    </Link>
  );
}
