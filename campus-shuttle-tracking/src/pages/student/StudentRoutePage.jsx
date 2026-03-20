import { useState } from "react";
import { GitBranch, Search, ChevronUp, ChevronDown, Clock, ArrowRight } from "lucide-react";
import styles from '../../styles/StudentRoutesPage.module.css';
import { ROUTES, STOPS, MOCK_BUSES } from "../../services/mockShuttleData";


// const ROUTES = [
//   {
//     id: "north-loop",
//     name: "North Loop",
//     stops: 12,
//     shuttles: 3,
//     nextShuttle: "2 mins",
//     color: "#2b35af",
//     expanded: true,
//     stopList: [
//       { name: "Central Library", eta: "2 min" },
//       { name: "Engineering Hall", eta: "7 min" },
//       { name: "Student Union", eta: "12 min" },
//     ],
//   },
//   {
//     id: "south-express",
//     name: "South Express",
//     stops: 8,
//     shuttles: 2,
//     nextShuttle: "5 mins",
//     color: "#6c63ff",
//     expanded: false,
//     stopList: [],
//   },
//   {
//     id: "west-perimeter",
//     name: "West Perimeter",
//     stops: 15,
//     shuttles: 1,
//     nextShuttle: "14 mins",
//     color: "#f59e0b",
//     expanded: false,
//     stopList: [],
//   },
// ];

const routesWithStops = Object.values(ROUTES).map((route) => ({
  ...route,
  stopList: STOPS.filter((s) => s.routeId === route.id),
  bus_stop_num: STOPS.filter((s) => s.routeId === route.id).length,
  shuttles: MOCK_BUSES.filter((s) => s.routeId === route.id).length
}));


export default function StudentRoutePage() {

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

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <header className={styles.topbar}>
        <button className={styles.iconBtn}>
          <GitBranch size={22} strokeWidth={2} />
        </button>
        <h1 className={styles.pageTitle}>Campus Routes</h1>
        <button className={styles.avatarBtn}>
          <span className={styles.avatarInner} />
        </button>
      </header>

      <div className={styles.scroll}>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} strokeWidth={2} />
        <input
          className={styles.searchInput}
          placeholder="Search for a route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Map placeholder ── */}
      <div className={styles.mapBox}>
        <span className={styles.liveBadge}>LIVE</span>
      </div>

      {/* ── Route list ── */}
      <div className={styles.routeList}>

        {filtered.map((route) => (
          <div key={route.id}
            className={`${styles.routeCard} ${route.expanded ? styles.routeCardExpanded : ""}`}>
            {/* Card header */}
            <button className={styles.cardHeader}
              onClick={() => toggle(route.id)}>
                
              <div className={styles.cardHeaderLeft}>
                {/* colour dot / bus icon */}
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

            {/* Expanded stop list */}
            {route.expanded && (
              <>
                <div className={styles.stopList}>
                  {route.stopList.map((stop, i) => (
                    <div key={i} className={styles.stopRow}>
                      <div className={styles.stopLine}>
                        <span
                          className={`${styles.stopDot} ${i === 0 ? styles.stopDotFilled : ""}`}
                        />
                        {i < route.stopList.length - 1 && (
                          <span className={styles.stopConnector} />
                        )}
                      </div>
                      <span className={styles.stopName}>{stop.name}</span>
                      <span className={styles.stopEta}>{stop.eta}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={styles.detailBtn}
                  style={{ background: route.color }}
                >
                  View Detailed Route
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </>
            )}

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