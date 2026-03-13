import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/react-hook";

interface Props {
  allowedRole?: "student" | "admin";
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRole,
  redirectTo = "/login",
}: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: 16,
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/map"} replace />
    );
  }

  return <Outlet />;
}
