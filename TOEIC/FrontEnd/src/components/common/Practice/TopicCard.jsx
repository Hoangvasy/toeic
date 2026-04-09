import { Link } from "react-router-dom";

export default function TopicCard({ title, description, path, color }) {
  return (
    <Link
      to={path}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition ${color}`}
      />

      <div className="relative z-10">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>

        <p className="text-gray-500 text-sm">{description}</p>

        <button className="mt-3 text-sm text-blue-600">Practice →</button>
      </div>
    </Link>
  );
}
