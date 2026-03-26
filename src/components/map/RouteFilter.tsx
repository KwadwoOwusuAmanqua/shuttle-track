import { ROUTES } from "../../services/mockShuttleData";
import Colors from "../../theme/colors";

interface Props {
  activeRoute: string | null;
  onSelect: (routeId: string | null) => void;
}

export default function RouteFilter({ activeRoute, onSelect }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        zIndex: 10,
        padding: "0 16px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* "All" pill */}
      <button
        onClick={() => onSelect(null)}
        style={{
          padding: "7px 14px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 700,
          backgroundColor: activeRoute === null ? Colors.primary : Colors.surface_container,
          color: activeRoute === null ? Colors.on_primary : Colors.textMuted,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
          transition: "all 0.2s ease",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        All Routes
      </button>

      {Object.values(ROUTES).map((route) => {
        const isSelected = activeRoute === route.id;

        return (
          <button
            key={route.id}
            onClick={() => onSelect(isSelected ? null : route.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `2px solid ${route.color}`,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: isSelected ? route.color : Colors.surface_container,
              color: isSelected ? Colors.surface : route.color,
              boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
              transition: "all 0.2s ease",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {route.id}
          </button>
        );
      })}
    </div>
  );
}
