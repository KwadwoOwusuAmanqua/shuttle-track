import { useState, useEffect } from "react";
import { MOCK_BUSES, STOPS, DWELL_TICKS } from "../services/mockShuttleData";
import { getRouteLength, getStopDistance } from "../utils/calculateETA";

export function useShuttleBuses() {
  const [buses, setBuses] = useState(MOCK_BUSES.map(b => ({ ...b })));

  // offset two buses on mount
  useEffect(() => {
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id === "SH-102") return { ...bus, pathIndex: getRouteLength("A") * 0.4 };
        if (bus.id === "SH-302") return { ...bus, pathIndex: getRouteLength("B") * 0.4 };
        return bus;
      })
    );
  }, []);

  // animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.dwellRemaining > 0) return { ...bus, dwellRemaining: bus.dwellRemaining - 1 };
          const total = getRouteLength(bus.routeId);
          const next = (bus.pathIndex + bus.speed) % total;
          const routeStops = STOPS.filter((s) => s.routeId === bus.routeId);
          for (const stop of routeStops) {
            const stopDist = getStopDistance(stop.id, bus.routeId);
            const current = bus.pathIndex % total;
            const didNotWrap = next > current;
            const crossed = didNotWrap
              ? current < stopDist && stopDist <= next
              : current < stopDist || stopDist <= next;
            if (crossed) return { ...bus, pathIndex: stopDist, dwellRemaining: DWELL_TICKS };
          }
          return { ...bus, pathIndex: next };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return buses;
}