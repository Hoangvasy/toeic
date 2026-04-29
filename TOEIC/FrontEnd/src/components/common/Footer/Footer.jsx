import { BookOpen, ShieldCheck } from "lucide-react";

function Footer() {
  return (
    <footer
      className="
      border-t
      border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-900
      text-sm
      text-gray-500 dark:text-gray-400
      "
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />

          <span>
            © 2026{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              TOEIC AI
            </span>
            <span className="hidden sm:inline">
              {" "}
              • Nền tảng học TOEIC thông minh
            </span>
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* STATUS */}
          <span
            className="
            hidden md:flex items-center gap-2
            text-green-500
            "
          >
            <span
              className="
            w-2 h-2
            bg-green-500
            rounded-full
            animate-pulse
            "
            ></span>
            Hệ thống hoạt động
          </span>

          {/* LINKS */}
          <span
            className="
            flex items-center gap-1
            cursor-pointer
            hover:text-blue-600 dark:hover:text-blue-400
            transition
            "
          >
            <ShieldCheck className="w-4 h-4" />
            Chính sách
          </span>

          <span
            className="
            cursor-pointer
            hover:text-blue-600 dark:hover:text-blue-400
            transition
            "
          >
            Điều khoản
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
