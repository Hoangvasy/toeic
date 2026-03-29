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
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-6
      rounded-2xl
      shadow-sm
      space-y-5
      transition
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">
          📊 Learning Progress
        </h3>

        <span className="text-green-500 text-sm font-medium">+15 mỗi ngày</span>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded-lg text-sm transition
            ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
            />

            <XAxis dataKey="day" stroke="#9ca3af" className="text-xs" />

            <Tooltip
              content={({ payload }) =>
                payload?.length ? (
                  <div className="bg-white dark:bg-gray-800 p-2 shadow rounded text-sm border dark:border-gray-700">
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

            {/* GOAL LINE */}
            {goal && (
              <ReferenceLine
                y={goal}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: "Goal 750",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* STATS */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>🎯 Goal: {goal ? goal : "-"}</span>
        <span>📈 Current: {data[data.length - 1].value}</span>
      </div>

      {/* AI INSIGHT */}
      <div
        className="
        bg-blue-50 dark:bg-blue-900/30
        text-blue-700 dark:text-blue-300
        p-3
        rounded-xl
        text-sm
        "
      >
        🤖 Bạn đang cải thiện ổn định. Nếu duy trì tốc độ này, bạn sẽ đạt mục
        tiêu trong <b>4 ngày</b>.
      </div>
    </motion.div>
  );
}

export default ProgressChart;
