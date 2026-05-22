import { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import useDarkMode from "../hooks/useDarkMode";

import Sidebar from "../components/common/Sidebar/SidebarUser";
import Header from "../components/common/Header/HeaderUser";
import Footer from "../components/common/Footer/Footer";
import Sider from "../components/common/Sider/Sider";

function UserLayout() {
  const [selectedText, setSelectedText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // ✅ SIDER STATE
  const [siderWidth, setSiderWidth] = useState(380);
  const [siderOpen, setSiderOpen] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Chỉ bật AI ở trang này
  const enableAI = location.pathname === "/practice" ||
  location.pathname === "/result" ||
  location.pathname === "/vocabulary";

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

  // ✅ Handle text select
  useEffect(() => {
    let last = "";

    const handleSelect = () => {
      // Không phải trang practictest thì bỏ qua
      if (!enableAI) return;

      const text = window.getSelection().toString().trim();

      if (!text || text === last) return;

      last = text;

      setSelectedText(text);
      setSiderOpen(true);
    };

    document.addEventListener("mouseup", handleSelect);

    return () => {
      document.removeEventListener("mouseup", handleSelect);
    };
  }, [enableAI]);

  // ✅ Reset sider khi đổi trang
  useEffect(() => {
    setSiderOpen(false);
    setSelectedText("");
  }, [location.pathname]);

  // ✅ Check session
  useEffect(() => {
    checkSession();

    const handleFocus = () => checkSession();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* LEFT SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginRight:
            enableAI && siderOpen ? siderWidth : 0,
        }}
      >
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* ✅ Chỉ render AI ở /practicetest */}
      {enableAI && (
        <Sider
          width={siderWidth}
          setWidth={setSiderWidth}
          open={siderOpen}
          setOpen={setSiderOpen}
          selectedText={selectedText}
          onTextSelect={setSelectedText}
        />
      )}
    </div>
  );
}

export default UserLayout;