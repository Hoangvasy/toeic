import { useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const send = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
      });

      alert("Reset link sent to your email");
    } catch (err) {
      alert("Failed to send reset link");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 px-4"
    >
      {/* Outer Card */}
      <div className="w-full max-w-5xl h-[65vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Side*/}
        <div className="hidden md:flex flex-col justify-center flex-1 p-12 text-white">
          <h1 className="text-4xl font-bold mb-6 text-blue-900">
            Quên mật khẩu? 🔐
          </h1>

          <p className="text-blue-900 leading-relaxed">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu. Chúng tôi sẽ
            giúp bạn truy cập lại tài khoản nhanh chóng.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative group w-full max-w-md">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-blue-300 opacity-30"></div>

            {/* Card */}
            <div className="relative bg-blue-200/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-blue-300">
              <h2 className="text-2xl font-semibold text-blue-900 text-center mb-4">
                Đặt lại mật khẩu
              </h2>

              <p className="text-sm text-blue-800 text-center mb-6">
                Nhập email để nhận link đặt lại mật khẩu
              </p>

              {/* Email */}
              <div className="relative mb-6">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 
                  rounded-lg border border-blue-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  placeholder:text-gray-400 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Button */}
              <button
                onClick={send}
                className="w-full py-3 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                Gửi link reset
              </button>

              {/* Link */}
              <div className="flex justify-center mt-4 text-sm text-blue-800">
                <Link to="/" className="hover:text-blue-900">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
