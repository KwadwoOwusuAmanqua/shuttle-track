import { STOPS, ROUTES } from "../services/mockShuttleData";
import { getStopDistance } from "../utils/calculateETA";

export function useRecentActivity(buses) {
  return buses
    .filter((b) => b.dwellRemaining > 0)
    .map((bus) => {
      const stop = STOPS.find((s) => {
        if (s.routeId !== bus.routeId) return false;
        const busPos = Math.round(bus.pathIndex * 1000);
        const stopPos = Math.round(getStopDistance(s.id, bus.routeId) * 1000);
        return busPos === stopPos;
      });
      return stop ? { bus, stop, route: ROUTES[bus.routeId] } : null;
    })
    .filter(Boolean);
}