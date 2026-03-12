// src/components/map/MapView.jsx
import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl/mapbox";

import RouteLayer from "./RouteLayer";
import BusMarker from "./BusMarker";
import StopMarker from "./StopMarker";
import InfoPopup from "./InfoPopup";
import type { Bus, SelectionType, Stop } from "../../types/shuttle";

import { STOPS, MOCK_BUSES, ROUTE_PATHS } from "../../services/mockShuttleData";
import RouteLegend from "./RouteLegend";

const KNUST_CENTER = { longitude: -1.575, latitude: 6.677, zoom: 15 };

export default function MapView() {
  const [buses, setBuses] = useState<Bus[]>(
    MOCK_BUSES.map((b) => ({ ...b })), // clone so we can mutate pathIndex
  );
  const [selection, setSelection] = useState<SelectionType | null>(null); // { type: 'bus'|'stop', data }
  const animFrameRef = useRef(null);

  // Animate buses — move each bus forward along its path on each tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          const pathLen = ROUTE_PATHS[bus.routeId].length - 1;
          let next = bus.pathIndex + bus.speed;
          if (next >= pathLen) {
            next = 0; // Loop back to the beginning
          }
          return { ...bus, pathIndex: next };
        }),
      );
    }, 100); // update every 100ms = smooth animation

    return () => clearInterval(interval);
  }, []);

  const handleBusClick = (bus: Bus) => setSelection({ type: "bus", data: bus });
  const handleStopClick = (stop: Stop) =>
    setSelection({ type: "stop", data: stop });
  const handleClose = () => setSelection(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={KNUST_CENTER}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Color-coded route lines */}
        <RouteLayer />

        {/* Stop pins */}
        {STOPS.map((stop) => (
          <StopMarker key={stop.id} stop={stop} onClick={handleStopClick} />
        ))}

        {/* Animated bus markers */}
        {buses.map((bus) => (
          <BusMarker key={bus.id} bus={bus} onClick={handleBusClick} />
        ))}

        {/* Click popup — bus or stop */}
        <InfoPopup selection={selection} buses={buses} onClose={handleClose} />
      </Map>
      <RouteLegend />
    </div>
  );
}
