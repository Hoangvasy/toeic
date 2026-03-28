import { Routes, Route } from "react-router-dom";
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
  );
}

export default App;