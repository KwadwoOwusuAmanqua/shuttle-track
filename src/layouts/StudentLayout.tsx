import '../styles/sudentLayout.css';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home, Map, Share2, User } from "lucide-react";
import { LimelightNav } from "../components/common/LimelightNav";


const TABS = [
  { path: "/home",          icon: <Home size={22} />,   label: "Home"   },
  { path: "/map",           icon: <Map size={22} />,    label: "Map"    },
  { path: "/studentroutes", icon: <Share2 size={22} />, label: "Routes" },
  { path: "/profile",       icon: <User size={22} />,   label: "Profile"},
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = TABS.findIndex((t) => t.path === pathname);

  const navItems = TABS.map((tab) => ({
    id: tab.path,
    icon: tab.icon,
    label: tab.label,
    onClick: () => navigate(tab.path),
  }));

  return (
    <div className="page">
      <Outlet />

      <div className="dockWrap">
        <LimelightNav
          items={navItems}
          activeIndex={activeIndex === -1 ? 0 : activeIndex}
          onTabChange={(i) => navigate(TABS[i].path)}
        />
      </div>
    </div>
  );
}
