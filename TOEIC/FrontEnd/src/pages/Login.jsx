import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaHeadphones,
  FaBookOpen,
  FaChartLine,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      // sau khi login thành công -> kiểm tra role
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });

      const role = res.data.role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Email hoặc mật khẩu sai");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
    bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 px-4"
    >
      <div className="w-full max-w-6xl h-[75vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 text-white">
          <motion.h1 className="text-5xl font-bold mb-6 text-blue-900">
            Chào mừng 👋
          </motion.h1>

          <p className="text-blue-800 mb-8 leading-relaxed">
            Bắt đầu hành trình chinh phục TOEIC ngay hôm nay.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-900">
              <FaHeadphones /> Luyện nghe mỗi ngày
            </div>

            <div className="flex items-center gap-3 text-blue-900">
              <FaBookOpen /> Nâng cao kỹ năng đọc
            </div>

            <div className="flex items-center gap-3 text-blue-900">
              <FaChartLine /> Theo dõi tiến độ học
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative group w-full max-w-md">
            <div className="absolute -inset-1 rounded-2xl bg-blue-300 opacity-30"></div>

            <div className="relative bg-blue-200/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-blue-300">
              <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">
                Đăng nhập
              </h2>

              {/* EMAIL */}
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />

                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 rounded-lg border border-blue-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div className="relative mb-6">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />

                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 rounded-lg border border-blue-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* LOGIN BUTTON */}
              <button
                onClick={login}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Đăng nhập
              </button>

              {/* LINKS */}
              <div className="flex justify-between mt-4 text-sm text-blue-800">
                <Link to="/forgot">Quên mật khẩu?</Link>

                <Link to="/register">Đăng ký</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
