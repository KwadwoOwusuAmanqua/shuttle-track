import type { Route } from "../../types/shuttle";

interface Props {
  routes: Record<string, Route>;
}

export default function RouteLegend({ routes }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        left: 16,
        backgroundColor: "white",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        zIndex: 10,
        minWidth: 180,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        ROUTES
      </p>
      {Object.values(routes).map((route) => (
        <div
          key={route.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 4,
              borderRadius: 2,
              backgroundColor: route.color,
            }}
          />
          <span style={{ fontSize: 13, color: "#1e293b" }}>
            {route.id} — {route.name}
          </span>
        </div>
      ))}
    </div>
  );
}
