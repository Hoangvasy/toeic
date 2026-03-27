function ActivityCard({ activity }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-3">📜 Hoạt động</h3>

      <ul className="space-y-2 text-sm text-gray-600">
        {activity.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityCard;