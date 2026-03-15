import {
  ROUTE_PATHS,
  STOPS,
  STOP_PATH_INDICES,
  AVG_SPEED_DEG_PER_SEC,
} from "../services/mockShuttleData";
import type { Bus, Stop, ETAResult, ClosestBusResult } from "../types/shuttle";

// Straight-line distance between two coords in degrees
export function distanceBetween(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
): number {
  return Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
}

// Pre-compute cumulative distances along each route path
// so we can convert "distance travelled" → position instantly
const ROUTE_CUMULATIVE_DIST: Record<string, number[]> = {};

for (const routeId of ["A", "B", "C", "D"]) {
  const path = ROUTE_PATHS[routeId];
  const dists = [0];
  for (let i = 1; i < path.length; i++) {
    dists.push(dists[i - 1] + distanceBetween(path[i - 1], path[i]));
  }
  ROUTE_CUMULATIVE_DIST[routeId] = dists;
}

// Total length of each route in degrees
export function getRouteLength(routeId: string): number {
  const dists = ROUTE_CUMULATIVE_DIST[routeId];
  return dists[dists.length - 1];
}

// Convert a distance-along-route → [lng, lat]
// distanceTravelled is in degrees, wraps on loop completion
export function getBusPosition(bus: Bus): [number, number] {
  const path = ROUTE_PATHS[bus.routeId];
  const dists = ROUTE_CUMULATIVE_DIST[bus.routeId];
  const total = dists[dists.length - 1];

  // Wrap distance into the route length
  const d = bus.pathIndex % total;

  // Binary search for which segment we're in
  let lo = 0,
    hi = dists.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (dists[mid] <= d) lo = mid;
    else hi = mid - 1;
  }

  const segStart = dists[lo];
  const segEnd = dists[lo + 1];
  const t = segEnd === segStart ? 0 : (d - segStart) / (segEnd - segStart);

  const [lng1, lat1] = path[lo];
  const [lng2, lat2] = path[lo + 1];

  return [lng1 + (lng2 - lng1) * t, lat1 + (lat2 - lat1) * t];
}

// Get the cumulative distance at a stop's snap index
// Used for dwell detection
export function getStopDistance(stopId: string, routeId: string): number {
  const snapIdx = STOP_PATH_INDICES[stopId];
  return ROUTE_CUMULATIVE_DIST[routeId][snapIdx];
}

// ETA from a bus to each upcoming stop on its route
export function getETAsForBus(bus: Bus): ETAResult[] {
  const dists = ROUTE_CUMULATIVE_DIST[bus.routeId];
  const total = dists[dists.length - 1];
  const stops = STOPS.filter((s) => s.routeId === bus.routeId).sort(
    (a, b) => a.order - b.order,
  );

  const currentDist = bus.pathIndex % total;
  const results: ETAResult[] = [];

  for (const stop of stops) {
    const stopDist = getStopDistance(stop.id, bus.routeId);

    // Distance ahead — wrap around loop if stop is behind current position
    let distAhead = stopDist - currentDist;
    if (distAhead <= 0) distAhead += total;

    const etaSeconds = distAhead / AVG_SPEED_DEG_PER_SEC;
    const etaMinutes = Math.round(etaSeconds / 60);

    results.push({
      stop,
      etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
    });
  }

  // Sort by who's coming up soonest
  return results.sort((a, b) => Number(a.etaMinutes) - Number(b.etaMinutes));
}

// Closest bus to a stop and its ETA
export function getClosestBusToStop(
  stop: Stop,
  buses: Bus[],
): ClosestBusResult | null {
  const routeBuses = buses.filter((b) => b.routeId === stop.routeId);
  if (!routeBuses.length) return null;

  const stopDist = getStopDistance(stop.id, stop.routeId);
  const total = getRouteLength(stop.routeId);

  let closest: Bus | null = null;
  let minEta = Infinity;

  for (const bus of routeBuses) {
    const currentDist = bus.pathIndex % total;
    let distAhead = stopDist - currentDist;
    if (distAhead <= 0) distAhead += total;

    if (distAhead < minEta) {
      minEta = distAhead;
      closest = bus;
    }
  }

  const etaSeconds = minEta / AVG_SPEED_DEG_PER_SEC;
  const etaMinutes = Math.round(etaSeconds / 60);

  return {
    bus: closest!,
    etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
  };
}
