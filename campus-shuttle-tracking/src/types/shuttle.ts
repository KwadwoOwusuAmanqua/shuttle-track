// src/types/shuttle.ts

export interface Route {
  id: string;
  name: string;
  color: string;
}

export interface Stop {
  id: string;
  routeId: string;
  name: string;
  coords: [number, number]; // [longitude, latitude]
  order: number;
}

export interface Bus {
  id: string;
  routeId: string;
  name: string;
  pathIndex: number;
  speed: number;
}

export interface ETAResult {
  stop: Stop;
  etaMinutes: number | string;
}

export interface ClosestBusResult {
  bus: Bus;
  etaMinutes: number | string;
}

export type SelectionType =
  | { type: "bus"; data: Bus }
  | { type: "stop"; data: Stop }
  | null;
