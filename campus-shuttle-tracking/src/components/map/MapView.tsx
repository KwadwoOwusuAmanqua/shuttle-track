import { useState, useEffect } from "react";
import Map from "react-map-gl/mapbox";

import RouteLayer from "./RouteLayer";
import BusMarker from "./BusMarker";
import StopMarker from "./StopMarker";
import InfoPopup from "./InfoPopup";
import type { Bus, SelectionType, Stop } from "../../types/shuttle";

import {
  STOPS,
  MOCK_BUSES,
  ROUTE_PATHS,
  STOP_PATH_INDICES,
  DWELL_TICKS,
} from "../../services/mockShuttleData";
import RouteLegend from "./RouteLegend";
import { getRouteLength, getStopDistance } from "../../utils/calculateETA";

const KNUST_CENTER = { longitude: -1.575, latitude: 6.677, zoom: 15 };

//radius for the bus to be around the stop for it to trigger the dwelling function
const DWELL_TRIGGER_RADIUS = 0.6;

export default function MapView() {
  const [buses, setBuses] = useState<Bus[]>(
    MOCK_BUSES.map((b) => ({ ...b })), // clone so we can mutate pathIndex
  );
  const [selection, setSelection] = useState<SelectionType | null>(null); // { type: 'bus'|'stop', data }

  useEffect(() => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id === "SH-102") {
          return { ...bus, pathIndex: getRouteLength("A") * 0.4 };
        }
        if (bus.id === "SH-302") {
          return { ...bus, pathIndex: getRouteLength("B") * 0.4 };
        }
        return bus;
      }),
    );
  }, []);

  // Animate buses — move each bus forward along its path on each tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          //if bus is at a stop, dwell there and count down
          if (bus.dwellRemaining > 0) {
            return { ...bus, dwellRemaining: bus.dwellRemaining - 1 };
          }

          const total = getRouteLength(bus.routeId);
          const next = (bus.pathIndex + bus.speed) % total;

          //if route is complete, loop back to start
          // if (next >= total) {
          //   next = 0; // Loop back to the beginning
          // }

          // check if the bus has just crossed a stop index so that you can trigger dwell
          const routeStops = STOPS.filter((s) => s.routeId === bus.routeId);
          for (const stop of routeStops) {
            const stopDist = getStopDistance(stop.id, bus.routeId);
            const crossed =
              bus.pathIndex % total < stopDist && next >= stopDist;

            if (crossed) {
              return {
                ...bus,
                pathIndex: stopDist,
                dwellRemaining: DWELL_TICKS,
              };
            }
          }

          return { ...bus, pathIndex: next };
        }),
      );
    }, 100); // update every 100ms

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
