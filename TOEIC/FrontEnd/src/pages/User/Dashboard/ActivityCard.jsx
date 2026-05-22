import {
  Clock,
  BookOpen,
  FileText,
  Brain,
  Headphones,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import axios from "axios";

function ActivityCard() {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // current user
        const me = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });

        // activities
        const res = await axios.get(
          `http://localhost:8080/api/study-session/user/${me.data.userId}`,
          {
            withCredentials: true,
          },
        );

        setActivities(res.data || []);
      } catch (err) {
        console.error("load activities error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type) => {
    if (type?.includes("PART5")) {
      return FileText;
    }

    if (type?.includes("PART6")) {
      return BookOpen;
    }

    if (type?.includes("VOCAB")) {
      return Brain;
    }

    if (type?.includes("LISTENING")) {
      return Headphones;
    }

    return Clock;
  };

  const getGradient = (type) => {
    if (type?.includes("PART5")) {
      return `
          from-blue-500
          to-cyan-500
        `;
    }

    if (type?.includes("PART6")) {
      return `
          from-emerald-500
          to-green-500
        `;
    }

    if (type?.includes("VOCAB")) {
      return `
          from-purple-500
          to-pink-500
        `;
    }

    if (type?.includes("LISTENING")) {
      return `
          from-orange-500
          to-red-500
        `;
    }

    return `
        from-gray-500
        to-gray-600
      `;
  };

  const formatType = (type) => {
    const map = {
      PRACTICE_PART5_TENSE_VOICE: "Luyện Part 5 - Tense & Voice",

      PRACTICE_PART5_WORD_FORM: "Luyện Part 5 - Word Form",

      PRACTICE_PART6_TEXT_COMPLETION: "Luyện Part 6 - Text Completion",

      PRACTICE_PART7_SINGLE: "Luyện Part 7 - Single Passage",

      PRACTICE_PART7_DOUBLE: "Luyện Part 7 - Double Passage",

      PRACTICE_PART7_TRIPLE: "Luyện Part 7 - Triple Passage",

      VOCAB_FLASHCARD: "Ôn tập Flashcard TOEIC",
    };

    return map[type] || type;
  };

  const formatDuration = (seconds) => {
    if (!seconds) {
      return "0s";
    }

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    const remain = seconds % 60;

    return `${minutes}m ${remain}s`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
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
          animate-pulse
          space-y-4
          "
        >
          <div
            className="
            h-6
            w-44
            rounded
            bg-gray-200 dark:bg-gray-800
            "
          />

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
              h-20
              rounded-2xl
              bg-gray-100 dark:bg-gray-800
              "
            />
          ))}
        </div>
      </div>
    );
  }

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
            bg-blue-100 dark:bg-blue-500/10
            flex items-center justify-center
            "
          >
            <Sparkles
              className="
              w-5 h-5
              text-blue-600
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
              Hoạt động gần đây
            </h3>

            <p
              className="
              text-sm
              text-gray-500 dark:text-gray-400
              "
            >
              Các hoạt động học tập mới nhất
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
          <ChevronRight
            className="
            w-4 h-4
            "
          />
        </button>
      </div>

      {!activities.length ? (
        <div
          className="
          py-10
          text-center
          "
        >
          <div
            className="
            w-16 h-16
            rounded-full
            bg-gray-100 dark:bg-gray-800
            flex items-center justify-center
            mx-auto mb-4
            "
          >
            <Clock
              className="
              w-7 h-7
              text-gray-400
              "
            />
          </div>

          <p
            className="
            text-gray-500 dark:text-gray-400
            "
          >
            Chưa có hoạt động nào
          </p>
        </div>
      ) : (
        <div
          className="
          space-y-4
          max-h-[420px]
          overflow-y-auto
          pr-1
          "
        >
          {activities.map((item, index) => {
            const Icon = getIcon(item.type);

            return (
              <div
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  border border-gray-200 dark:border-gray-800
                  rounded-2xl
                  p-4
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all duration-300
                  "
              >
                {/* glow */}

                <div
                  className={`
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition
                    bg-gradient-to-br
                    ${getGradient(item.type)}
                    `}
                  style={{
                    filter: "blur(90px)",
                  }}
                />

                <div
                  className="
                    relative z-10
                    flex items-start gap-4
                    "
                >
                  {/* ICON */}

                  <div
                    className={`
                      w-12 h-12
                      rounded-2xl
                      bg-gradient-to-br
                      ${getGradient(item.type)}
                      text-white
                      flex items-center justify-center
                      shadow-md
                      flex-shrink-0
                      `}
                  >
                    <Icon
                      className="
                        w-5 h-5
                        "
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">
                    <div
                      className="
                        flex items-center justify-between
                        gap-4
                        "
                    >
                      <h4
                        className="
                          font-semibold
                          text-gray-900 dark:text-white
                          "
                      >
                        {formatType(item.type)}
                      </h4>

                      <span
                        className="
                          text-xs
                          text-gray-500 dark:text-gray-400
                          whitespace-nowrap
                          "
                      >
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <div
                      className="
                        flex items-center gap-4
                        mt-3
                        text-sm
                        "
                    >
                      <span
                        className="
                          text-gray-600 dark:text-gray-300
                          "
                      >
                        ⏱ {formatDuration(item.duration)}
                      </span>

                      <span
                        className="
                          text-emerald-600
                          dark:text-emerald-400
                          font-medium
                          "
                      >
                        ✓ Hoàn thành
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
