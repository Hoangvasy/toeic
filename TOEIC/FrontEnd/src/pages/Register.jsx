import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ===================== Typing Loop ===================== */
const TypingLoop = ({ text, speed = 60, deleteSpeed = 30, delay = 1500 }) => {
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
        timeout = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(false), 300);
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

/* ===================== Animation ===================== */
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

/* ===================== Component ===================== */
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        { username, email, password },
        { withCredentials: true },
      );

      alert(res.data || "Register success");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Register failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 px-4"
    >
      {/* Outer Card */}
      <div className="w-full max-w-6xl h-[75vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 text-white">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.h1
              variants={item}
              className="text-5xl font-bold mb-6 text-blue-900 
              drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            >
              <TypingLoop text="Tham gia ngay 🚀" />
            </motion.h1>

            <motion.p
              variants={item}
              className="text-blue-900 mb-8 leading-relaxed"
            >
              <TypingLoop
                text="Tạo tài khoản để bắt đầu hành trình chinh phục TOEIC. Học thông minh, luyện tập hiệu quả và đạt điểm cao."
                speed={30}
                deleteSpeed={15}
              />
            </motion.p>

            <motion.ul variants={item} className="space-y-3 text-blue-900">
              <li>✔ Lộ trình học rõ ràng</li>
              <li>✔ Luyện đề thực tế</li>
              <li>✔ Theo dõi tiến độ</li>
            </motion.ul>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative group w-full max-w-md">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-blue-300 opacity-30"></div>

            {/* Register Card */}
            <div className="relative bg-blue-200/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-blue-300">
              <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">
                Đăng ký
              </h2>

              {/* Username */}
              <div className="relative mb-4">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="text"
                  placeholder="Tên người dùng"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="relative mb-6">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Button */}
              <button
                onClick={register}
                className="w-full py-3 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                Đăng ký
              </button>

              {/* Links */}
              <div className="flex justify-center mt-4 text-sm text-blue-800">
                <Link to="/" className="hover:text-blue-900">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
