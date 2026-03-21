import { useState, useEffect } from "react";
import { Bell, MapPin, Navigation, Clock, ChevronRight, Users, CalendarCheck, X, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES, STOPS } from "../services/mockShuttleData";
import { getClosestBusToStop } from "../utils/calculateETA";
import '../styles/home.css';
import { useShuttleBuses } from "../hooks/useShuttleBuses";


const HomePage = () => {

  const navigate = useNavigate();
  const buses= useShuttleBuses();
 
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const openSheet = () => {
    setSelectedRouteId(null);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setSelectedRouteId(null);
  };

  const routeStops = selectedRouteId
    ? STOPS.filter((s) => s.routeId === selectedRouteId).sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="home-page">
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="brand">
          <span className="brandIcon">
            <Navigation size={16} strokeWidth={2.5} color="#fff" />
          </span>
          <span className="brandName">Campus Transit</span>
        </div>
        <button className="avatarBtn" aria-label="Notifications">
          <span className="avatarInner">
          {/* profile name */}PN
          </span>
        </button>
      </header>

      {/* ── Scrollable content ── */}
      <div className="scroll">
        {/* Hero banner */}
        <section className="hero">
          <div className="heroBg" />
          <div className="heroContent">
            <h2 className="heroHeading">Track Campus Shuttles in Real Time</h2>
            <p className="heroSub">Live updates for all university routes and stops.</p>
            <button className="heroBtn" onClick={() => navigate("/map")}>
              <Navigation size={14} strokeWidth={2.5} />
              Track Now
            </button>
          </div>
        </section>

        {/* Quick Features */}
        <section className="section">
          <h3 className="sectionTitle">Quick Features</h3>
          <div className="featureList">
            <button className="featureRow" onClick={() => navigate("/map")}>
              <span className="featureIcon"><MapPin size={20} /></span>
              <span className="featureText">
                <span className="featureTitle">Live Tracking</span>
                <span className="featureSub">Precise GPS shuttle locations</span>
              </span>
              <ChevronRight size={18} className="featureChevron" strokeWidth={2} />
            </button>

            <button className="featureRow" onClick={() => navigate("/schedule")}>
              <span className="featureIcon"><CalendarCheck size={20} /></span>
              <span className="featureText">
                <span className="featureTitle">Schedule</span>
                <span className="featureSub">Schedules and detour alerts</span>
              </span>
              <ChevronRight size={18} className="featureChevron" strokeWidth={2} />
            </button>

            <button className="featureRow" onClick={openSheet}>
              <span className="featureIcon"><Clock size={20} /></span>
              <span className="featureText">
                <span className="featureTitle">Estimated Arrival</span>
                <span className="featureSub">Wait times for your stop</span>
              </span>
              <ChevronRight size={18} className="featureChevron" strokeWidth={2} />
            </button>
          </div>
        </section>

        {/* Recent Shuttle Activity */}
        <section className="section">
          <div className="sectionHeader">
            <h3 className="sectionTitle">Recent Shuttle Activity</h3>
            <button className="viewAll">View All</button>
          </div>
          <div className="activityCard">
            <div className="activityHeader">
              <div className="activityBusIcon">
                <Navigation size={14} color="#2b35af" strokeWidth={2.5} />
              </div>
              <div className="activityInfo">
                <span className="activityRoute">Blue Line • Bus #24</span>
                <span className="activityLocation">Arrived at Main Quad</span>
              </div>
              <span className="onTimeBadge">ON TIME</span>
            </div>
            <div className="mapPlaceholder" />
            <div className="activityFooter">
              <span className="footerStat">
                <Users size={13} strokeWidth={2} />
                12
                <span className="footerLabel">Passengers</span>
              </span>
              <span className="footerTime">2 mins ago</span>
            </div>
          </div>
        </section>

        <div className="bottomPad" />
      </div>

      {/* ── Backdrop ── */}
      {sheetOpen && <div className="sheetBackdrop" onClick={closeSheet} />}

      {/* ── Estimated Arrival bottom sheet ── */}
      <div className={`etaSheet ${sheetOpen ? "etaSheetOpen" : ""}`}>
        <div className="sheetHandle" />

        {/* Sheet header */}
        <div className="sheetHeader">
          {selectedRouteId ? (
            <button className="sheetBack" onClick={() => setSelectedRouteId(null)}>
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="sheetBackPlaceholder" />
          )}
          <div className="sheetHeaderText">
            <h3 className="sheetTitle">Estimated Arrival</h3>
            <p className="sheetSub">
              {selectedRouteId ? ROUTES[selectedRouteId].name : "Select a route"}
            </p>
          </div>
          <button className="sheetClose" onClick={closeSheet}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Step 1 — Route picker */}
        {!selectedRouteId && (
          <div className="sheetRouteList">
            {Object.values(ROUTES).map((route) => (
              <button
                key={route.id}
                className="sheetRouteRow"
                onClick={() => setSelectedRouteId(route.id)}
              >
                <span className="sheetRouteDot" style={{ background: route.color }} />
                <span className="sheetRouteInfo">
                  <span className="sheetRouteName">{route.name}</span>
                  <span className="sheetRouteMeta">
                    {STOPS.filter(s => s.routeId === route.id).length} stops •{" "}
                    {buses.filter(b => b.routeId === route.id).length} shuttles active
                  </span>
                </span>
                <ChevronRight size={16} strokeWidth={2} color="#b0b4c8" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Stop ETAs */}
        {selectedRouteId && (
          <div className="sheetStopList">
            {routeStops.map((stop) => {
              const result = getClosestBusToStop(
                stop,
                buses.filter(b => b.routeId === selectedRouteId)
              );
              const eta = result?.etaMinutes ?? null;
              const route = ROUTES[selectedRouteId];

              return (
                <div key={stop.id} className="sheetStopRow">
                  <span
                    className="sheetStopDot"
                    style={{ borderColor: route.color }}
                  />
                  <span className="sheetStopName">{stop.name}</span>
                  {eta !== null ? (
                    <span
                      className="sheetEtaBadge"
                      style={{
                        background: eta <= 3 ? "#dcfce7" : eta <= 8 ? "#fef9c3" : "#f1f5f9",
                        color: eta <= 3 ? "#16a34a" : eta <= 8 ? "#d97706" : "#64748b",
                      }}
                    >
                      {eta} min
                    </span>
                  ) : (
                    <span className="sheetEtaNone">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;