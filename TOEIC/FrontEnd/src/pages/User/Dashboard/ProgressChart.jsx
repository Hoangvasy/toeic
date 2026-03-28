import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

// ================= MOCK DATA =================
const scoreData = [
  { day: "Mon", value: 600 },
  { day: "Tue", value: 620 },
  { day: "Wed", value: 640 },
  { day: "Thu", value: 660 },
  { day: "Fri", value: 680 },
  { day: "Sat", value: 700 },
  { day: "Sun", value: 710 },
];

const accuracyData = [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 72 },
  { day: "Fri", value: 75 },
  { day: "Sat", value: 78 },
  { day: "Sun", value: 80 },
];

const timeData = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 25 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 35 },
  { day: "Fri", value: 40 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 50 },
];

// ================= CONFIG =================
const tabs = [
  { key: "score", label: "Score", data: scoreData },
  { key: "accuracy", label: "Accuracy", data: accuracyData },
  { key: "time", label: "Time", data: timeData },
];

// ================= COMPONENT =================
function ProgressChart() {
  const [activeTab, setActiveTab] = useState("score");

  const currentTab = tabs.find((t) => t.key === activeTab);
  const data = currentTab.data;

  const goal = activeTab === "score" ? 750 : null;

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-blue-900">
          📊 Learning Progress
        </h3>

        <span className="text-green-500 text-sm font-medium">
          +15 mỗi ngày
        </span>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded-lg text-sm transition
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= CHART ================= */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <Tooltip
              content={({ payload }) =>
                payload?.length ? (
                  <div className="bg-white p-2 shadow rounded text-sm">
                    {payload[0].value}{" "}
                    {activeTab === "score"
                      ? "điểm"
                      : activeTab === "accuracy"
                      ? "%"
                      : "phút"}
                  </div>
                ) : null
              }
            />

            {/* Goal line (chỉ cho score) */}
            {goal && (
              <ReferenceLine
                y={goal}
                stroke="red"
                strokeDasharray="3 3"
                label="Goal 750"
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#colorLine)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= STATS ================= */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          🎯 Goal: {goal ? goal : "-"}
        </span>
        <span>
          📈 Current: {data[data.length - 1].value}
        </span>
      </div>

      {/* ================= AI INSIGHT ================= */}
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
        🤖 Bạn đang cải thiện ổn định. Nếu duy trì tốc độ này,
        bạn sẽ đạt mục tiêu trong 4 ngày tới.
      </div>
    </motion.div>
  );
}

export default ProgressChart;