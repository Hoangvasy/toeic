import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import WelcomeCard from "./WelcomeCard";
import QuickAction from "./QuickAction";
import ActivityCard from "./ActivityCard";
import CalendarCard from "./CalendarCard";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        }).then((r) => r.json());

        const profile = await fetch(
          `http://localhost:8080/api/user/${me.userId}`,
          {
            credentials: "include",
          },
        ).then((r) => r.json());

        setUser(profile);
      } catch (err) {
        console.error("load user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div
        className="
        space-y-6
        animate-pulse
        "
      >
        <div
          className="
          h-[260px]
          rounded-3xl
          bg-slate-200
          dark:bg-slate-800
          "
        />

        <div
          className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-6
          "
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                h-32
                rounded-3xl
                bg-slate-200
                dark:bg-slate-800
                "
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        grid
        grid-cols-1
        xl:grid-cols-12

        gap-6
        "
      >
        {/* WELCOME */}

        <div
          className="
          xl:col-span-8
          "
        >
          <WelcomeCard user={user} />
        </div>

        {/* CALENDAR */}

        <div
          className="
          xl:col-span-4
          h-full
          "
        >
          <CalendarCard userId={user?.id} streakDays={user?.streakDays} />
        </div>
      </motion.div>

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
        "
      ></div>

      <QuickAction />

      <ActivityCard />
    </div>
  );
}

export default Dashboard;
