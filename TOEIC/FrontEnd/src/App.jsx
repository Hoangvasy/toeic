import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Upload from "./pages/Admin/Upload/Upload";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}

export default App;