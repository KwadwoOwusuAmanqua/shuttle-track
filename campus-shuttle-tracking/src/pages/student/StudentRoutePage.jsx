import { useState } from "react";
import { GitBranch, Search, ChevronUp, Clock, ArrowRight } from "lucide-react";
import { ROUTES, STOPS, MOCK_BUSES  } from "../../services/mockShuttleData";
import { useNavigate } from "react-router-dom";
import { getClosestBusToStop } from "../../utils/calculateETA";
import { getNextActiveStopId } from "../../utils/getNextActiveStopId";
import MiniMap from "../../components/map/MiniMap";
import { useShuttleBuses } from "../../hooks/useShuttleBuses";
import { useAuth } from "../../hooks/react-hook";
import styles from '../../styles/StudentRoutesPage.module.css';




const routesWithStops = Object.values(ROUTES).map((route) => ({
  ...route,
  stopList: STOPS.filter((s) => s.routeId === route.id)
                  .sort((a, b) => a.order - b.order),
  bus_stop_num: STOPS.filter((s) => s.routeId === route.id).length,
  shuttles: MOCK_BUSES.filter((s) => s.routeId === route.id).length
}));


export default function StudentRoutePage() {

  const navigate=useNavigate();
  const buses=useShuttleBuses()

  const { user } = useAuth();
  const initial = user?.displayName?.[0]?.toUpperCase() ?? "?";

  const [routes, setRoutes] = useState(
      routesWithStops.map((r, i) => ({ ...r, expanded: i === 0 }))); 
  const [search, setSearch] = useState("");
  


  const toggle = (id) =>
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r))
    );

  const filtered = routes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRouteSelect = (routeId) => {
    navigate("/filteredroute", { state: { activeRoute: routeId } });
  };



  return (
    <div className={styles.page}>

      <header className={styles.topbar}>
        <button className={styles.iconBtn}>
          <GitBranch size={22} strokeWidth={2} />
        </button>
        <h1 className={styles.pageTitle}>Campus Routes</h1>
        <button className={styles.avatarBtn}>
          <span className={styles.avatarInner}>
            {initial}
          </span>
        </button>
      </header>

      <div className={styles.scroll}>

      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} strokeWidth={2} />
        <input
          className={styles.searchInput}
          placeholder="Search for a route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.mapBox} onClick={() => navigate("/map")} >
        <MiniMap/>
        <span className={styles.liveBadge}>LIVE</span>
      </div>

      <div className={styles.routeList}>

        {filtered.map((route) => (
          <div key={route.id}
            className={`${styles.routeCard} ${route.expanded ? styles.routeCardExpanded : ""}`}>
            {/* Card header */}
            <button className={styles.cardHeader}
              onClick={() => toggle(route.id)}>
                
              <div className={styles.cardHeaderLeft}>
                {route.expanded ? (
                  <span
                    className={styles.routeDot}
                    style={{ background: route.color }}
                  />
                ) : (
                  <span
                    className={styles.routeIconBox}
                    style={{ background: route.color + "22", color: route.color }}>
                    🚌
                  </span>
                )}

                <div>
                  <p className={styles.routeName}> {route.name} </p>
                  <p className={styles.routeMeta}>
                    {route.bus_stop_num} Bus Stops • {route.shuttles} Active Shuttles
                  </p>
                </div>
              </div>

              <div className={styles.cardHeaderRight}>
                {route.expanded ? (
                  <ChevronUp size={18} strokeWidth={2} className={styles.chevron} />
                ) : (
                  <span className={styles.viewBtn}>View</span>
                )}
              </div>
            </button>

            {route.expanded && (
            <>
            <div className={styles.stopList}>
              {(() => {
                const activeStopIds = getNextActiveStopId(route, buses);
                return route.stopList.map((stop, i) => (
                  <div key={stop.id} className={styles.stopRow}>
                    <div className={styles.stopLine}>
                      <span
                          className={`${styles.stopDot} ${
                            activeStopIds.includes(stop.id) ? styles.stopDotFilled : ""
                          }`}
                        />
                      {i < route.stopList.length - 1 && (
                        <span className={styles.stopConnector} />
                      )}
                    </div>
                    <span className={styles.stopName}>{stop.name}</span>
                    <span className={styles.stopEta}>
                      {getClosestBusToStop(stop, buses.filter(b => b.routeId === route.id))?.etaMinutes ?? "—"} min
                    </span>
                  </div>
                ));
              })()}
            </div>
            
            <button
                  className={styles.detailBtn}
                  style={{ background: route.color }}
                  onClick={() => handleRouteSelect(route.id)}
                >
                  View Detailed Route
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
            </>)}

            {/* Collapsed next shuttle */}
            {!route.expanded && (
              <p className={styles.nextShuttle}>
                <Clock size={12} strokeWidth={2} />
                Next shuttle in {route.nextShuttle}
              </p>
            )}
          </div>
        ))}

      </div>
      </div>
    </div>
  );
}