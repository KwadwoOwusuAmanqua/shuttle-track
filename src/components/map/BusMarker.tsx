import { Marker } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import { getBusPosition } from "../../utils/calculateETA";
import type { Bus } from "../../types/shuttle";
import Colors from "../../theme/colors";

interface Props {
  bus: Bus;
  onClick: (bus: Bus) => void;
}

export default function BusMarker({ bus, onClick }: Props) {
  const [lng, lat] = getBusPosition(bus);
  const route = ROUTES[bus.routeId];
  const isDwelling = bus.dwellRemaining > 0;

  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(bus);
        }}
        style={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <div
          onClick={() => onClick(bus)}
          title={bus.name}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: route.color,
            border: `3px solid ${Colors.surface_container_lowest}`,
            boxShadow: isDwelling
              ? `0 0 0 4px ${route.color}44`
              : `0 2px 8px rgba(0,14,36,0.4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            transition: "transform 0.1s ease",
          }}
        >
          🚌
        </div>
      </div>
    </Marker>
  );
}
