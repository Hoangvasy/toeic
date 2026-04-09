import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/User/Dashboard/Dashboard";
import Part5Practice from "./pages/User/Practice/Part5Practice";
import PracticeHome from "./pages/User/Practice/PracticePage";
import Part5Topics from "./pages/User/Practice/Part5Topics";
import PracticeResult from "./pages/User/Practice/PracticeResult";
import PracticeReview from "./pages/User/Practice/PracticeReview";
import SkillAnalysis from "./pages/User/Practice/SkillAnalysis";
import Profile from "./pages/User/Profile/Profile";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Upload from "./pages/Admin/Upload/Upload";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AuthCheck from "./auth/AuthCheck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<PracticeHome />} />
        <Route path="/practice/part5" element={<Part5Topics />} />
        <Route path="/practice/part5/:label" element={<Part5Practice />} />
        <Route path="/practice/result" element={<PracticeResult />} />
        <Route path="/practice/review" element={<PracticeReview />} />
        <Route path="/practice/analysis" element={<SkillAnalysis />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}

export default App;
