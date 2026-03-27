import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaHeadphones, FaBookOpen, FaChartLine } from "react-icons/fa";

const TypingLoop = ({ text, speed = 80, deleteSpeed = 40, delay = 1500 }) => {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting) {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text, speed, deleteSpeed, delay]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      alert("Đăng nhập thành công");
      navigate("/dashboard");
    } catch (err) {
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center 
    bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 px-4">

      {/* Outer Card */}
      <div className="w-full max-w-6xl h-[75vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 text-white">

          <motion.div variants={container} initial="hidden" animate="show">

            {/* Title */}
            <motion.h1
              variants={item}
              className="text-5xl font-bold mb-6 text-blue-900"
            >
              <TypingLoop text="Chào mừng 👋" />
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-blue-800 mb-8 leading-relaxed"
            >
              <TypingLoop
                text="Bắt đầu hành trình chinh phục TOEIC ngay hôm nay. Nâng cao kỹ năng và đạt được số điểm mơ ước của bạn."
                speed={30}
                deleteSpeed={15}
              />
            </motion.p>

            {/* Icon list */}
            <div className="space-y-4 mb-8">

              <motion.div
                variants={item}
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 text-blue-900 cursor-pointer"
              >
                <FaHeadphones className="text-blue-900 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
                <span>Luyện nghe mỗi ngày</span>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 text-blue-900 cursor-pointer"
              >
                <FaBookOpen className="text-blue-900 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
                <span>Nâng cao kỹ năng đọc</span>
              </motion.div>

              <motion.div
                variants={item}
                whileHover={{ x: 6 }}
                className="flex items-center gap-3 text-blue-900 cursor-pointer"
              >
                <FaChartLine className="text-blue-900 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
                <span>Theo dõi tiến độ học</span>
              </motion.div>

            </div>

            {/* Button */}
            <motion.button
              variants={item}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-44 py-3 border border-blue-900 text-blue-900 
              rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              Khám phá
            </motion.button>

          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center p-8">

          <div className="relative group w-full max-w-md">

            {/* Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-blue-300 opacity-30"></div>

            {/* Login Card */}
           <div className="relative bg-blue-200/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-blue-300">

              <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">
                Đăng nhập
              </h2>

              {/* Email */}
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="relative mb-6">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Button */}
              <button
                onClick={login}
                className="w-full py-3 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                Đăng nhập
              </button>

              {/* Links */}
              <div className="flex justify-between mt-4 text-sm text-blue-800">
                <Link to="/forgot" className="hover:text-blue-900">
                  Quên mật khẩu?
                </Link>
                <Link to="/register" className="hover:text-blue-900">
                  Đăng ký
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;