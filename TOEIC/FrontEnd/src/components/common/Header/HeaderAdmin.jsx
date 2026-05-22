import { Search, Bell, Sun, Moon } from "lucide-react";

import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function HeaderAdmin({
  darkMode,

  toggleDarkMode,
}) {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // current login
        const me = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });

        // profile
        const profile = await axios.get(
          `http://localhost:8080/api/user/${me.data.userId}`,
          {
            withCredentials: true,
          },
        );

        setUser(profile.data);
      } catch (err) {
        console.error(err);

        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <header
      className="
      sticky top-0 z-20
      bg-white dark:bg-gray-900
      border-b border-gray-200 dark:border-gray-800
      px-6 py-4
      flex items-center justify-between
      "
    >
      {/* LEFT */}

      <div>
        <h2
          className="
          text-xl
          font-semibold
          "
        >
          TOEIC Admin Dashboard
        </h2>

        <p
          className="
          text-sm
          text-gray-500 dark:text-gray-400
          "
        >
          Tổng quan hệ thống
        </p>
      </div>

      {/* RIGHT */}

      <div
        className="
        flex items-center gap-3
        "
      >
        {/* SEARCH */}

        <div
          className="
          relative
          hidden md:block
          "
        >
          <Search
            className="
            absolute
            left-3 top-2.5
            w-4 h-4
            text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Tìm đề thi..."
            className="
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            rounded-lg
            pl-9 pr-4 py-2
            w-64
            text-sm
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            transition
            "
          />
        </div>

        {/* DARK MODE */}

        <button
          onClick={toggleDarkMode}
          className="
          w-10 h-10
          flex items-center justify-center
          border border-gray-300 dark:border-gray-700
          rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
          "
        >
          {darkMode ? (
            <Sun
              className="
              w-5 h-5
              text-yellow-400
              "
            />
          ) : (
            <Moon
              className="
              w-5 h-5
              text-gray-600
              "
            />
          )}
        </button>

        {/* NOTIFICATION */}

        <div className="relative">
          <button
            className="
            w-10 h-10
            flex items-center justify-center
            border border-gray-300 dark:border-gray-700
            rounded-lg
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
            "
          >
            <Bell className="w-5 h-5" />
          </button>

          <span
            className="
            absolute -top-1 -right-1
            bg-red-500
            text-white
            text-xs
            rounded-full
            w-5 h-5
            flex items-center justify-center
            "
          >
            3
          </span>
        </div>

        {/* USER */}

        <div
          className="
          flex items-center gap-2
          border border-gray-300 dark:border-gray-700
          rounded-lg
          px-3 py-1.5
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
          cursor-pointer
          "
        >
          {/* AVATAR */}

          {user?.avatar ? (
            <img
              src={`http://localhost:8080${user.avatar}`}
              alt="avatar"
              className="
              w-8 h-8
              rounded-full
              object-cover
              "
            />
          ) : (
            <div
              className="
              w-8 h-8
              rounded-full
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              text-sm
              font-semibold
              "
            >
              {user?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
          )}

          <div
            className="
            hidden sm:block
            text-sm
            "
          >
            <p className="font-medium">{user?.username || "Admin"}</p>

            <p
              className="
              text-gray-500 dark:text-gray-400
              text-xs
              "
            >
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
