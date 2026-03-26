import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Sun, Sunset, Moon, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { ROUTES, STOPS } from "../../services/mockShuttleData";
import { SCHEDULE_DATA } from '../../services/scheduleData';
import styles from "../../styles/SchedulePage.module.css";
import Colors from "../../theme/colors";


function PeriodIcon({ icon }) {
  if (icon === "sun") return <Sun size={14} strokeWidth={2} />;
  if (icon === "sunset") return <Sunset size={14} strokeWidth={2} />;
  return <Moon size={14} strokeWidth={2} />;
}

function format12(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function SchedulePage() {

  const navigate = useNavigate();
  const routes = Object.values(ROUTES);
  const [activeRouteId, setActiveRouteId] = useState(routes[0].id);
  const [expandedPeriod, setExpandedPeriod] = useState("Morning");

  const activeRoute = ROUTES[activeRouteId];
  const schedule = SCHEDULE_DATA[activeRouteId];
  const stopCount = STOPS.filter((s) => s.routeId === activeRouteId).length;

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className={styles.headerCenter}>
          <h1 className={styles.headerTitle}>Schedule</h1>
          <span className={styles.headerSub}>Campus Transit</span>
        </div>
        <div className={styles.headerRight} />
      </header>

      <div className={styles.routePills}>
        {routes.map((route) => (
          <button
            key={route.id}
            className={`${styles.pill} ${activeRouteId === route.id ? styles.pillActive : ""}`}
            style={activeRouteId === route.id ? { background: route.color, borderColor: route.color } : { borderColor: route.color, color: route.color }}
            onClick={() => { setActiveRouteId(route.id); setExpandedPeriod("Morning"); }}
          >
            {route.id}
          </button>
        ))}
      </div>

      <div className={styles.scroll}>

        <div className={styles.routeCard} style={{ borderLeftColor: activeRoute.color }}>
          <div className={styles.routeCardTop}>
            <div
              className={styles.routeBadge}
              style={{ background: activeRoute.color + "18", color: activeRoute.color }}
            >
              <span
                className={styles.routeBadgeDot}
                style={{ background: activeRoute.color }}
              />
              Route {activeRoute.id}
            </div>
            <span className={styles.stopCount}>{stopCount} stops</span>
          </div>
          <h2 className={styles.routeName}>{activeRoute.name}</h2>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>First Shuttle</span>
              <span className={styles.statValue}>{schedule.firstShuttle}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Last Shuttle</span>
              <span className={styles.statValue}>{schedule.lastShuttle}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Every</span>
              <span className={styles.statValue}>{schedule.frequency} min</span>
            </div>
          </div>

          {/* Peak hours */}
          <div className={styles.peakRow}>
            <Clock size={13} strokeWidth={2} color={activeRoute.color} />
            <span className={styles.peakText}>
              Peak every <strong>{schedule.peakFrequency} min</strong> — {schedule.peakHours}
            </span>
          </div>
        </div>

        {/* ── Notice banner ── */}
        {schedule.notice && (
          <div className={styles.notice}>
            <AlertCircle size={14} strokeWidth={2} />
            <span>{schedule.notice}</span>
          </div>
        )}

        {/* ── Time slots accordion ── */}
        <div className={styles.sectionTitle}>Departure Times</div>

        {schedule.timeSlots.map((slot) => {
          const isOpen = expandedPeriod === slot.period;
          return (
            <div key={slot.period} className={styles.accordion}>
              <button
                className={`${styles.accordionHeader} ${isOpen ? styles.accordionHeaderOpen : ""}`}
                style={isOpen ? { borderLeftColor: activeRoute.color } : {}}
                onClick={() => setExpandedPeriod(isOpen ? null : slot.period)}
              >
                <span className={styles.accordionLeft}>
                  <span
                    className={styles.periodIcon}
                    style={isOpen ? { color: activeRoute.color, background: activeRoute.color + "18" } : {}}
                  >
                    <PeriodIcon icon={slot.icon} />
                  </span>
                  <span className={styles.accordionInfo}>
                    <span className={styles.periodName}>{slot.period}</span>
                    <span className={styles.periodRange}>{slot.label}</span>
                  </span>
                </span>
                <span className={styles.accordionMeta}>
                  <span className={styles.timeCount}>{slot.times.length} trips</span>
                  {isOpen
                    ? <ChevronUp size={16} strokeWidth={2} />
                    : <ChevronDown size={16} strokeWidth={2} />
                  }
                </span>
              </button>

              {isOpen && (
                <div className={styles.timeGrid}>
                  {slot.times.map((t) => (
                    <span key={t} className={styles.timeChip}
                      style={{ borderColor: activeRoute.color + "40", color: Colors.textPrimary }}>
                      {format12(t)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className={styles.bottomPad} />
      </div>
    </div>
  );
}
