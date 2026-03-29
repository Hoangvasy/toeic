import { BookOpen, ShieldCheck } from "lucide-react";

function Footer() {
  return (
    <footer className="h-14 bg-white border-t flex items-center justify-between px-6 text-sm text-gray-500">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-500" />
        <span>
          © 2026 <span className="font-medium text-gray-700">TOEIC AI</span> •
          Nền tảng học TOEIC thông minh
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* STATUS */}
        <span className="hidden md:flex items-center gap-1 text-green-500">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Hệ thống hoạt động
        </span>

        {/* LINKS */}
        <span className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          Privacy
        </span>

        <span className="hover:text-blue-600 cursor-pointer">Terms</span>
      </div>
    </footer>
  );
}

export default Footer;
