import { Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= USER ================= */
import Dashboard from "./pages/User/Dashboard/Dashboard";
import Profile from "./pages/User/Profile/Profile";
import UserLayout from "./layouts/UserLayout";

/* ================= ADMIN ================= */
import AdminLayout from "./layouts/AdminLayout";
import Upload from "./pages/Admin/Upload/Upload";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      {/* USER ROUTES */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}

export default App;
