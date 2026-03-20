import '../styles/sudentLayout.css';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home, Map, Share2, Settings } from "lucide-react";



const TABS = [
  { path: "/home",   icon: <Home size={22} />,    label: "Home" },
  { path: "/map",    icon: <Map size={22} />,     label: "Map" },
  { path: "/studentroutes", icon: <Share2 size={22} />,  label: "Routes" },
  { path: "/settings", icon: <Settings size={22} />, label: "Settings" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="page">
      <Outlet />

      <nav className="tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={"tabItem" + (pathname === tab.path ? " tabActive" : "")}
          >
            {tab.icon}
            <span className="tabLabel">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
