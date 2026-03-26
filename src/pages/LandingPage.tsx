import { useNavigate } from "react-router-dom";
import {
  Navigation,
  MapPin,
  Clock,
  CalendarCheck,
  Bell,
  ChevronRight,
  Zap,
} from "lucide-react";
import { ROUTES, STOPS } from "../services/mockShuttleData";
import styles from "../styles/LandingPage.module.css";

const FEATURES = [
  {
    icon: <MapPin size={24} strokeWidth={2} />,
    title: "Live GPS Tracking",
    desc: "See every shuttle's exact location on the map, updated in real time.",
  },
  {
    icon: <Clock size={24} strokeWidth={2} />,
    title: "Arrival Estimates",
    desc: "Get precise ETA for your stop so you never have to guess or wait unnecessarily.",
  },
  {
    icon: <CalendarCheck size={24} strokeWidth={2} />,
    title: "Full Schedules",
    desc: "Browse peak-hour timetables for every route — morning, midday, and afternoon.",
  },
  {
    icon: <Bell size={24} strokeWidth={2} />,
    title: "Smart Notifications",
    desc: "Get alerted when your shuttle is approaching or if a route is delayed.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Sign up in seconds",
    desc: "Create your account with your university email — no approval needed.",
  },
  {
    num: "02",
    title: "Choose your route",
    desc: "Pick from the four campus routes and see live shuttle positions.",
  },
  {
    num: "03",
    title: "Track & go",
    desc: "Check ETAs, view stops, and head to your pickup point stress-free.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const routeStopCounts = Object.values(ROUTES).map((r) => ({
    ...r,
    stopCount: STOPS.filter((s) => s.routeId === r.id).length,
  }));

  return (
    <div className={styles.page}>
      {/* ── Floating Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>
            <Navigation size={14} strokeWidth={2.5} color="#ffffff" />
          </span>
          <span className={styles.navName}>Campus Transit</span>
        </div>
        <div className={styles.navActions}>
          <button
            className={styles.navLoginBtn}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            className={styles.navSignupBtn}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroDots} />

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>
            <Zap size={11} strokeWidth={2.5} />
            Real-time campus transportation
          </span>

          <h1 className={styles.heroTitle}>
            Never Miss Your <span>Campus Shuttle</span> Again
          </h1>

          <p className={styles.heroSub}>
            Track all four university shuttle routes live on the map, get
            accurate arrival estimates, and browse full timetables — all in one
            place.
          </p>

          <div className={styles.heroCtas}>
            <button
              className={styles.ctaPrimary}
              onClick={() => navigate("/signup")}
            >
              Start Tracking Free
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>4</span>
            <span className={styles.heroStatLabel}>Active routes</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>
              {STOPS.length}
            </span>
            <span className={styles.heroStatLabel}>Bus stops</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>Live</span>
            <span className={styles.heroStatLabel}>GPS updates</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section}>
        <p className={styles.sectionEyebrow}>
          <span className="energy-bar" />
          Features
        </p>
        <h2 className={styles.sectionTitle}>Everything you need, nothing you don't</h2>
        <p className={styles.sectionSub}>
          Built for students — fast, accurate, and easy to use on the go.
        </p>

        <div className={styles.featuresGrid}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIconWrap}>{icon}</div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Routes ── */}
      <div className={styles.routesSection}>
        <div className={styles.routesSectionInner}>
          <p className={styles.sectionEyebrow}>
            <span className="energy-bar" />
            Campus Routes
          </p>
          <h2 className={styles.sectionTitle}>Four routes across campus</h2>
          <p className={styles.sectionSub}>
            Each route runs on a fixed schedule with live shuttle positions you
            can track in real time.
          </p>

          <div className={styles.routePills}>
            {routeStopCounts.map((route) => (
              <button
                key={route.id}
                className={styles.routePill}
                onClick={() => navigate("/signup")}
                aria-label={`View ${route.name} route`}
              >
                <span
                  className={styles.routePillDot}
                  style={{ background: route.color }}
                />
                <span className={styles.routePillName}>{route.name}</span>
                <span className={styles.routePillMeta}>
                  {route.stopCount} stops
                </span>
                <ChevronRight size={14} strokeWidth={2} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section className={styles.section}>
        <p className={styles.sectionEyebrow}>
          <span className="energy-bar" />
          How it works
        </p>
        <h2 className={styles.sectionTitle}>Up and running in 60 seconds</h2>
        <p className={styles.sectionSub}>
          No configuration, no waiting. Just sign up and start tracking.
        </p>

        <div className={styles.stepsGrid}>
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className={styles.step}>
              <span className={styles.stepNum}>{num}</span>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaSectionTitle}>
          Ready to track your shuttle?
        </h2>
        <p className={styles.ctaSectionSub}>
          Join your fellow students and never wait blindly at a bus stop again.
        </p>
        <div className={styles.ctaSectionBtns}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/signup")}
          >
            Create Free Account
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/login")}
          >
            Already have an account?
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Campus Transit · University Shuttle Tracking
      </footer>
    </div>
  );
}
