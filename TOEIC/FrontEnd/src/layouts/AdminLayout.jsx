import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import SidebarAdmin from "../components/common/Sidebar/SidebarAdmin";
import HeaderAdmin from "../components/common/Header/HeaderAdmin";
import useDarkMode from "../hooks/useDarkMode";

function AdminLayout() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const checkSession = () => {
    axios
      .get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        const role = res.data.role;

        if (role !== "ADMIN") {
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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* SIDEBAR */}
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <HeaderAdmin darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* CONTENT */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
