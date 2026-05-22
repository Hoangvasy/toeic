import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import axios from "axios";

import { motion } from "framer-motion";

import { FaLock, FaShieldAlt } from "react-icons/fa";

import {
  GraduationCap,
  KeyRound,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const reset = async () => {
    if (!password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ");

      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");

      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/api/auth/reset-password", {
        token,
        newPassword: password,
      });

      alert("Đổi mật khẩu thành công");

      navigate("/");
    } catch (err) {
      alert("Link không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Bảo mật an toàn",
      desc: "Mật khẩu được mã hóa bảo mật",
    },

    {
      icon: LockKeyhole,
      title: "Đổi mật khẩu nhanh",
      desc: "Hoàn tất chỉ trong vài giây",
    },

    {
      icon: KeyRound,
      title: "Khôi phục tài khoản",
      desc: "Tiếp tục học TOEIC dễ dàng",
    },
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden flex items-center justify-center px-3 sm:px-4 md:px-6 py-3 md:py-6 bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">
      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full bg-cyan-300/40 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-80px] w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full bg-blue-300/40 blur-3xl" />
      </div>

      {/* MAIN CARD */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl rounded-[28px] md:rounded-[32px] overflow-hidden border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.10)] grid grid-cols-1 xl:grid-cols-2"
      >
        {/* LEFT SIDE */}

        <div className="hidden xl:flex flex-col justify-between p-10 bg-gradient-to-br from-cyan-100 via-blue-100 to-white/30 border-r border-white/40">
          <div>
            {/* LOGO */}

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/70 border border-white/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-500">TOEIC Learning</p>

                <h2 className="font-bold text-base text-slate-800">
                  Practice Platform
                </h2>
              </div>
            </div>

            {/* HERO */}

            <div className="mt-10">
              <h1 className="text-4xl leading-tight font-bold text-slate-800">
                Tạo mật khẩu mới
                <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  bảo mật hơn
                </span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Đặt lại mật khẩu để tiếp tục hành trình luyện tập TOEIC và bảo
                vệ tài khoản của bạn.
              </p>
            </div>
          </div>

          {/* FEATURES */}

          <div className="grid gap-3 mt-8">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-white/40"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-100 text-cyan-600">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center p-5 sm:p-6 md:p-8 lg:p-10">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
            }}
            className="w-full max-w-md mx-auto"
          >
            {/* MOBILE LOGO */}

            <div className="xl:hidden flex justify-center mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 border border-white/50 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">TOEIC Learning</p>

                  <h2 className="font-bold text-sm text-slate-800">
                    Practice Platform
                  </h2>
                </div>
              </div>
            </div>

            {/* HEADER */}

            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                <FaShieldAlt size={26} className="text-white" />
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-slate-800">
                Đặt lại mật khẩu
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Tạo mật khẩu mới để tiếp tục sử dụng tài khoản
              </p>
            </div>

            {/* FORM */}

            <div className="space-y-4">
              {/* PASSWORD */}

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" />

                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" />

                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* BUTTON */}

              <button
                onClick={reset}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang xử lý...
                  </div>
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>

              {/* BACK */}

              <div className="text-center text-sm text-slate-500">
                Quay lại trang đăng nhập?
                <Link
                  to="/"
                  className="ml-2 font-semibold text-cyan-600 hover:text-cyan-500 transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
