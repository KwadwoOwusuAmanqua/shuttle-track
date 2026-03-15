import {
  ROUTE_PATHS,
  STOPS,
  STOP_PATH_INDICES,
  AVG_SPEED_DEG_PER_SEC,
} from "../services/mockShuttleData";
import type { Bus, Stop, ETAResult, ClosestBusResult } from "../types/shuttle";

export function distanceBetween(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
): number {
  return Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
}

// Pre-compute cumulative distances for every route once at module load
const ROUTE_CUMULATIVE_DIST: Record<string, number[]> = {};
for (const routeId of ["A", "B", "C", "D"]) {
  const path = ROUTE_PATHS[routeId];
  const dists = [0];
  for (let i = 1; i < path.length; i++) {
    dists.push(dists[i - 1] + distanceBetween(path[i - 1], path[i]));
  }
  ROUTE_CUMULATIVE_DIST[routeId] = dists;
}

export function getRouteLength(routeId: string): number {
  const d = ROUTE_CUMULATIVE_DIST[routeId];
  return d[d.length - 1];
}

export function getStopDistance(stopId: string, routeId: string): number {
  return ROUTE_CUMULATIVE_DIST[routeId][STOP_PATH_INDICES[stopId]];
}

export function getBusPosition(bus: Bus): [number, number] {
  const path = ROUTE_PATHS[bus.routeId];
  const dists = ROUTE_CUMULATIVE_DIST[bus.routeId];
  const total = dists[dists.length - 1];
  const d = bus.pathIndex % total;

  // Binary search for the segment
  let lo = 0,
    hi = dists.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (dists[mid] <= d) lo = mid;
    else hi = mid - 1;
  }

  const t =
    dists[lo + 1] === dists[lo]
      ? 0
      : (d - dists[lo]) / (dists[lo + 1] - dists[lo]);

  const [lng1, lat1] = path[lo];
  const [lng2, lat2] = path[lo + 1];
  return [lng1 + (lng2 - lng1) * t, lat1 + (lat2 - lat1) * t];
}

// ─── KEY FIX: use AVG_SPEED_DEG_PER_SEC consistently ────────────
function degToMinutes(distDeg: number): number {
  const seconds = distDeg / AVG_SPEED_DEG_PER_SEC;
  return Math.round(seconds / 60);
}

export function getETAsForBus(bus: Bus): ETAResult[] {
  const total = getRouteLength(bus.routeId);
  const current = bus.pathIndex % total;
  const stops = STOPS.filter((s) => s.routeId === bus.routeId).sort(
    (a, b) => a.order - b.order,
  );

  return stops
    .map((stop) => {
      const stopDist = getStopDistance(stop.id, bus.routeId);
      let ahead = stopDist - current;
      if (ahead <= 0) ahead += total; // wrap around loop

      const mins = degToMinutes(ahead);
      return { stop, etaMinutes: mins < 1 ? "< 1" : mins };
    })
    .sort((a, b) => Number(a.etaMinutes) - Number(b.etaMinutes));
}

export function getNextStop(bus: Bus): ETAResult | null {
  const results = getETAsForBus(bus);
  return results.length > 0 ? results[0] : null;
}

export function getClosestBusToStop(
  stop: Stop,
  buses: Bus[],
): ClosestBusResult | null {
  const routeBuses = buses.filter((b) => b.routeId === stop.routeId);
  if (!routeBuses.length) return null;

  const stopDist = getStopDistance(stop.id, stop.routeId);
  const total = getRouteLength(stop.routeId);

  let closest: Bus | null = null;
  let minAhead = Infinity;

  for (const bus of routeBuses) {
    const current = bus.pathIndex % total;
    let ahead = stopDist - current;
    if (ahead <= 0) ahead += total;
    if (ahead < minAhead) {
      minAhead = ahead;
      closest = bus;
    }
  }

  const mins = degToMinutes(minAhead);
  return { bus: closest!, etaMinutes: mins < 1 ? "< 1" : mins };
}
