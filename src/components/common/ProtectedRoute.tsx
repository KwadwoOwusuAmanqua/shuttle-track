import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/react-hook";
import styles from "../../styles/loading.module.css"

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
       <div className={styles.wrapper}>
      <div className={`${styles.sk} ${styles.header}`} />
      <div className={`${styles.sk} ${styles.banner}`} />
      <div className={`${styles.sk} ${styles.line}`} />
      <div className={`${styles.sk} ${styles.line} ${styles.short}`} />
      <div className={`${styles.sk} ${styles.card}`} />
    </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />
    );
  }

  return (<Outlet />);
}
