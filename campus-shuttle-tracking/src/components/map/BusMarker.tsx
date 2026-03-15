import { Marker } from "react-map-gl/mapbox";
import { getBusPosition } from "../../utils/calculateETA";
import type { Bus, Route } from "../../types/shuttle";

interface Props {
  bus: Bus;
  routes: Record<string, Route>;
  routePaths: Record<string, { lat: number; lng: number }[]>;
  onClick: (bus: Bus) => void;
}

export default function BusMarker({ bus, routes, routePaths, onClick }: Props) {
  const { lat, lng } = getBusPosition(bus, routePaths);
  const route = routes[bus.routeId];

  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <div
        onClick={() => onClick(bus)}
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
            backgroundColor: route?.color ?? "#94a3b8",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
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
