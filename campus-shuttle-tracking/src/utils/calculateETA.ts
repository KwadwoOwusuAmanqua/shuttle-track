// src/utils/calculateETA.js
import {
  ROUTE_PATHS,
  STOPS,
  AVG_SPEED_DEG_PER_SEC,
} from "../services/mockShuttleData";
import type { Bus, Stop, ETAResult, ClosestBusResult } from "../types/shuttle";

function distanceBetween(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
) {
  return Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
}

// Get the current [lng, lat] of a bus by interpolating along its path
export function getBusPosition(bus: Bus): [number, number] {
  const path = ROUTE_PATHS[bus.routeId];
  const totalSegments = path.length - 1;
  const clampedIndex = bus.pathIndex % totalSegments;
  const segIndex = Math.floor(clampedIndex);
  const t = clampedIndex - segIndex; // 0.0 → 1.0 progress within segment

  const [lng1, lat1] = path[segIndex];
  const [lng2, lat2] = path[(segIndex + 1) % path.length];

  return [lng1 + (lng2 - lng1) * t, lat1 + (lat2 - lat1) * t];
}

// Given a bus, return ETAs (in minutes) to each upcoming stop on its route
export function getETAsForBus(bus: Bus, buses: Bus[]): ETAResult[] {
  const path = ROUTE_PATHS[bus.routeId];
  const stops = STOPS.filter((s) => s.routeId === bus.routeId).sort(
    (a, b) => a.order - b.order,
  );
  const busPos = getBusPosition(bus);
  const totalSegments = path.length - 1;
  const currentSegment = Math.floor(bus.pathIndex % totalSegments);

  let distanceAccumulated = 0;
  const results = [];

  for (const stop of stops) {
    // Stops past the current segment index are "upcoming"
    if (stop.order <= currentSegment) continue;

    // Accumulate path distance from bus to this stop
    let d = distanceBetween(busPos, path[stop.order] || stop.coords);
    distanceAccumulated += d;

    const etaSeconds = distanceAccumulated / AVG_SPEED_DEG_PER_SEC;
    const etaMinutes = Math.round(etaSeconds / 60);

    results.push({
      stop,
      etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
    });
  }

  return results;
}

// Given a stop, find the closest bus on its route and return ETA
export function getClosestBusToStop(
  stop: Stop,
  buses: Bus[],
): ClosestBusResult | null {
  const routeBuses = buses.filter((b) => b.routeId === stop.routeId);
  if (!routeBuses.length) return null;

  let closest: Bus | null = null;
  let minDist = Infinity;

  for (const bus of routeBuses) {
    const pos = getBusPosition(bus);
    const dist = distanceBetween(pos, stop.coords);
    if (dist < minDist) {
      minDist = dist;
      closest = bus;
    }
  }

  if (!closest) return null;

  const etaSeconds = minDist / AVG_SPEED_DEG_PER_SEC;
  const etaMinutes = Math.round(etaSeconds / 60);

  return {
    bus: closest,
    etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
  };
}
