import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./Modules/Admin/ARoutes/AdminRoute";
import UserRoute from "./Modules/Users/URoutes/UserRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Users/Register" replace />} /> 

        <Route path="/Admin/*" element={<AdminRoute />} />
        <Route path="/Users/*" element={<UserRoute />} /> {/* ← removed the 's' */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;

