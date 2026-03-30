import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, MapPin, Bell, Leaf, CalendarDays, Users, Navigation, Clock, Home, Map } from "lucide-react";
import { ROUTES, STOPS } from "../services/mockShuttleData";
import styles from "../styles/LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const routeStopCounts = Object.values(ROUTES).map((r) => ({
    ...r,
    stopCount: STOPS.filter((s) => s.routeId === r.id).length,
  }));

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <span className={styles.navBrand}>Campus Transit</span>

          <div className={styles.navActions}>
            <button className={styles.navSignIn} onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className={styles.navCta} onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            {/* Left: text */}
            <div className={styles.heroLeft}>
              <div className={styles.liveChip}>
                <Zap size={13} strokeWidth={2.5} />
                <span>Live Tracking Now Active</span>
              </div>

              <h1 className={styles.heroTitle}>
                Never Miss Your{" "}
                <span className={styles.heroTitleAccent}>Campus Shuttle</span>{" "}
                Again
              </h1>

              <p className={styles.heroSub}>
                Real-time tracking, accurate schedules, and intelligent route
                planning designed for the modern student. Experience the future
                of campus transit.
              </p>

              <div className={styles.heroCtas}>
                <button
                  className={styles.ctaGradient}
                  onClick={() => navigate("/signup")}
                >
                  Track Live Now
                  <ArrowRight size={20} strokeWidth={2.5} />
                </button>

                <div className={styles.avatarRow}>
                  <div className={styles.avatarStack}>
                    <div className={`${styles.avatar} ${styles.avatarLetter}`} style={{ background: "#006b12" }}>A</div>
                    <div className={`${styles.avatar} ${styles.avatarLetter}`} style={{ background: "#2980b9" }}>K</div>
                    <div className={`${styles.avatar} ${styles.avatarLetter}`} style={{ background: "#8e44ad" }}>M</div>
                    <div className={styles.avatarCount}>+2k</div>
                  </div>
                  <span className={styles.avatarLabel}>Joined the flow</span>
                </div>
              </div>
            </div>

            {/* Right: visual */}
            <div className={styles.heroRight}>
              <div className={styles.heroBgTint} />
              <div className={styles.heroImageWrap}>
                <img
                  className={styles.heroImage}
                  src="/shuttle.jpg"
                  alt="Campus shuttle bus"
                />

                {/* Glass arrival card */}
                <div className={styles.arrivalCard}>
                  <div className={styles.arrivalCardTop}>
                    <div className={styles.arrivalLive}>
                      <span className={styles.arrivalPulse} />
                      <span className={styles.arrivalRoute}>Main Campus Express</span>
                    </div>
                    <span className={styles.arrivalEta}>Arriving in 2m</span>
                  </div>
                  <div className={styles.arrivalBar}>
                    <div className={styles.arrivalBarFill} />
                  </div>
                </div>

                {/* Floating mini map */}
                <div className={styles.miniMap}>
                  <MapPin size={22} strokeWidth={2} color="var(--primary)" className={styles.miniMapPin} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bento Features ── */}
        <section id="features" className={styles.bentoSection}>
          <div className={styles.bentoGrid}>
            {/* Large: Live Map */}
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoBgIcon}>
                <MapPin size={280} strokeWidth={0.3} color="var(--primary)" />
              </div>
              <h3 className={styles.bentoTitle}>Live Tracking Map</h3>
              <p className={styles.bentoDesc}>
                See every shuttle's exact location in real-time. Our GPS
                integration provides sub-meter accuracy so you can plan your
                walk down to the second.
              </p>
              <div className={styles.bentoBadges}>
                <span className={styles.bentoBadge}>
                  <span className={styles.bentoBadgeDot} />
                  99.9% Up-time
                </span>
                <span className={styles.bentoBadge}>
                  <Zap size={12} strokeWidth={2.5} color="var(--primary)" />
                  Low Latency
                </span>
              </div>
            </div>

            {/* Green: Smart Alerts */}
            <div className={`${styles.bentoCard} ${styles.bentoGreen}`}>
              <Bell size={44} strokeWidth={1.5} color="var(--on-primary)" />
              <div>
                <h3 className={`${styles.bentoTitle} ${styles.bentoTitleWhite}`}>
                  Smart Alerts
                </h3>
                <p className={styles.bentoDescWhite}>
                  Get notified 5 minutes before your preferred shuttle reaches
                  your stop. Never wait in the cold again.
                </p>
              </div>
            </div>

            {/* Small: Impact */}
            <div className={`${styles.bentoCard} ${styles.bentoSmall}`}>
              <div className={styles.bentoSmallIcon}>
                <Leaf size={22} strokeWidth={1.5} color="var(--primary)" />
              </div>
              <h4 className={styles.bentoSmallTitle}>Impact Score</h4>
              <p className={styles.bentoSmallDesc}>
                Track how much CO₂ you're saving by choosing public transit over
                ride-shares.
              </p>
            </div>

            {/* Small: Routes */}
            <div className={`${styles.bentoCard} ${styles.bentoSmallAlt}`}>
              <div className={styles.bentoSmallIcon}>
                <CalendarDays size={22} strokeWidth={1.5} color="var(--primary)" />
              </div>
              <h4 className={styles.bentoSmallTitle}>Future Routes</h4>
              <p className={styles.bentoSmallDesc}>
                Check upcoming schedules and holiday routes weeks in advance
                with 100% confidence.
              </p>
            </div>

            {/* Small: Crowd */}
            <div className={`${styles.bentoCard} ${styles.bentoSmallTeal}`}>
              <div className={styles.bentoSmallIcon}>
                <Users size={22} strokeWidth={1.5} color="var(--secondary)" />
              </div>
              <h4 className={styles.bentoSmallTitle}>Crowd Logic</h4>
              <p className={styles.bentoSmallDesc}>
                See real-time occupancy levels. Know if your shuttle is full
                before it even arrives.
              </p>
            </div>
          </div>
        </section>

        {/* ── Routes ── */}
        <section id="routes" className={styles.routesSection}>
          <div className={styles.routesInner}>
          <p className={styles.sectionEyebrow}>Campus Routes</p>
          <h2 className={styles.sectionTitle}>Four routes across campus</h2>
          <p className={styles.sectionSub}>
            Each route runs on a fixed schedule with live shuttle positions.
          </p>
          <div className={styles.routeCarousel}>
            {routeStopCounts.map((route) => (
              <button
                key={route.id}
                className={styles.routeCard}
                onClick={() => navigate("/signup")}
              >
                <div className={styles.routeCardAccent} style={{ background: route.color }} />
                <div className={styles.routeCardBody}>
                  <span className={styles.routeDot} style={{ background: route.color }} />
                  <span className={styles.routeName}>{route.name}</span>
                  <span className={styles.routeMeta}>{route.stopCount} stops</span>
                  <span
                    className={styles.routeLive}
                    style={{ color: route.color, background: `${route.color}18` }}
                  >
                    LIVE
                  </span>
                </div>
                <ArrowRight size={15} strokeWidth={2.5} className={styles.routeArrow} />
              </button>
            ))}
          </div>
          </div>
        </section>

        {/* ── Dark CTA ── */}
        <section className={styles.darkCta}>
          <div className={styles.darkCtaInner}>
            <div className={styles.darkCtaBlur1} />
            <div className={styles.darkCtaBlur2} />
            <div className={styles.darkCtaGrid}>
              <div className={styles.darkCtaLeft}>
                <h2 className={styles.darkCtaTitle}>
                  Join {STOPS.length > 0 ? "15,000+" : "thousands of"} Students Moving Smarter.
                </h2>
                <p className={styles.darkCtaSub}>
                  Sign up today and transform your campus commute into a
                  seamless experience — no more guessing, no more waiting.
                </p>
                <div className={styles.darkCtaBtns}>
                  <button
                    className={styles.darkCtaBtnWhite}
                    onClick={() => navigate("/signup")}
                  >
                    Create Free Account
                  </button>
                  <button
                    className={styles.darkCtaBtnGhost}
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              <div className={styles.darkCtaRight}>
                {/* App preview mockup */}
                <div className={styles.phoneMockup}>
                  {/* Status bar */}
                  <div className={styles.appStatusBar}>
                    <span className={styles.appTime}>9:41</span>
                    <div className={styles.appStatusIcons}>
                      <span className={styles.appSignal} />
                      <span className={styles.appBattery} />
                    </div>
                  </div>

                  {/* Map area */}
                  <div className={styles.appMap}>
                    <div className={styles.appMapGrid} />
                    <svg className={styles.appMapSvg} viewBox="0 0 220 160" fill="none">
                      <path d="M20 130 Q60 60 110 80 T200 40" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                      <path d="M10 40 Q80 110 140 70 T210 120" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                      <path d="M30 150 Q100 50 180 90" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    </svg>
                    {/* Live bus dot */}
                    <div className={styles.appBusDot}>
                      <div className={styles.appBusDotRing} />
                      <Navigation size={9} color="#fff" strokeWidth={2.5} />
                    </div>
                    {/* Stop pins */}
                    <div className={styles.appStopPin} style={{ top: "28%", left: "18%" }} />
                    <div className={styles.appStopPin} style={{ top: "55%", left: "46%" }} />
                    <div className={styles.appStopPin} style={{ top: "35%", left: "72%" }} />
                    {/* ETA chip */}
                    <div className={styles.appEtaChip}>
                      <span className={styles.appEtaPulse} />
                      2 min
                    </div>
                  </div>

                  {/* Bottom sheet */}
                  <div className={styles.appSheet}>
                    <div className={styles.appSheetHandle} />
                    <p className={styles.appSheetTitle}>Next arrivals</p>
                    {[
                      { color: "#c0392b", name: "Route A · Main Gate", eta: "2 min" },
                      { color: "#2980b9", name: "Route B · Library",   eta: "5 min" },
                      { color: "#27ae60", name: "Route D · Hostels",   eta: "9 min" },
                    ].map((item) => (
                      <div key={item.name} className={styles.appArrivalRow}>
                        <span className={styles.appArrivalDot} style={{ background: item.color }} />
                        <span className={styles.appArrivalName}>{item.name}</span>
                        <span className={styles.appArrivalEta}>{item.eta}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom nav */}
                  <div className={styles.appBottomNav}>
                    <div className={`${styles.appNavItem} ${styles.appNavActive}`}>
                      <Home size={16} strokeWidth={2} />
                    </div>
                    <div className={styles.appNavItem}>
                      <Map size={16} strokeWidth={2} />
                    </div>
                    <div className={styles.appNavItem}>
                      <Clock size={16} strokeWidth={2} />
                    </div>
                    <div className={styles.appNavItem}>
                      <Bell size={16} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerBrand}>Campus Transit</p>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} Campus Transit. Velocity in Stillness.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a className={styles.footerLink} href="#">Privacy Policy</a>
            <a className={styles.footerLink} href="#">Terms of Service</a>
            <a className={styles.footerLink} href="#">Campus Map</a>
            <a className={styles.footerLink} href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
