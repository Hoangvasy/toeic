import { useLocation, Link } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function SkillAnalysis() {
  const location = useLocation();
  const answers = location.state?.answers || [];

  if (!answers.length) {
    return (
      <div className="p-10 text-center">No data available for analysis</div>
    );
  }

  const topicStats = {};

  answers.forEach((a) => {
    const topic = a.question.label;

    if (!topicStats[topic]) {
      topicStats[topic] = {
        total: 0,
        correct: 0,
      };
    }

    topicStats[topic].total++;

    if (a.selected === a.correct) {
      topicStats[topic].correct++;
    }
  });

  const data = Object.keys(topicStats).map((topic) => ({
    topic: topic.replace("_", " "),
    accuracy: Math.round(
      (topicStats[topic].correct / topicStats[topic].total) * 100,
    ),
  }));

  const weakTopics = data.filter((d) => d.accuracy < 60);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Part 5 Skill Analysis</h1>

        {/* Radar Chart */}

        <div className="bg-white p-8 rounded-xl shadow mb-10">
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart data={data} outerRadius="80%">
              <defs>
                <linearGradient id="colorSkill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <PolarGrid stroke="#e5e7eb" />

              <PolarAngleAxis
                dataKey="topic"
                tick={{ fontSize: 14, fill: "#374151" }}
              />

              <PolarRadiusAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
              />

              <Tooltip formatter={(value) => `${value}%`} />

              <Legend />

              <Radar
                name="Accuracy"
                dataKey="accuracy"
                stroke="#2563eb"
                fill="url(#colorSkill)"
                fillOpacity={0.7}
                strokeWidth={3}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Table */}

        <div className="bg-white p-8 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Skill Breakdown</h2>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Topic</th>
                <th>Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.topic}</td>

                  <td>
                    <span
                      className={
                        item.accuracy >= 70
                          ? "text-green-600 font-semibold"
                          : item.accuracy >= 50
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }
                    >
                      {item.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendation */}

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">AI Recommendation</h2>

          {weakTopics.length === 0 && (
            <p className="text-green-600">
              Great job! Your skills are balanced.
            </p>
          )}

          {weakTopics.map((topic, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg mb-3"
            >
              <span>
                Practice more: <strong>{topic.topic}</strong>
              </span>

              <Link
                to={`/practice/part5/${topic.topic.replace(" ", "_")}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Practice
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <Link
            to="/practice"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Back to Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
