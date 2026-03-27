// Dashboard.jsx
import { motion } from "framer-motion";
import { dashboardData } from "../mockData";

// Components
import WelcomeCard from "../pages/User/Dashboard/WelcomeCard";
import AICard from "../pages/User/Dashboard/AICard";
import StatsCard from "../pages/User/Dashboard/StatsCard";
import WeaknessCard from "../pages/User/Dashboard/WeaknessCard";
import PredictionCard from "../pages/User/Dashboard/PredictionCard";
import QuickAction from "../pages/User/Dashboard/QuickAction";
import ActivityCard from "../pages/User/Dashboard/ActivityCard";
import ProgressChart from "../pages/User/Dashboard/ProgressChart";
import CalendarCard from "../pages/User/Dashboard/CalendarCard";

function Dashboard() {
  const { user, ai, stats, activity } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <WelcomeCard user={user} ai={ai} />

        {/* CTA card */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">
              🚀 Continue Learning
            </h3>
            <p className="text-gray-500 text-sm">
              Học theo lộ trình AI đề xuất
            </p>
          </div>

          <button className="mt-4 bg-blue-600 text-white py-2 rounded-xl hover:scale-105 transition">
            Start Now
          </button>
        </div>
      </motion.div>

      {/* AI Insight */}
      <AICard ai={ai} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard title="Tổng điểm" value={stats.totalPoints} />
        <StatsCard title="Đã dùng" value={stats.used} />
        <StatsCard title="Còn lại" value={stats.remaining} />
        <StatsCard title="Streak" value={`${user.streak} ngày`} />
      </div>

      {/* Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>

        <CalendarCard />
      </div>

      {/* Prediction + WeaknessCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PredictionCard ai={ai} />
        <div className="lg:col-span-2">
          <WeaknessCard ai={ai} />
        </div>
      </div>

      {/* Quick Action */}
      <QuickAction />

      {/* Activity */}
      <ActivityCard activity={activity} />
    </div>
  );
}

export default Dashboard;
