import type { StopCrowds, Bus } from "../types/shuttle";
import { STOPS } from "../services/mockShuttleData";
import { getStopDistance, getRouteLength } from "./calculateETA";

const MAX_CROWD = 50;

// Initialise all stops with a random count between 15–35
// so the map looks populated from the start
export function initCrowds(): StopCrowds {
  return Object.fromEntries(
    STOPS.map((stop) => [
      stop.id,
      Math.floor(Math.random() * 21) + 15, // 15 to 35
    ]),
  );
}

export function tickCrowds(
  crowds: StopCrowds,
  dwellingStopIds: string[],
): StopCrowds {
  const next = { ...crowds };

  for (const stopId of Object.keys(next)) {
    const isDwelling = dwellingStopIds.includes(stopId);

    if (isDwelling) {
      // Bus is here — passengers board, count drops by 5–8 per tick
      const boarding = Math.floor(Math.random() * 4) + 5;
      next[stopId] = Math.max(0, next[stopId] - boarding);
    } else {
      // People arrive — 70% chance of 1–3 arrivals per tick
      // Higher probability + higher volume = crowds build up properly
      if (Math.random() < 0.7) {
        const arrivals = Math.floor(Math.random() * 3) + 1; // 1–3
        next[stopId] = Math.min(MAX_CROWD, next[stopId] + arrivals);
      }

      // People leave (gave up / walked) — 15% chance of 1 person leaving
      // Much lower than before so crowds don't drain
      if (Math.random() < 0.15) {
        next[stopId] = Math.max(0, next[stopId] - 1);
      }
    }
  }

  return next;
}

// FIX — compare using actual stop coordinates against bus position
// instead of comparing pathIndex (distance) against snapIdx (array index)
export function getDwellingStopIds(
  buses: Bus[],
  stopPathIndices: Record<string, number>,
): string[] {
  const dwellingStopIds: string[] = [];

  for (const bus of buses) {
    if (bus.dwellRemaining <= 0) continue;

    const total = getRouteLength(bus.routeId);
    const busPos = bus.pathIndex % total;

    for (const stopId of Object.keys(stopPathIndices)) {
      if (!stopId.startsWith(bus.routeId)) continue;

      const stopDist = getStopDistance(stopId, bus.routeId);

      // busPos was set to exactly stopDist on arrival,
      // so a small tolerance handles any floating point drift
      if (Math.abs(busPos - stopDist) < 0.000001) {
        dwellingStopIds.push(stopId);
        break;
      }
    }
  }

  return dwellingStopIds;
}
