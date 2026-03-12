import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import MapPage from "../pages/student/Map";
import { SignUp } from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Student Routes */}
        <Route path="/" element={<StudentLayout />}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SignUp />} />
        </Route>

        {/* Admin Routes */}

        {/* Fallback Route */}

      </Routes>
    </BrowserRouter>
  );
}
