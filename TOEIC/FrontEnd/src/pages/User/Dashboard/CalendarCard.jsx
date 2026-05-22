import { motion } from "framer-motion";
import { CalendarDays, Flame } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function getColor(level) {
  switch (level) {
    case 0:
      return `
        bg-slate-200
        dark:bg-slate-700
      `;

    case 1:
      return `
        bg-emerald-200
        dark:bg-emerald-900
      `;

    case 2:
      return `
        bg-emerald-400
        dark:bg-emerald-600
      `;

    case 3:
      return `
        bg-emerald-600
        dark:bg-emerald-400
      `;

    default:
      return `
        bg-slate-200
      `;
  }
}

function getLevel(minutes) {
  if (minutes <= 0) {
    return 0;
  }

  if (minutes <= 5) {
    return 1;
  }

  if (minutes <= 25) {
    return 2;
  }

  return 3;
}

function CalendarCard({ userId, streakDays }) {
  const [heatmapData, setHeatmapData] = useState([]);

  const today = new Date();

  const year = today.getFullYear();

  const month = today.getMonth();

  useEffect(() => {
    if (!userId) return;

    const fetchHeatmap = async () => {
      try {
        const today = new Date();

        const year = today.getFullYear();

        const month = today.getMonth() + 1;

        const res = await axios.get(
          "http://localhost:8080/api/study-session/heatmap",
          {
            params: {
              userId,
              year,
              month,
            },
          },
        );

        console.log("heatmap:", res.data);

        setHeatmapData(res.data);
      } catch (err) {
        console.error("Load heatmap error:", err);
      }
    };

    fetchHeatmap();
  }, [userId]);

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const apiMap = new Map();

    heatmapData.forEach((item) => {
      apiMap.set(item.date, item);
    });

    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);

      const yyyy = dateObj.getFullYear();

      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");

      const dd = String(dateObj.getDate()).padStart(2, "0");

      const dateString = `${yyyy}-${mm}-${dd}`;

      const apiData = apiMap.get(dateString);

      const durationSeconds = apiData?.duration || 0;

      const durationMinutes = Math.floor(durationSeconds / 60);

      result.push({
        date: dateString,

        dateObj,

        day,

        duration: durationMinutes,

        level: getLevel(durationMinutes),
      });
    }

    return result;
  }, [heatmapData, month, year]);

  const weeks = useMemo(() => {
    const columns = [];

    const firstDate = new Date(year, month, 1);

    const firstWeekday = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;

    let currentWeek = Array(7).fill(null);

    // offset đầu tháng

    for (let i = 0; i < firstWeekday; i++) {
      currentWeek[i] = null;
    }

    calendarDays.forEach((day, index) => {
      const date = day.dateObj;

      const weekday = date.getDay() === 0 ? 6 : date.getDay() - 1;

      currentWeek[weekday] = day;

      const isSunday = weekday === 6;

      const isLastDay = index === calendarDays.length - 1;

      if (isSunday || isLastDay) {
        columns.push(currentWeek);

        currentWeek = Array(7).fill(null);
      }
    });

    return columns;
  }, [calendarDays, month, year]);

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
      h-full
      rounded-[32px]
      bg-white
      dark:bg-slate-900
      border border-slate-200
      dark:border-slate-800
      shadow-xl
      p-6
      "
    >
      {/* GLOW */}

      <div
        className="
        absolute
        -top-16
        -right-16
        w-48 h-48
        rounded-full
        bg-emerald-500/10
        blur-3xl
        "
      />

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-start justify-between">
          <div>
            {/* ICON */}

            <div
              className="
              w-12 h-12
              rounded-2xl
              bg-emerald-100
              dark:bg-emerald-500/10
              flex items-center justify-center
              mb-4
              "
            >
              <CalendarDays
                className="
                w-6 h-6
                text-emerald-600
                dark:text-emerald-300
                "
              />
            </div>

            {/* TITLE */}

            <h3
              className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
              "
            >
              Hoạt động học tập
            </h3>

            {/* SUB */}

            <p
              className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
              "
            >
              Theo dõi streak học mỗi ngày
            </p>
          </div>

          {/* STREAK */}

          <div
            className="
            flex items-center gap-2
            px-4 py-2
            rounded-2xl
            bg-orange-100
            dark:bg-orange-500/10
            text-orange-600
            dark:text-orange-300
            font-semibold
            text-sm
            "
          >
            <Flame className="w-4 h-4" />
            {streakDays || 0} ngày
          </div>
        </div>

        {/* HEATMAP */}

        <div className="mt-10">
          <div className="flex gap-5">
            {/* WEEK LABELS */}

            <div
              className="
      flex flex-col justify-between

      text-xs
      font-medium

      text-slate-400
      dark:text-slate-500

      py-1
      "
              style={{
                height: "208px",
              }}
            >
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>

            {/* HEATMAP */}

            <div
              className="
      flex-1

      grid
      auto-cols-fr
      grid-flow-col

      gap-2
      "
            >
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="
          grid
          grid-rows-7
          gap-2
          "
                >
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return (
                        <div
                          key={dayIndex}
                          className="
                  w-6
                  h-6
                  "
                        />
                      );
                    }

                    return (
                      <div
                        key={dayIndex}
                        title={`${day.day}/${month + 1}
                        ${day.duration} phút học`}
                        className={`
                  w-6
                  h-6

                  rounded-md

                  ${getColor(day.level)}

                  hover:scale-110

                  hover:ring-2
                  hover:ring-emerald-400/60

                  transition-all
                  duration-200

                  cursor-pointer
                `}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEGEND */}

        <div
          className="
          flex items-center justify-between
          mt-7
          text-xs
          text-slate-500
          dark:text-slate-400
          "
        >
          <span>Ít</span>

          <div className="flex gap-1.5">
            <div
              className="
              w-3.5 h-3.5
              rounded-[3px]
              bg-slate-200
              dark:bg-slate-700
              "
            />

            <div
              className="
              w-3.5 h-3.5
              rounded-[3px]
              bg-emerald-200
              dark:bg-emerald-900
              "
            />

            <div
              className="
              w-3.5 h-3.5
              rounded-[3px]
              bg-emerald-400
              dark:bg-emerald-600
              "
            />

            <div
              className="
              w-3.5 h-3.5
              rounded-[3px]
              bg-emerald-600
              dark:bg-emerald-400
              "
            />
          </div>

          <span>Nhiều</span>
        </div>
      </div>
    </motion.div>
  );
}

export default CalendarCard;
