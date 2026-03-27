import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import React from "react";
import { useAuth } from "../hooks/react-hook";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Each import becomes its own JS chunk — downloaded only when first visited
const OnboardingPage     = lazy(() => import("../pages/OnboardingPage"));
const LandingPage        = lazy(() => import("../pages/LandingPage"));
const LoginPage          = lazy(() => import("../pages/auth/Login"));
const SignUpPage         = lazy(() => import("../pages/auth/SignUp"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPassword"));

const StudentLayout      = lazy(() => import("../layouts/StudentLayout"));
const HomePage           = lazy(() => import("../pages/HomePage"));
const MapPage            = lazy(() => import("../pages/student/Map"));
const MapView            = lazy(() => import("../components/map/MapView"));
const StudentRoutePage   = lazy(() => import("../pages/student/StudentRoutePage"));
const SchedulePage       = lazy(() => import("../pages/common/SchedulePage"));
const StudentProfilePage = lazy(() => import("../pages/student/StudentProfilePage"));

const AdminLayout        = lazy(() => import("../layouts/AdminLayout"));
const RoutesPage         = lazy(() => import("../pages/admin/RoutesPage"));
const BusesPage          = lazy(() => import("../pages/admin/BusesPage"));
const StopsPage          = lazy(() => import("../pages/admin/StopsPage"));
const AdminMapPage       = lazy(() => import("../pages/admin/AdminMapPage"));

// Invisible background while a chunk loads — avoids layout flash
function PageShell() {
  return <div style={{ width: "100%", height: "100dvh", background: "#f5f7f5" }} />;
}

// Wraps each route group in a single Suspense boundary
function SuspenseWrapper() {
  return (
    <Suspense fallback={<PageShell />}>
      <Outlet />
    </Suspense>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    const seen = localStorage.getItem("campus_shuttle_onboarded");
    return <Navigate to={seen ? "/landing" : "/onboarding"} replace />;
  }
  return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
}

// Prevents logged-in users from reaching public-only pages (onboarding, landing, login, signup)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SuspenseWrapper />}>
          {/* Public — redirects logged-in users to the app */}
          <Route path="/onboarding"      element={<PublicRoute><OnboardingPage /></PublicRoute>} />
          <Route path="/landing"         element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup"          element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Student — any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route element={<StudentLayout />}>
              <Route path="/home"          element={<HomePage />} />
              <Route path="/map"           element={<MapPage />} />
              <Route path="/studentroutes" element={<StudentRoutePage />} />
              <Route path="/filteredroute" element={<MapView />} />
              <Route path="/schedule"      element={<SchedulePage />} />
              <Route path="/profile"       element={<StudentProfilePage />} />
            </Route>
          </Route>

          {/* Admin — admin role only */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="routes" replace />} />
              <Route path="routes" element={<RoutesPage />} />
              <Route path="buses"  element={<BusesPage />} />
              <Route path="stops"  element={<StopsPage />} />
              <Route path="map"    element={<AdminMapPage />} />
            </Route>
          </Route>

          {/* Root + fallback */}
          <Route path="/"  element={<RootRedirect />} />
          <Route path="*"  element={<RootRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
