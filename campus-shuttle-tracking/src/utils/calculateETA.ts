// src/utils/calculateETA.ts
import type { Bus, Stop, ETAResult, ClosestBusResult } from "../types/shuttle";

// bus.speed is in deg/tick (1 tick = 100ms), so × 10 = deg/sec
const speedDegPerSec = (bus: Bus) => bus.speed * 10;

type Coord = { lat: number; lng: number };

function distanceBetween(a: Coord, b: Coord) {
  return Math.sqrt((b.lng - a.lng) ** 2 + (b.lat - a.lat) ** 2);
}

// Get the current { lat, lng } of a bus by interpolating along its path
export function getBusPosition(
  bus: Bus,
  routePaths: Record<string, Coord[]>,
): Coord {
  const path = routePaths[bus.routeId];
  if (!path || path.length < 2) return { lat: 0, lng: 0 };
  const totalSegments = path.length - 1;
  const clampedIndex = bus.pathIndex % totalSegments;
  const segIndex = Math.floor(clampedIndex);
  const t = clampedIndex - segIndex;

  const p1 = path[segIndex];
  const p2 = path[(segIndex + 1) % path.length];

  return {
    lat: p1.lat + (p2.lat - p1.lat) * t,
    lng: p1.lng + (p2.lng - p1.lng) * t,
  };
}

// Given a bus, return ETAs (in minutes) to each upcoming stop on its route
export function getETAsForBus(
  bus: Bus,
  buses: Bus[],
  stops: Stop[],
  routePaths: Record<string, Coord[]>,
): ETAResult[] {
  const path = routePaths[bus.routeId];
  if (!path) return [];
  const routeStops = stops
    .filter((s) => s.routeId === bus.routeId)
    .sort((a, b) => a.order - b.order);
  const busPos = getBusPosition(bus, routePaths);
  const totalSegments = path.length - 1;
  const currentSegment = Math.floor(bus.pathIndex % totalSegments);

  let distanceAccumulated = 0;
  const results: ETAResult[] = [];

  for (const stop of routeStops) {
    if (stop.order <= currentSegment) continue;

    const d = distanceBetween(busPos, path[stop.order] ?? stop.coords);
    distanceAccumulated += d;

    const etaSeconds = distanceAccumulated / speedDegPerSec(bus);
    const etaMinutes = Math.round(etaSeconds / 60);

    results.push({
      stop,
      etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
    });
  }

  void buses;

  return results;
}

// Given a stop, find the closest bus on its route and return ETA
export function getClosestBusToStop(
  stop: Stop,
  buses: Bus[],
  routePaths: Record<string, Coord[]>,
): ClosestBusResult | null {
  const routeBuses = buses.filter((b) => b.routeId === stop.routeId);
  if (!routeBuses.length) return null;

  let closest: Bus | null = null;
  let minDist = Infinity;

  for (const bus of routeBuses) {
    const pos = getBusPosition(bus, routePaths);
    const dist = distanceBetween(pos, stop.coords);
    if (dist < minDist) {
      minDist = dist;
      closest = bus;
    }
  }

  if (!closest) return null;

  const etaSeconds = minDist / speedDegPerSec(closest);
  const etaMinutes = Math.round(etaSeconds / 60);

  return {
    bus: closest,
    etaMinutes: etaMinutes < 1 ? "< 1" : etaMinutes,
  };
}
