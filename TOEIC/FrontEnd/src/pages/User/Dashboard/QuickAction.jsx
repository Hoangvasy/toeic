import {
  Zap,
  BookOpen,
  FileText,
  Headphones,
  Brain,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function QuickAction() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Luyện Part 5",

      subtitle: "Ngữ pháp & từ vựng",

      icon: FileText,

      color: "from-blue-500 to-cyan-500",

      bg: "bg-blue-50 dark:bg-blue-500/10",

      action: () => navigate("/practice"),
    },

    {
      title: "Luyện Part 6",

      subtitle: "Text Completion",

      icon: BookOpen,

      color: "from-emerald-500 to-green-500",

      bg: "bg-emerald-50 dark:bg-emerald-500/10",

      action: () => navigate("/practice"),
    },

    {
      title: "Từ vựng TOEIC",

      subtitle: "Flashcard & review",

      icon: Brain,

      color: "from-purple-500 to-pink-500",

      bg: "bg-purple-50 dark:bg-purple-500/10",

      action: () => navigate("/vocabulary"),
    },

    {
      title: "Luyện nghe",

      subtitle: "Part 1 - Part 4",

      icon: Headphones,

      color: "from-orange-500 to-red-500",

      bg: "bg-orange-50 dark:bg-orange-500/10",

      action: () => navigate("/practice"),
    },
  ];

  return (
    <div
      className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-3xl
      p-6
      shadow-sm
      "
    >
      <div
        className="
        flex items-center justify-between
        mb-6
        "
      >
        <div
          className="
          flex items-center gap-3
          "
        >
          <div
            className="
            w-11 h-11
            rounded-2xl
            bg-yellow-100 dark:bg-yellow-500/10
            flex items-center justify-center
            "
          >
            <Zap
              className="
              w-5 h-5
              text-yellow-500
              "
            />
          </div>

          <div>
            <h3
              className="
              text-lg
              font-bold
              text-gray-900 dark:text-white
              "
            >
              Luyện nhanh
            </h3>

            <p
              className="
              text-sm
              text-gray-500 dark:text-gray-400
              "
            >
              Truy cập nhanh các chế độ học
            </p>
          </div>
        </div>

        <button
          className="
          text-sm
          text-blue-600
          hover:text-blue-700
          font-medium
          flex items-center gap-1
          "
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
        "
      >
        {actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={item.action}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5
                text-left
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                ${item.bg}
              `}
            >
              <div
                className={`
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition
                bg-gradient-to-br
                ${item.color}
                `}
                style={{
                  filter: "blur(80px)",
                }}
              />

              <div className="relative z-10">
                <div
                  className={`
                  w-12 h-12
                  rounded-2xl
                  bg-gradient-to-br
                  ${item.color}
                  text-white
                  flex items-center justify-center
                  shadow-md
                  mb-4
                  group-hover:scale-110
                  transition
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h4
                  className="
                  text-base
                  font-semibold
                  text-gray-900 dark:text-white
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                  text-sm
                  text-gray-500 dark:text-gray-400
                  mt-1
                  "
                >
                  {item.subtitle}
                </p>

                <div
                  className="
                  mt-5
                  flex items-center gap-1
                  text-sm font-medium
                  text-blue-600
                  "
                >
                  Bắt đầu
                  <ChevronRight
                    className="
                    w-4 h-4
                    group-hover:translate-x-1
                    transition
                    "
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickAction;
