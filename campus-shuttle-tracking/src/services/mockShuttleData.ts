import type { Bus, Stop, Route } from "../types/shuttle";

export const ROUTES: Record<string, Route> = {
  A: { id: "A", name: "Commercial Area - KSB", color: "#E63946" }, // Red
  B: { id: "B", name: "Brunei - KSB", color: "#2196F3" }, // Blue
  C: { id: "C", name: "Pharmacy - Wilkado", color: "#4CAF50" }, // Green
  D: { id: "D", name: "Pharmacy - Medical Village", color: "#FF9800" }, // Orange
};

export const STOPS: Stop[] = [
  // ── ROUTE A: Commercial Area - KSB ──────────────────────────────
  {
    id: "A1",
    routeId: "A",
    name: "Commercial Bus Stop",
    coords: [-1.5769902217154887, 6.682746641753975],
    order: 0,
  },
  {
    id: "A2",
    routeId: "A",
    name: "Peace Junction Bus Stop",
    coords: [-1.5728103033609948, 6.679295278555908],
    order: 1,
  },
  {
    id: "A3",
    routeId: "A",
    name: "Pentecost Bus Stop",
    coords: [-1.5675618897813237, 6.67454169559569],
    order: 2,
  },
  {
    id: "A4",
    routeId: "A",
    name: "Trinity Bus Stop",
    coords: [-1.5671799213956803, 6.669344458303166],
    order: 3,
  },
  {
    id: "A5",
    routeId: "A",
    name: "Casely Hayford Bus Stop",
    coords: [-1.5676671184388338, 6.675054816554186],
    order: 4,
  },
  {
    id: "A6",
    routeId: "A",
    name: "Peace Junction Bus Stop (Return)",
    coords: [-1.5729528868901517, 6.679641414615745],
    order: 5,
  },
  {
    id: "A7",
    routeId: "A",
    name: "Commercial Bus Stop (Return)",
    coords: [-1.5769902217154887, 6.682746641753975],
    order: 6,
  },

  // ── ROUTE B: Brunei - KSB ────────────────────────
  {
    id: "B1",
    routeId: "B",
    name: "Brunei Bus Stop",
    coords: [-1.5741732323185718, 6.6704642801376535],
    order: 0,
  },
  {
    id: "B2",
    routeId: "B",
    name: "Pentecost Bus Stop",
    coords: [-1.5675618897813237, 6.67454169559569],
    order: 1,
  },
  {
    id: "B3",
    routeId: "B",
    name: "Trinity Bus Stop",
    coords: [-1.5671799213956803, 6.669344458303166],
    order: 2,
  },
  {
    id: "B4",
    routeId: "B",
    name: "Casely Hayford Bus Stop",
    coords: [-1.5676671184388338, 6.675054816554186],
    order: 3,
  },
  {
    id: "B5",
    routeId: "B",
    name: "Library",
    coords: [-1.5723508030936832, 6.675027537852301],
    order: 4,
  },
  {
    id: "B6",
    routeId: "B",
    name: "Katanga Hall",
    coords: [-1.5734633706141377, 6.672580005602448],
    order: 5,
  },

  // ── ROUTE C: Pharmacy - Wilkado ──────────────────────────────
  {
    id: "C1",
    routeId: "C",
    name: "Pharmacy Bus Stop",
    coords: [-1.5666135858611696, 6.674801938703597],
    order: 0,
  },
  {
    id: "C2",
    routeId: "C",
    name: "Wilkado Bus Stop",
    coords: [-1.5577791833208823, 6.6854177915107],
    order: 1,
  },
  {
    id: "C3",
    routeId: "C",
    name: "Pharmacy Bus Stop",
    coords: [-1.5666135858611696, 6.674801938703597],
    order: 2,
  },

  // ── ROUTE D: Pharmacy - Medical Village ─────────────────────────
  {
    id: "D1",
    routeId: "D",
    name: "Pharmacy Bus Stop",
    coords: [-1.5666135858611696, 6.674801938703597],
    order: 0,
  },
  {
    id: "D2",
    routeId: "D",
    name: "Medical Village Bus Stop",
    coords: [-1.5496987867886531, 6.680350574106202],
    order: 1,
  },
  {
    id: "D3",
    routeId: "D",
    name: "Pharmacy Bus Stop",
    coords: [-1.5666135858611696, 6.674801938703597],
    order: 2,
  },
];

// Route path coordinates (the line drawn on the map — ordered waypoints)
export const ROUTE_PATHS: Record<string, [number, number][]> = {
  A: [
    [-1.5769902217154887, 6.682746641753975],
    [-1.5728103033609948, 6.679295278555908],
    [-1.5675618897813237, 6.67454169559569],
    [-1.5671799213956803, 6.669344458303166],
    [-1.5675618897813237, 6.67454169559569],
    [-1.5728103033609948, 6.679295278555908],
    [-1.5769902217154887, 6.682746641753975],
  ],

  // Route B: Brunei → KSB → back to Brunei

  B: [
    [-1.5741732323185718, 6.6704642801376535], //Brunei Bus Stop
    [-1.573811341027895, 6.670789127487988], //Old Brunei Junction
    [-1.5735674717471262, 6.671273442289296], //
    [-1.5734320890911921, 6.672653379351118],
    [-1.5726626205160565, 6.673403482254454],
    [-1.5722921356607267, 6.675073518473529],
    [-1.571023937502097, 6.675087671298487],
    [-1.5708529444919443, 6.6749744486872515],
    [-1.5706748267730357, 6.675151359005801],
    [-1.568451917595963, 6.675151359020826],
    [-1.5678035690991352, 6.67503813642431],
    [-1.5673333383212165, 6.674917837386825],
    [-1.5675618897813237, 6.67454169559569],
    [-1.5671799213956803, 6.669344458303166],
    [-1.56725, 6.671],
    [-1.5676671184388338, 6.675054816554186],
    [-1.57, 6.675],
    [-1.5723508030936832, 6.675027537852301],
    [-1.573, 6.674],
    [-1.5734633706141377, 6.672580005602448],
    [-1.5738, 6.6715],
    [-1.5741732323185718, 6.6704642801376535],
  ],

  // Route C: Pharmacy → Gaza
  C: [
    [-1.5666135858611696, 6.674801938703597],
    [-1.561, 6.678],
    [-1.559, 6.681],
    [-1.5577791833208823, 6.6854177915107],
    [-1.559, 6.681],
    [-1.561, 6.678],
    [-1.5666135858611696, 6.674801938703597],
  ],

  // Route D: Pharmacy → Medical Village
  D: [
    [-1.5666135858611696, 6.674801938703597],
    [-1.558, 6.6775],
    [-1.553, 6.679],
    [-1.5496987867886531, 6.680350574106202],
    [-1.553, 6.679],
    [-1.558, 6.6775],
    [-1.5666135858611696, 6.674801938703597],
  ],
};

// Mock buses — each has a routeId, current position index along the path, and speed
export const MOCK_BUSES: Bus[] = [
  {
    id: "SH-101",
    routeId: "A",
    name: "Main Gate Loop 1",
    pathIndex: 0.0,
    speed: 0.004,
  },
  {
    id: "SH-102",
    routeId: "A",
    name: "Main Gate Loop 2",
    pathIndex: 2.5,
    speed: 0.003,
  },
  {
    id: "SH-201",
    routeId: "B",
    name: "Engineering Circuit 1",
    pathIndex: 0.5,
    speed: 0.005,
  },
  {
    id: "SH-301",
    routeId: "C",
    name: "Halls Express 1",
    pathIndex: 1.0,
    speed: 0.004,
  },
  {
    id: "SH-302",
    routeId: "C",
    name: "Halls Express 2",
    pathIndex: 3.0,
    speed: 0.003,
  },
  {
    id: "SH-401",
    routeId: "D",
    name: "Hospital Connector 1",
    pathIndex: 0.8,
    speed: 0.004,
  },
];

// Average shuttle speed on KNUST roads: ~20 km/h → ~333 m/min (will implement a better algortihm later that accounts for stop dwell time, traffic, etc.)
// But for now 1 degree lat/lng ≈ 111km, so per-degree speed ≈ 0.003 deg/s at 20km/h
export const AVG_SPEED_DEG_PER_SEC = 0.003;
