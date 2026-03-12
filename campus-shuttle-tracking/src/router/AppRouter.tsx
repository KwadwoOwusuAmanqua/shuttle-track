import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import MapPage from "../pages/student/Map";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentLayout />}>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="map" element={<MapPage />} />
        </Route>

        {/* Admin Routes */}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
