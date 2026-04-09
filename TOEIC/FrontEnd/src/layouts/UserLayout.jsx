import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

import useDarkMode from "../hooks/useDarkMode";

import Sidebar from "../components/common/Sidebar/SidebarUser";
import Header from "../components/common/Header/HeaderUser";
import Footer from "../components/common/Footer/Footer";

function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const navigate = useNavigate();

  const checkSession = () => {
    axios
      .get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        const role = res.data.role;

        if (role !== "USER") {
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  };

  useEffect(() => {
    checkSession();

    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
