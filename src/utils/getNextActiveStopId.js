import { getClosestBusToStop } from "./calculateETA";

export const getNextActiveStopId = (route, buses) => {
  const routeBuses = buses.filter((b) => b.routeId === route.id);
  if (!routeBuses.length) return [];

  const activeStopIds = routeBuses.map((bus) => {
    let minEta = Infinity;
    let activeStopId = null;

    route.stopList.forEach((stop) => {
      const result = getClosestBusToStop(stop, [bus]);
      if (result && result.etaMinutes < minEta) {
        minEta = result.etaMinutes;
        activeStopId = stop.id;
      }
    });

    // bus has passed all stops and is looping back — mark the first stop
    if (!activeStopId && route.stopList.length > 0) {
      activeStopId = route.stopList[0].id;
    }

    return activeStopId;
  }).filter(Boolean);

  // deduplicate — two buses targeting the same stop should only mark it once
  return [...new Set(activeStopIds)];
};