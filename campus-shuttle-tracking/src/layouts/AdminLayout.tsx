import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "../services/auth";
import {ChevronLeft, ChevronRight} from "lucide-react";
import { useState } from "react";
import '../styles/admin.css'

export default function AdminLayout() {

  const navigate = useNavigate();

  const [hide,setHide]=useState(true)

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
  <div className="admin-layout">
      <aside className={`${hide ? "admin-sidebar-hidden" : "admin-sidebar"}`}>
        <button className="sidebar-toggle" onClick={() => setHide(h => !h)}>
          {hide ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <div className="admin-brand">
          <span>🚌</span>
          {!hide && <h2>Admin Panel</h2>}
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/routes" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🗺️ {!hide && "Routes"}
          </NavLink>
          <NavLink to="/admin/buses" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🚌 {!hide && "Buses"}
          </NavLink>
          <NavLink to="/admin/stops" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            📍 {!hide && "Stops"}
          </NavLink>
          <NavLink to="/admin/map" className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}>
            🗾 {!hide && "Live Map"}
          </NavLink>
        </nav>
        {!hide && (
          <button className="admin-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </aside>

    <main className="admin-content">
      <Outlet />
    </main>
  </div>
  );
}
