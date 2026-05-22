import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import TestList from "./pages//User/Learning/TestList";
import TakeTest from "./pages//User/Learning/TakeTest";
import AIPath from "./pages//User/StudyPlant/AIPath";
import Overview from "./pages//User/StudyPlant/OverView";
import History from "./pages/User/StudyPlant/History";
import TodayLearning from "./pages/User/StudyPlant/TodayLearning";
import PracticeTest from "./pages/User/Practice/Test/PracticeTest";
import PracticeTestDetail from "./pages/User/Practice/Test/PracticeTestDetail";
import PracticeExam from "./pages/User/Practice/Test/PreacticeExam";
import Result from "./pages/User/Practice/Test/Result";
import PracticeHistoryReview from "./pages/User/Practice/Test/PracticeHistoryReview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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

        <Route path="/result" element={<Result />} />
        <Route path="/practice" element={<TestList />} />
        <Route path="/take-test/:testId" element={<TakeTest />} />

        <Route path="/aipath" element={<AIPath />} />
        {/* <Route path="/overview" element={<Overview />} /> */}
        <Route path="/overview/:id" element={<Overview />} />
        <Route path="/history" element={<History />} />
        <Route path="/today-learning" element={<TodayLearning />} />
        <Route path="/practicetest" element={<PracticeTest />} />

        <Route path="/practice-test/:id" element={<PracticeTestDetail />} />
        <Route path="/practice/:id/parts/:parts" element={<PracticeExam />} />


        <Route
  path="/practice-history/:sessionId"
  element={<PracticeHistoryReview />}
/>


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
