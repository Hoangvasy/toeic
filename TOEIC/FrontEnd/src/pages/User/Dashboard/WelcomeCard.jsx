import { motion } from "framer-motion";

import { Sparkles, Flame, Target, Trophy } from "lucide-react";

function WelcomeCard({ user }) {
  const stats = [
    {
      label: "Mục tiêu",

      value: user?.targetScore || 750,

      suffix: "",

      icon: Target,

      iconColor: "text-sky-500 dark:text-sky-300",

      iconBg: "bg-sky-100 dark:bg-sky-500/15",

      glow: "from-sky-500/10 to-blue-500/5",
    },

    {
      label: "Chuỗi ngày học",

      value: user?.streakDays || 0,

      suffix: "ngày",

      icon: Flame,

      iconColor: "text-orange-500 dark:text-orange-300",

      iconBg: "bg-orange-100 dark:bg-orange-500/15",

      glow: "from-orange-500/10 to-red-500/5",
    },

    {
      label: "Kỷ lục",

      value: user?.longestStreak || 0,

      suffix: "ngày",

      icon: Trophy,

      iconColor: "text-yellow-500 dark:text-yellow-300",

      iconBg: "bg-yellow-100 dark:bg-yellow-500/15",

      glow: "from-yellow-500/10 to-amber-500/5",
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
      relative
      overflow-hidden

      rounded-[32px]

      p-8

      bg-gradient-to-br
      from-white
      via-slate-50
      to-sky-50

      dark:from-slate-900
      dark:via-slate-900
      dark:to-blue-950

      border border-slate-200
      dark:border-slate-800

      shadow-xl
      "
    >
      {/* GRID */}

      <div
        className="
        absolute inset-0

        opacity-[0.02]
        dark:opacity-[0.04]
        "
        style={{
          backgroundImage:
            "linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)",

          backgroundSize: "42px 42px",
        }}
      />

      {/* GLOW */}

      <div
        className="
        absolute
        -top-24
        -right-24

        w-80 h-80

        rounded-full

        bg-sky-400/10
        dark:bg-sky-500/20

        blur-3xl
        "
      />

      <div
        className="
        absolute
        bottom-0
        left-0

        w-72 h-72

        rounded-full

        bg-blue-400/10
        dark:bg-blue-500/10

        blur-3xl
        "
      />

      {/* CONTENT */}

      <div className="relative z-10">
        {/* HEADER */}

        <div className="max-w-3xl">
          {/* BADGE */}

          <div
            className="
            inline-flex
            items-center gap-2

            px-4 py-2

            rounded-full

            bg-white/80
            dark:bg-white/[0.06]

            border border-slate-200
            dark:border-white/10

            backdrop-blur-xl

            text-sm

            text-slate-700
            dark:text-slate-200

            shadow-sm

            mb-6
            "
          >
            <Sparkles
              className="
              w-4 h-4

              text-sky-500
              dark:text-sky-300
              "
            />
            TOEIC Learning Dashboard
          </div>

          {/* TITLE */}

          <h1
            className="
            text-4xl
            md:text-5xl

            font-bold

            tracking-tight
            leading-tight

            text-slate-900
            dark:text-white
            "
          >
            Chào mừng trở lại
            <br />
            <span
              className="
              bg-gradient-to-r

              from-sky-500
              via-blue-500
              to-indigo-500

              dark:from-sky-300
              dark:via-cyan-300
              dark:to-blue-400

              bg-clip-text
              text-transparent
              "
            >
              {user?.username || "Người học"}
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
            mt-5

            text-base
            leading-relaxed

            max-w-2xl

            text-slate-600
            dark:text-slate-300
            "
          >
            Tiếp tục hành trình chinh phục TOEIC và duy trì chuỗi ngày học tập
            của bạn mỗi ngày.
          </p>
        </div>

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3

          gap-5

          mt-10
          "
        >
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                relative
                overflow-hidden

                group

                rounded-[28px]

                bg-white/80
                dark:bg-white/[0.05]

                border border-slate-200
                dark:border-white/10

                backdrop-blur-xl

                p-6

                shadow-sm

                hover:shadow-lg
                hover:-translate-y-1

                dark:hover:bg-white/[0.07]

                transition-all duration-300

                flex flex-col items-center justify-center
                text-center
                "
              >
                {/* CARD GLOW */}

                <div
                  className={`
                  absolute
                  inset-0

                  opacity-0
                  group-hover:opacity-100

                  transition

                  bg-gradient-to-br
                  ${item.glow}
                `}
                />

                <div
                  className="
                  relative z-10

                  flex flex-col items-center
                  "
                >
                  {/* ICON */}

                  <div
                    className={`
                    w-16 h-16

                    rounded-2xl

                    flex items-center justify-center

                    mb-6

                    ${item.iconBg}
                  `}
                  >
                    <Icon
                      className={`
                      w-7 h-7
                      ${item.iconColor}
                    `}
                    />
                  </div>

                  {/* VALUE */}

                  <h3
                    className="
                    text-5xl
                    font-bold

                    tracking-tight

                    text-slate-900
                    dark:text-white
                    "
                  >
                    {item.value}

                    <span
                      className="
                      ml-1

                      text-xl
                      font-medium

                      text-slate-400
                      dark:text-slate-500
                      "
                    >
                      {item.suffix}
                    </span>
                  </h3>

                  {/* LABEL */}

                  <p
                    className="
                    mt-3

                    text-base
                    font-medium

                    text-slate-500
                    dark:text-slate-400
                    "
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default WelcomeCard;
