import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Camera, Flame, Target, Clock3, TrendingUp } from "lucide-react";

export default function Profile() {
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: "",
    currentScore: 480,
    targetScore: 750,
    studyTime: "",
    streak: 14,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });

        setUserId(res.data.userId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user/${userId}`, {
        withCredentials: true,
      });

      setUser((prev) => ({
        ...prev,
        ...res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:8080/api/user/${userId}`,
        {
          username: user.username,
          email: user.email,
          targetScore: user.targetScore,
          studyTime: user.studyTime,
        },
        {
          withCredentials: true,
        },
      );

      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);

      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/upload-avatar/${userId}`,
        formData,
        {
          withCredentials: true,
        },
      );

      setUser((prev) => ({
        ...prev,
        avatar: res.data.avatar,
      }));

      alert("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error(err);

      alert("Upload ảnh thất bại!");
    }
  };

  // ================= PROGRESS =================

  const progress = Math.round((user.currentScore / user.targetScore) * 100);

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-gray-50
      to-blue-50
      dark:from-gray-950
      dark:to-gray-900
      p-6
      "
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ================= HERO ================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          rounded-3xl
          p-8
          shadow-2xl
          "
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* AVATAR */}

            <div className="relative group">
              <div
                className="
                w-28 h-28
                rounded-full
                overflow-hidden
                border-4 border-white/30
                shadow-xl
                "
              >
                {user.avatar ? (
                  <img
                    src={`http://localhost:8080${user.avatar}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="
                    w-full h-full
                    flex items-center justify-center
                    text-4xl font-bold
                    bg-white text-blue-600
                    "
                  >
                    {user.username?.charAt(0)}
                  </div>
                )}
              </div>

              {/* OVERLAY */}

              <div
                className="
                absolute inset-0
                rounded-full
                bg-black/40
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition
                "
              >
                <Camera size={22} />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* INFO */}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold">{user.username}</h1>

              <p className="text-blue-100 mt-1">{user.email}</p>

              {/* STATS */}

              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <div
                  className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  bg-white/10
                  backdrop-blur-md
                  "
                >
                  <Flame size={18} className="text-orange-300" />

                  <span>{user.streakDays || 0} ngày liên tiếp</span>
                </div>

                <div
                  className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  bg-white/10
                  backdrop-blur-md
                  "
                >
                  <Target size={18} className="text-pink-300" />

                  <span>Mục tiêu {user.targetScore}</span>
                </div>

                <div
                  className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  bg-white/10
                  backdrop-blur-md
                  "
                >
                  <Clock3 size={18} className="text-cyan-300" />

                  <span>{user.studyTime}</span>
                </div>
              </div>
            </div>

            {/* SCORE */}

            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="10"
                    fill="none"
                  />

                  <motion.circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="377"
                    initial={{ strokeDashoffset: 377 }}
                    animate={{
                      strokeDashoffset: 377 - (377 * progress) / 100,
                    }}
                    transition={{ duration: 1 }}
                  />
                </svg>

                <div
                  className="
                  absolute inset-0
                  flex flex-col
                  items-center justify-center
                  "
                >
                  <span className="text-3xl font-bold">{progress}%</span>

                  <span className="text-sm text-blue-100">Tiến độ TOEIC</span>
                </div>
              </div>

              <p className="mt-4 text-lg font-semibold">
                {user.currentScore} / {user.targetScore}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= MAIN ================= */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE INFO */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
              bg-white/80
              dark:bg-gray-900/80
              backdrop-blur-xl
              border border-white/20
              rounded-3xl
              p-6
              shadow-lg
              "
            >
              <h2
                className="
                text-xl font-bold mb-6
                dark:text-white
                "
              >
                Thông tin cá nhân
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {/* USERNAME */}

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </label>

                  <input
                    value={user.username || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        username: e.target.value,
                      })
                    }
                    className="
                    mt-2 w-full p-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:text-white
                    "
                  />
                </div>

                {/* EMAIL */}

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </label>

                  <input
                    value={user.email || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        email: e.target.value,
                      })
                    }
                    className="
                    mt-2 w-full p-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:text-white
                    "
                  />
                </div>

                {/* TARGET */}

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Điểm mục tiêu
                  </label>

                  <input
                    type="number"
                    value={user.targetScore || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        targetScore: e.target.value,
                      })
                    }
                    className="
                    mt-2 w-full p-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:text-white
                    "
                  />
                </div>

                {/* STUDY TIME */}

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian học
                  </label>

                  <input
                    value={user.studyTime || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        studyTime: e.target.value,
                      })
                    }
                    className="
                    mt-2 w-full p-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:text-white
                    "
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}

              <div className="flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="
                  mt-6
                  px-6 py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  text-white
                  font-semibold
                  hover:scale-[1.02]
                  active:scale-95
                  transition
                  disabled:opacity-50
                  "
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* PROGRESS */}

            <div
              className="
              bg-white/80
              dark:bg-gray-900/80
              backdrop-blur-xl
              border border-white/20
              rounded-3xl
              p-6
              shadow-lg
              "
            >
              <h3
                className="
                text-lg font-bold mb-5
                dark:text-white
                "
              >
                Tổng quan tiến độ
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Listening
                    </span>

                    <span className="font-semibold dark:text-white">320</span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Reading
                    </span>

                    <span className="font-semibold dark:text-white">160</span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI INSIGHT */}

            <div
              className="
              bg-gradient-to-br
              from-indigo-600
              to-violet-700
              text-white
              rounded-3xl
              p-6
              shadow-2xl
              "
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} />

                <h3 className="font-bold text-lg">Phân tích AI</h3>
              </div>

              <p className="text-indigo-100 leading-relaxed">
                Kỹ năng Listening của bạn đang cải thiện tốt. Hãy tập trung thêm
                vào Grammar và tốc độ đọc để đạt mục tiêu nhanh hơn.
              </p>

              <button
                className="
                mt-5
                w-full
                bg-white
                text-indigo-700
                py-3
                rounded-2xl
                font-semibold
                hover:bg-gray-100
                transition
                "
              >
                Tạo lộ trình học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
