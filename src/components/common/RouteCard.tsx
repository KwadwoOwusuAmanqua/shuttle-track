import { useState } from "react";
import { ChevronDown, ChevronUp, Navigation, MapPin } from "lucide-react";
import type { Route, Stop, Bus } from "../../types/shuttle";

interface RouteCardProps {
  route: Route;
  stops: Stop[];
  buses?: Bus[];
  onViewMap?: (routeId: string) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface-container-lowest)",
  borderRadius: "var(--radius-2xl)",
  overflow: "hidden",
  boxShadow: "var(--shadow-sm)",
  transition: "box-shadow 0.2s",
};

const cardExpandedStyle: React.CSSProperties = {
  ...cardStyle,
  boxShadow: "var(--shadow-md)",
};

export default function RouteCard({
  route,
  stops,
  buses = [],
  onViewMap,
}: RouteCardProps) {
  const [expanded, setExpanded] = useState(false);

  const activeBusCount = buses.filter((b) => b.routeId === route.id).length;

  return (
    <div style={expanded ? cardExpandedStyle : cardStyle}>
      {/* ── Header ─────────────────────────── */}
      <button
        onClick={() => setExpanded((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={expanded}
        aria-label={`${route.name} route details`}
      >
        {/* Left: energy bar + icon + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Energy bar accent */}
          <span
            style={{
              width: 4,
              alignSelf: "stretch",
              borderRadius: 9999,
              background: route.color,
              flexShrink: 0,
              minHeight: 36,
            }}
          />

          {/* Route icon box */}
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-lg)",
              background: route.color + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Navigation size={16} color={route.color} strokeWidth={2.5} />
          </span>

          {/* Name + meta */}
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: "var(--on-surface)",
                letterSpacing: "-0.01em",
              }}
            >
              {route.name}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--on-surface-variant)",
              }}
            >
              {stops.length} stops
              {activeBusCount > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    color: route.color,
                    fontWeight: 600,
                  }}
                >
                  · {activeBusCount} active
                </span>
              )}
            </span>
          </span>
        </div>

        {/* Right: chevron */}
        <span style={{ color: "var(--text-muted)", display: "flex" }}>
          {expanded ? (
            <ChevronUp size={18} strokeWidth={2} />
          ) : (
            <ChevronDown size={18} strokeWidth={2} />
          )}
        </span>
      </button>

      {/* ── Expanded stop list ────────────── */}
      {expanded && (
        <>
          <div style={{ padding: "4px 16px 4px 56px" }}>
            {stops.map((stop, i) => (
              <div
                key={stop.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  minHeight: 36,
                }}
              >
                {/* Dot + connector */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 4,
                    flexShrink: 0,
                    width: 12,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: `2px solid ${route.color}`,
                      background: "var(--surface-container-lowest)",
                      flexShrink: 0,
                    }}
                  />
                  {i < stops.length - 1 && (
                    <span
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 22,
                        background: "rgba(168,175,169,0.40)",
                        marginTop: 2,
                      }}
                    />
                  )}
                </div>

                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: "var(--on-surface)",
                    paddingTop: 2,
                    paddingBottom: i < stops.length - 1 ? 0 : 4,
                  }}
                >
                  {stop.name}
                </span>
              </div>
            ))}
          </div>

          {/* View on map button */}
          {onViewMap && (
            <div style={{ padding: "8px 16px 16px" }}>
              <button
                onClick={() => onViewMap(route.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "var(--radius-xl)",
                  background: route.color,
                  color: "#ffffff",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "filter 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.filter =
                    "brightness(1.1)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.filter = "none")
                }
              >
                <MapPin size={15} strokeWidth={2.5} />
                View on Map
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
