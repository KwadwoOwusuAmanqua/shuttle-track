import { Marker } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import type { Stop } from "../../types/shuttle";

interface Props {
  stop: Stop;
  onClick: (stop: Stop) => void;
}

export default function StopMarker({ stop, onClick }: Props) {
  const route = ROUTES[stop.routeId];

  return (
    <Marker
      longitude={stop.coords[0]}
      latitude={stop.coords[1]}
      anchor="center"
    >
      <div
        onClick={() => onClick(stop)}
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
          onClick={() => onClick(stop)}
          title={stop.name}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "white",
            border: `3px solid ${route.color}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        />
      </div>
    </Marker>
  );
}
