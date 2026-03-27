import { useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Thắng Hoàng",
    email: "thang@example.com",
    targetScore: 750,
    currentScore: 480,
    studyTime: "2 hours/day",
    avatar: null,
  });

  const progress = Math.round((user.currentScore / user.targetScore) * 100);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, avatar: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-6"
      >
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white text-blue-600">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={20} />
          </div>

          <input
            type="file"
            onChange={handleAvatar}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-blue-100">{user.email}</p>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress TOEIC</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          {/* PROFILE INFO */}
          <motion.div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold text-blue-900 mb-4">
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="p-3 border rounded-lg col-span-2"
              />

              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="p-3 border rounded-lg col-span-2"
              />

              <input
                value={user.targetScore}
                onChange={(e) =>
                  setUser({ ...user, targetScore: e.target.value })
                }
                className="p-3 border rounded-lg"
                placeholder="Target"
              />

              <input
                value={user.studyTime}
                onChange={(e) =>
                  setUser({ ...user, studyTime: e.target.value })
                }
                className="p-3 border rounded-lg"
                placeholder="Study time"
              />
            </div>

            <button className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Lưu thay đổi
            </button>
          </motion.div>

          {/* PROGRESS DETAIL */}
          <motion.div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-blue-900 mb-4">
              📊 Tiến độ kỹ năng
            </h3>

            {[
              { name: "Listening", value: 320 },
              { name: "Reading", value: 160 },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.value / user.targetScore) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* CALENDAR */}
          <motion.div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-blue-900 mb-4">📅 Lịch học</h3>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm ${i % 2 === 0 ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  >
                    {day}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* TARGET */}
          <motion.div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow">
            <h4>🎯 Target</h4>
            <p className="text-4xl font-bold">{user.targetScore}</p>
          </motion.div>

          {/* STUDY TIME */}
          <motion.div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-blue-900">⏱ Study Time</h4>
            <p className="text-gray-600 mt-2">{user.studyTime}</p>
          </motion.div>

          {/* AI ANALYSIS */}
          <motion.div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-blue-900 font-semibold">🤖 AI phân tích</h4>

            <ul className="mt-3 text-sm space-y-2">
              <li className="text-red-500">🔴 Yếu: Grammar (Tenses)</li>
              <li className="text-yellow-500">🟡 Trung bình: Reading speed</li>
              <li className="text-green-500">🟢 Tốt: Listening</li>
            </ul>

            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              🤖 Generate Study Plan
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
