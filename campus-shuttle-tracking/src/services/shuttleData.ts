import {
  collection,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Route, Stop, Bus } from "../types/shuttle";

export async function fetchRoutes(): Promise<Record<string, Route>> {
  const snap = await getDocs(collection(db, "routes"));
  const result: Record<string, Route> = {};
  snap.forEach((d) => {
    result[d.id] = d.data() as Route;
  });
  return result;
}

export async function fetchStops(): Promise<Stop[]> {
  const snap = await getDocs(collection(db, "stops"));
  return snap.docs.map((d) => d.data() as Stop);
}

export async function fetchRoutePaths(): Promise<
  Record<string, { lat: number; lng: number }[]>
> {
  const snap = await getDocs(collection(db, "routePaths"));
  const result: Record<string, { lat: number; lng: number }[]> = {};
  snap.forEach((d) => {
    result[d.id] = d.data().coordinates as { lat: number; lng: number }[];
  });
  return result;
}

export async function fetchBuses(): Promise<Bus[]> {
  const snap = await getDocs(collection(db, "buses"));
  return snap.docs.map((d) => d.data() as Bus);
}

// Real-time listener for bus positions
export function subscribeToBuses(
  callback: (buses: Bus[]) => void
): Unsubscribe {
  return onSnapshot(collection(db, "buses"), (snap) => {
    callback(snap.docs.map((d) => d.data() as Bus));
  });
}
