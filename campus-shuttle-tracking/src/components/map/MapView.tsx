import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl/mapbox";
import RouteFilter from "./RouteFilter";
import RouteLayer from "./RouteLayer";
import BusMarker from "./BusMarker";
import StopMarker from "./StopMarker";
import InfoPopup from "./InfoPopup";
import type { Bus, SelectionType, Stop, StopCrowds } from "../../types/shuttle";

import {
  STOPS,
  MOCK_BUSES,
  DWELL_TICKS,
  STOP_PATH_INDICES,
} from "../../services/mockShuttleData";
import RouteLegend from "./RouteLegend";
import { getRouteLength, getStopDistance } from "../../utils/calculateETA";
import {
  initCrowds,
  tickCrowds,
  getDwellingStopIds,
} from "../../utils/crowdSim";

const KNUST_CENTER = { longitude: -1.575, latitude: 6.677, zoom: 15 };

//radius for the bus to be around the stop for it to trigger the dwelling function

export default function MapView() {
  const [buses, setBuses] = useState<Bus[]>(
    MOCK_BUSES.map((b) => ({ ...b })), // clone so we can mutate pathIndex
  );
  const [selection, setSelection] = useState<SelectionType | null>(null);
  const [crowds, setCrowds] = useState<StopCrowds>(initCrowds);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  //use a ref to track latest bus states inside the crowd simulation interval without needing to add buses as a dependency
  const busesRef = useRef(buses);
  useEffect(() => {
    busesRef.current = buses;
  }, [buses]);

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

          // check if the bus has just crossed a stop index so that you can trigger dwell
          const routeStops = STOPS.filter((s) => s.routeId === bus.routeId);
          for (const stop of routeStops) {
            const stopDist = getStopDistance(stop.id, bus.routeId);
            const currentPos = bus.pathIndex % total;
            const didNotWrap = next > currentPos;
            const crossed = didNotWrap
              ? currentPos < stopDist && stopDist <= next
              : currentPos < stopDist || stopDist <= next; // account for wraparound

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

  //Crowd Simulation — update crowds every 3 seconds based on bus dwell and random arrivals/departures
  useEffect(() => {
    const interval = setInterval(() => {
      const dwellingIds = getDwellingStopIds(
        busesRef.current,
        STOP_PATH_INDICES,
      );
      setCrowds((prev) => tickCrowds(prev, dwellingIds));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBusClick = (bus: Bus) => setSelection({ type: "bus", data: bus });
  const handleStopClick = (stop: Stop) =>
    setSelection({ type: "stop", data: stop });
  const handleClose = () => setSelection(null);

  //Filter buses and stops by clicking active route
  const visibleBuses = activeRoute
    ? buses.filter((b) => b.routeId === activeRoute)
    : buses;
  const visibleStops = activeRoute
    ? STOPS.filter((s) => s.routeId === activeRoute)
    : STOPS;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={KNUST_CENTER}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={handleClose}
      >
        {/* Color-coded route lines */}
        <RouteLayer activeRoute={activeRoute} />

        {/* Stop pins */}
        {visibleStops.map((stop) => (
          <StopMarker key={stop.id} stop={stop} onClick={handleStopClick} />
        ))}

        {/* Animated bus markers */}
        {visibleBuses.map((bus) => (
          <BusMarker key={bus.id} bus={bus} onClick={handleBusClick} />
        ))}

        {/* Click popup — bus or stop */}
        {selection && (
          <InfoPopup
            selection={selection}
            buses={buses}
            crowds={crowds}
            onClose={() => setSelection(null)}
          />
        )}
      </Map>
      <RouteFilter activeRoute={activeRoute} onSelect={setActiveRoute} />
      <RouteLegend activeRoute={activeRoute} />
    </div>
  );
}
