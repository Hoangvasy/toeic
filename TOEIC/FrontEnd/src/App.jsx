import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// layout
import MainLayout from "./layouts/UserLayout";

function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* PRIVATE ROUTES (có layout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
=======
import AdminLayout from "./layouts/AdminLayout";
import Upload from "./pages/Admin/Upload/Upload";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="upload" element={<Upload />} />
         <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
>>>>>>> 75b087fa26a87d74313f6378738ecd8b7b904d2b
  );
}

export default App;
