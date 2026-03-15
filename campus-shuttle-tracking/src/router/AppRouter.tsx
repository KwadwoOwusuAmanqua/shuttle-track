import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/react-hook";

import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../pages/admin/admin-page";
import MapPage from "../pages/student/Map";
import LoginPage from "../pages/auth/Login";
import SignUpPage from "../pages/auth/SignUp";
import RoutesPage from "../pages/admin/RoutesPage";
import BusesPage from "../pages/admin/BusesPage";
import StopsPage from "../pages/admin/StopsPage";
import AdminMapPage from "../pages/admin/AdminMapPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/map"} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Student — any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<StudentLayout />}>
            <Route path="/map" element={<MapPage />} />
          </Route>
        </Route>

        {/* Admin — admin role only */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="routes" replace />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="buses" element={<BusesPage />} />
            <Route path="stops" element={<StopsPage />} />
            <Route path="map" element={<AdminMapPage />} />
          </Route>
        </Route>

        {/* Root + fallback */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
