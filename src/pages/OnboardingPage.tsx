import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OnboardingPage.module.css";

const SLIDES = [
  {
    icon: (
      <svg viewBox="0 0 96 96" fill="none" className={styles.slideIcon}>
        <rect width="96" height="96" rx="28" fill="rgba(0,107,10,0.10)" />
        <rect x="14" y="36" width="68" height="38" rx="8" fill="rgba(0,107,10,0.15)" />
        <rect x="14" y="36" width="68" height="38" rx="8" stroke="rgba(0,107,10,0.35)" strokeWidth="2" />
        <rect x="24" y="28" width="48" height="16" rx="6" fill="rgba(0,107,10,0.20)" />
        <circle cx="26" cy="78" r="7" fill="rgba(0,107,10,0.8)" />
        <circle cx="70" cy="78" r="7" fill="rgba(0,107,10,0.8)" />
        <rect x="30" y="46" width="36" height="8" rx="3" fill="rgba(0,107,10,0.5)" />
        <rect x="36" y="58" width="24" height="6" rx="3" fill="rgba(0,107,10,0.3)" />
        <circle cx="80" cy="22" r="10" fill="rgba(0,107,10,0.15)" />
        <path d="M80 17v5l3 3" stroke="rgba(0,107,10,0.7)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Never Miss Your Shuttle",
    desc: "Plan your commute perfectly with real-time arrivals and route updates across campus.",
  },
  {
    icon: (
      <svg viewBox="0 0 96 96" fill="none" className={styles.slideIcon}>
        <rect width="96" height="96" rx="28" fill="rgba(0,107,10,0.10)" />
        <rect x="14" y="14" width="68" height="68" rx="12" fill="rgba(0,107,10,0.08)" />
        {/* grid lines */}
        {[28,42,56,70].map(x => (
          <line key={x} x1={x} y1="14" x2={x} y2="82" stroke="rgba(0,107,10,0.12)" strokeWidth="1"/>
        ))}
        {[28,42,56,70].map(y => (
          <line key={y} x1="14" y1={y} x2="82" y2={y} stroke="rgba(0,107,10,0.12)" strokeWidth="1"/>
        ))}
        {/* route line */}
        <path d="M20 70 Q35 30 50 48 T80 28" stroke="rgba(0,107,10,0.6)" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="6 3"/>
        {/* pin */}
        <circle cx="50" cy="48" r="10" fill="rgba(0,107,10,0.15)" />
        <circle cx="50" cy="45" r="6" fill="rgba(0,107,10,0.9)" />
        <path d="M50 51 L50 58" stroke="rgba(0,107,10,0.9)" strokeWidth="3" strokeLinecap="round" />
        {/* pulse ring */}
        <circle cx="50" cy="45" r="13" stroke="rgba(0,107,10,0.3)" strokeWidth="2" />
      </svg>
    ),
    title: "Live GPS Tracking",
    desc: "Real-time updates on every shuttle's precise location across the campus map.",
  },
  {
    icon: (
      <svg viewBox="0 0 96 96" fill="none" className={styles.slideIcon}>
        <rect width="96" height="96" rx="28" fill="rgba(0,107,10,0.10)" />
        {/* clock face */}
        <circle cx="48" cy="44" r="26" fill="white" stroke="rgba(0,107,10,0.25)" strokeWidth="2"/>
        <circle cx="48" cy="44" r="22" fill="rgba(0,107,10,0.05)" />
        <path d="M48 28 L48 44 L58 44" stroke="rgba(0,107,10,0.85)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="48" cy="44" r="3" fill="rgba(0,107,10,0.85)" />
        {/* ETA badge */}
        <rect x="20" y="72" width="56" height="20" rx="10" fill="rgba(0,107,10,0.9)" />
        <text x="48" y="86" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">2 min away</text>
      </svg>
    ),
    title: "Get ETA at Every Stop",
    desc: "Say goodbye to waiting. Get accurate estimated arrival times for any bus stop.",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  function finish(path: string) {
    localStorage.setItem("campus_shuttle_onboarded", "1");
    navigate(path, { replace: true });
  }

  function next() {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      finish("/landing");
    }
  }

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarSpacer} />
        <span className={styles.brand}>Campus Shuttle</span>
        <button className={styles.skip} onClick={() => finish("/landing")}>
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className={styles.slideWrap}>
        <div className={styles.iconWrap}>{slide.icon}</div>

        <div className={styles.textBlock}>
          <h2 className={styles.title}>{slide.title}</h2>
          <p className={styles.desc}>{slide.desc}</p>
        </div>

        {/* Progress dots */}
        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={next}>
            {isLast ? "Get Started" : "Next"}
          </button>
          {isLast && (
            <button className={styles.btnGhost} onClick={() => finish("/login")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
