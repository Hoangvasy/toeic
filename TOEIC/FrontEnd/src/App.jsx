import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/User/Dashboard/Dashboard";
import Part5Practice from "./pages/User/Practice/Part5/Part5Practice";
import PracticeHome from "./pages/User/Practice/PracticePage";
import Part5Topics from "./pages/User/Practice/Part5/Part5Topics";
import PracticeResult from "./pages/User/Practice/PracticeResult";
import PracticeReview from "./pages/User/Practice/PracticeReview";
import Profile from "./pages/User/Profile/Profile";
import PracticePart6 from "./pages/User/Practice/Part6/PracticePart6";
import Part6List from "./pages/User/Practice/Part6/Part6List";
import Vocabulary from "./pages/User/Vocabulary/Vocabulary";
import PracticePart7Menu from "./pages/User/Practice/Part7/PracticePart7Menu";
import Upload from "./pages/Admin/Upload/Upload";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import AuthCheck from "./auth/AuthCheck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      {/* USER ROUTES */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/practice" element={<PracticeHome />} />

        <Route path="/practice/part5" element={<Part5Topics />} />
        <Route path="/practice/part5/:label" element={<Part5Practice />} />

        <Route path="/practice/part6" element={<Part6List />} />
        <Route path="/practice/part6/:testId" element={<PracticePart6 />} />
        <Route path="/practice/part7" element={<PracticePart7Menu />} />

        <Route path="/practice/result" element={<PracticeResult />} />
        <Route path="/practice/review" element={<PracticeReview />} />

        <Route path="/vocabulary" element={<Vocabulary />} />

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
