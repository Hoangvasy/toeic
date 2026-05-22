import TopicCard from "../../../../components/common/Practice/TopicCard";
import { BookOpen, Sparkles } from "lucide-react";

export default function Part5Topics() {
  // danh sách chủ đề ngữ pháp
  const grammarTopics = [
    {
      title: "Dạng từ",
      description: "Tính từ, trạng từ và danh từ",
      path: "/practice/part5/word_form",
      color: "bg-blue-500",
    },
    {
      title: "Thì & Bị động",
      description: "Các thì và câu bị động",
      path: "/practice/part5/tense_voice",
      color: "bg-blue-500",
    },
    {
      title: "Giới từ",
      description: "Các giới từ thường gặp",
      path: "/practice/part5/preposition",
      color: "bg-blue-500",
    },
    {
      title: "Liên từ",
      description: "Từ nối trong câu",
      path: "/practice/part5/conjunction",
      color: "bg-blue-500",
    },
    {
      title: "Đại từ",
      description: "Đại từ chủ ngữ, tân ngữ, sở hữu",
      path: "/practice/part5/pronoun",
      color: "bg-blue-500",
    },
  ];

  // danh sách chủ đề từ vựng
  const vocabTopics = [
    {
      title: "Nghĩa từ vựng",
      description: "Xác định nghĩa từ trong ngữ cảnh",
      path: "/practice/part5/vocabulary_meaning",
      color: "bg-purple-500",
    },
    {
      title: "Collocation",
      description: "Các cụm từ thường đi cùng nhau",
      path: "/practice/part5/vocabulary_collocation",
      color: "bg-purple-500",
    },
    {
      title: "Từ dễ nhầm",
      description: "Các từ thường bị nhầm",
      path: "/practice/part5/confusing_words",
      color: "bg-purple-500",
    },
  ];

  return (
    <div
      className="
      min-h-screen p-10
      bg-gradient-to-br from-gray-50 to-gray-100
      dark:from-gray-900 dark:to-gray-800
      transition-colors duration-300
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* phần tiêu đề chính */}

        <div className="text-center mb-14">
          {/* badge */}
          <div
            className="
            inline-flex items-center gap-2
            px-4 py-1 rounded-full
            bg-blue-100 text-blue-600
            dark:bg-blue-900/40 dark:text-blue-300
            text-sm font-medium mb-3
            "
          >
            <Sparkles size={16} />
            Part 5 Practice
          </div>

          {/* tiêu đề */}
          <h1
            className="
            text-4xl md:text-5xl font-bold mb-4
            bg-gradient-to-r from-blue-500 to-purple-500
            bg-clip-text text-transparent
            leading-[1.3]
            "
          >
            Luyện tập Part 5
          </h1>

          {/* mô tả */}
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
            Luyện tập theo từng chủ đề ngữ pháp và từ vựng để cải thiện kỹ năng
            làm bài TOEIC Part 5.
          </p>
        </div>

        {/* thống kê nhanh */}

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {/* số chủ đề ngữ pháp */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-3xl font-bold text-blue-500">5</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Chủ đề ngữ pháp
            </p>
          </div>

          {/* số chủ đề từ vựng */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-3xl font-bold text-purple-500">3</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Chủ đề từ vựng
            </p>
          </div>

          {/* tổng số câu hỏi */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-3xl font-bold text-green-500">200+</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Câu hỏi luyện tập
            </p>
          </div>
        </div>

        {/* phần ngữ pháp */}

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Ngữ pháp
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {grammarTopics.map((topic) => (
              <TopicCard key={topic.title} {...topic} />
            ))}
          </div>
        </div>

        {/* phần từ vựng */}

        <div>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Từ vựng
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {vocabTopics.map((topic) => (
              <TopicCard key={topic.title} {...topic} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
