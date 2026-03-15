import { Marker } from "react-map-gl/mapbox";
import type { Stop, Route } from "../../types/shuttle";

interface Props {
  stop: Stop;
  routes: Record<string, Route>;
  onClick: (stop: Stop) => void;
}

export default function StopMarker({ stop, routes, onClick }: Props) {
  const route = routes[stop.routeId];

  return (
    <Marker
      longitude={stop.coords.lng}
      latitude={stop.coords.lat}
      anchor="bottom"
    >
      <div
        onClick={() => onClick(stop)}
        title={stop.name}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "white",
          border: `3px solid ${route?.color ?? "#94a3b8"}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      />
    </Marker>
  );
}
