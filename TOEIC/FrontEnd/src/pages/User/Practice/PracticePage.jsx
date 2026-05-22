import PracticePartCard from "../../../components/common/Practice/PracticePartCard";
import { BookOpen, FileText, ClipboardList, Target, Flame } from "lucide-react";

export default function PracticeHome() {
  return (
    <div
      className="
        min-h-screen p-10
        transition-colors duration-300
        bg-gradient-to-br from-gray-50 to-gray-100
        dark:from-gray-900 dark:to-gray-800
        rounded-3xl
        mx-4 mt-4
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* phần giới thiệu */}

        <div className="text-center mb-16">
          {/* badge */}

          <div
            className="
              inline-block mb-4 px-4 py-1 rounded-full
              bg-blue-100 text-blue-600
              dark:bg-blue-900/40 dark:text-blue-300
              text-sm font-medium
            "
          >
            TOEIC Practice
          </div>

          {/* tiêu đề */}

          <h1
            className="
              text-4xl md:text-5xl font-bold mb-4
              leading-[1.3]
              bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
              bg-clip-text text-transparent
            "
          >
            Luyện tập TOEIC
          </h1>

          {/* mô tả */}

          <p
            className="
              text-gray-600 dark:text-gray-400
              max-w-xl mx-auto
              text-lg leading-relaxed
            "
          >
            Luyện tập theo từng phần của bài thi TOEIC để cải thiện
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {" "}
              ngữ pháp, từ vựng{" "}
            </span>
            và kỹ năng
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {" "}
              đọc hiểu
            </span>
            .
          </p>
        </div>

        {/* danh sách các part */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PracticePartCard
            title="Part 5"
            description="Hoàn thành câu - Ngữ pháp và từ vựng"
            icon={<ClipboardList size={34} />}
            path="/practice/part5"
            color="bg-blue-500"
            btnColor="from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          />

          <PracticePartCard
            title="Part 6"
            description="Hoàn thành đoạn văn"
            icon={<FileText size={34} />}
            path="/practice/part6"
            color="bg-green-500"
            btnColor="from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          />

          <PracticePartCard
            title="Part 7"
            description="Đọc hiểu đoạn văn và trả lời câu hỏi"
            icon={<BookOpen size={34} />}
            path="/practice/part7"
            color="bg-purple-500"
            btnColor="from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          />
        </div>

        {/* gợi ý */}

        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          💡 Luyện tập mỗi ngày để cải thiện điểm TOEIC nhanh hơn.
        </div>
      </div>
    </div>
  );
}
