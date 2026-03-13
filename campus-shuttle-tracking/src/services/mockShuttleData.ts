import type { Bus, Stop, Route } from "../types/shuttle";

export const ROUTES: Record<string, Route> = {
  A: { id: "A", name: "Commercial Area - KSB", color: "#E63946" },
  B: { id: "B", name: "Brunei - KSB", color: "#2196F3" },
  C: { id: "C", name: "Pharmacy - Wilkado", color: "#4CAF50" },
  D: { id: "D", name: "Pharmacy - Medical Village", color: "#FF9800" },
};

export const STOPS: Stop[] = [
  // ── ROUTE A ──────────────────────────────────────────────────────
  { id: "A1", routeId: "A", name: "Commercial Bus Stop",           coords: { lat: 6.682746641753975,  lng: -1.5769902217154887 }, order: 0 },
  { id: "A2", routeId: "A", name: "Peace Junction Bus Stop",       coords: { lat: 6.679295278555908,  lng: -1.5728103033609948 }, order: 1 },
  { id: "A3", routeId: "A", name: "Pentecost Bus Stop",            coords: { lat: 6.67454169559569,   lng: -1.5675618897813237 }, order: 2 },
  { id: "A4", routeId: "A", name: "Trinity Bus Stop",              coords: { lat: 6.669344458303166,  lng: -1.5671799213956803 }, order: 3 },
  { id: "A5", routeId: "A", name: "Casely Hayford Bus Stop",       coords: { lat: 6.675054816554186,  lng: -1.5676671184388338 }, order: 4 },
  { id: "A6", routeId: "A", name: "Peace Junction Bus Stop (Return)", coords: { lat: 6.679641414615745, lng: -1.5729528868901517 }, order: 5 },
  { id: "A7", routeId: "A", name: "Commercial Bus Stop (Return)",  coords: { lat: 6.682746641753975,  lng: -1.5769902217154887 }, order: 6 },

  // ── ROUTE B ──────────────────────────────────────────────────────
  { id: "B1", routeId: "B", name: "Brunei Bus Stop",               coords: { lat: 6.6704642801376535, lng: -1.5741732323185718 }, order: 0 },
  { id: "B2", routeId: "B", name: "Pentecost Bus Stop",            coords: { lat: 6.67454169559569,   lng: -1.5675618897813237 }, order: 1 },
  { id: "B3", routeId: "B", name: "Trinity Bus Stop",              coords: { lat: 6.669344458303166,  lng: -1.5671799213956803 }, order: 2 },
  { id: "B4", routeId: "B", name: "Casely Hayford Bus Stop",       coords: { lat: 6.675054816554186,  lng: -1.5676671184388338 }, order: 3 },
  { id: "B5", routeId: "B", name: "Library",                       coords: { lat: 6.675027537852301,  lng: -1.5723508030936832 }, order: 4 },
  { id: "B6", routeId: "B", name: "Katanga Hall",                  coords: { lat: 6.672580005602448,  lng: -1.5734633706141377 }, order: 5 },

  // ── ROUTE C ──────────────────────────────────────────────────────
  { id: "C1", routeId: "C", name: "Pharmacy Bus Stop",             coords: { lat: 6.674801938703597,  lng: -1.5666135858611696 }, order: 0 },
  { id: "C2", routeId: "C", name: "Wilkado Bus Stop",              coords: { lat: 6.6854177915107,    lng: -1.5577791833208823 }, order: 1 },
  { id: "C3", routeId: "C", name: "Pharmacy Bus Stop",             coords: { lat: 6.674801938703597,  lng: -1.5666135858611696 }, order: 2 },

  // ── ROUTE D ──────────────────────────────────────────────────────
  { id: "D1", routeId: "D", name: "Pharmacy Bus Stop",             coords: { lat: 6.674801938703597,  lng: -1.5666135858611696 }, order: 0 },
  { id: "D2", routeId: "D", name: "Medical Village Bus Stop",      coords: { lat: 6.680350574106202,  lng: -1.5496987867886531 }, order: 1 },
  { id: "D3", routeId: "D", name: "Pharmacy Bus Stop",             coords: { lat: 6.674801938703597,  lng: -1.5666135858611696 }, order: 2 },
];

export const ROUTE_PATHS: Record<string, { lat: number; lng: number }[]> = {
  A: [
    { lat: 6.682746641753975,  lng: -1.5769902217154887 },
    { lat: 6.679295278555908,  lng: -1.5728103033609948 },
    { lat: 6.67454169559569,   lng: -1.5675618897813237 },
    { lat: 6.669344458303166,  lng: -1.5671799213956803 },
    { lat: 6.67454169559569,   lng: -1.5675618897813237 },
    { lat: 6.679295278555908,  lng: -1.5728103033609948 },
    { lat: 6.682746641753975,  lng: -1.5769902217154887 },
  ],

  B: [
    { lat: 6.6704642801376535, lng: -1.5741732323185718 },
    { lat: 6.670789127487988,  lng: -1.573811341027895  },
    { lat: 6.671273442289296,  lng: -1.5735674717471262 },
    { lat: 6.672653379351118,  lng: -1.5734320890911921 },
    { lat: 6.673403482254454,  lng: -1.5726626205160565 },
    { lat: 6.675073518473529,  lng: -1.5722921356607267 },
    { lat: 6.675087671298487,  lng: -1.571023937502097  },
    { lat: 6.6749744486872515, lng: -1.5708529444919443 },
    { lat: 6.675151359005801,  lng: -1.5706748267730357 },
    { lat: 6.675151359020826,  lng: -1.568451917595963  },
    { lat: 6.67503813642431,   lng: -1.5678035690991352 },
    { lat: 6.674917837386825,  lng: -1.5673333383212165 },
    { lat: 6.67454169559569,   lng: -1.5675618897813237 },
    { lat: 6.669344458303166,  lng: -1.5671799213956803 },
    { lat: 6.671,              lng: -1.56725            },
    { lat: 6.675054816554186,  lng: -1.5676671184388338 },
    { lat: 6.675,              lng: -1.57               },
    { lat: 6.675027537852301,  lng: -1.5723508030936832 },
    { lat: 6.674,              lng: -1.573              },
    { lat: 6.672580005602448,  lng: -1.5734633706141377 },
    { lat: 6.6715,             lng: -1.5738             },
    { lat: 6.6704642801376535, lng: -1.5741732323185718 },
  ],

  C: [
    { lat: 6.674801938703597,  lng: -1.5666135858611696 },
    { lat: 6.678,              lng: -1.561              },
    { lat: 6.681,              lng: -1.559              },
    { lat: 6.6854177915107,    lng: -1.5577791833208823 },
    { lat: 6.681,              lng: -1.559              },
    { lat: 6.678,              lng: -1.561              },
    { lat: 6.674801938703597,  lng: -1.5666135858611696 },
  ],

  D: [
    { lat: 6.674801938703597,  lng: -1.5666135858611696 },
    { lat: 6.6775,             lng: -1.558              },
    { lat: 6.679,              lng: -1.553              },
    { lat: 6.680350574106202,  lng: -1.5496987867886531 },
    { lat: 6.679,              lng: -1.553              },
    { lat: 6.6775,             lng: -1.558              },
    { lat: 6.674801938703597,  lng: -1.5666135858611696 },
  ],
};

export const MOCK_BUSES: Bus[] = [
  { id: "SH-101", routeId: "A", name: "Main Gate Loop 1",       pathIndex: 0.0, speed: 0.004 },
  { id: "SH-102", routeId: "A", name: "Main Gate Loop 2",       pathIndex: 2.5, speed: 0.003 },
  { id: "SH-201", routeId: "B", name: "Engineering Circuit 1",  pathIndex: 0.5, speed: 0.005 },
  { id: "SH-301", routeId: "C", name: "Halls Express 1",        pathIndex: 1.0, speed: 0.004 },
  { id: "SH-302", routeId: "C", name: "Halls Express 2",        pathIndex: 3.0, speed: 0.003 },
  { id: "SH-401", routeId: "D", name: "Hospital Connector 1",   pathIndex: 0.8, speed: 0.004 },
];

export const AVG_SPEED_DEG_PER_SEC = 0.003;
