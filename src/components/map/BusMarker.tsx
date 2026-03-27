import { Marker } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import { getBusPosition } from "../../utils/calculateETA";
import type { Bus } from "../../types/shuttle";

interface Props {
  bus: Bus;
  onClick: (bus: Bus) => void;
}

const ROUTE_ICONS: Record<string, string> = {
  A: "/icons/red.png",
  B: "/icons/blue.png",
  C: "/icons/yellow.png",
  D: "/icons/green.png",
};

export default function BusMarker({ bus, onClick }: Props) {
  const [lng, lat] = getBusPosition(bus);
  const route = ROUTES[bus.routeId];
  const isDwelling = bus.dwellRemaining > 0;
  const icon = ROUTE_ICONS[bus.routeId] ?? "/icons/red.png";

  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(bus);
        }}
        title={bus.name}
        style={{
          cursor: "pointer",
          filter: isDwelling
            ? `drop-shadow(0 0 8px ${route.color}cc)`
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
          transform: isDwelling ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.2s ease, filter 0.2s ease",
          width: 52,
          height: 52,
        }}
      >
        <img
          src={icon}
          alt={`${route.name} bus`}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </Marker>
  );
}
