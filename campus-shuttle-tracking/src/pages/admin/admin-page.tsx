import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "../../services/auth";

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🚌</span>
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/routes" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🗺️ Routes
          </NavLink>
          <NavLink to="/admin/buses" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🚌 Buses
          </NavLink>
          <NavLink to="/admin/stops" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            📍 Stops
          </NavLink>
          <NavLink to="/admin/map" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🗾 Live Map
          </NavLink>
        </nav>
        <button className="admin-signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
