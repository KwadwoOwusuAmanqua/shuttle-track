import { useState, useEffect } from "react";
import Map from "react-map-gl/mapbox";

import RouteLayer from "./RouteLayer";
import BusMarker from "./BusMarker";
import StopMarker from "./StopMarker";
import InfoPopup from "./InfoPopup";
import RouteLegend from "./RouteLegend";
import type { Bus, Route, Stop, SelectionType } from "../../types/shuttle";

import {
  ROUTES as MOCK_ROUTES,
  STOPS as MOCK_STOPS,
  MOCK_BUSES,
  ROUTE_PATHS as MOCK_ROUTE_PATHS,
} from "../../services/mockShuttleData";
import {
  fetchRoutes,
  fetchStops,
  fetchRoutePaths,
  subscribeToBuses,
} from "../../services/shuttleData";

const KNUST_CENTER = { longitude: -1.575, latitude: 6.677, zoom: 15 };
const USE_FIREBASE = !!import.meta.env.VITE_FIREBASE_API_KEY;

export default function MapView() {
  const [routes, setRoutes] = useState<Record<string, Route>>(MOCK_ROUTES);
  const [stops, setStops] = useState<Stop[]>(MOCK_STOPS);
  const [routePaths, setRoutePaths] = useState<
    Record<string, { lat: number; lng: number }[]>
  >(MOCK_ROUTE_PATHS);
  const [buses, setBuses] = useState<Bus[]>(
    MOCK_BUSES.map((b) => ({ ...b }))
  );
  const [selection, setSelection] = useState<SelectionType | null>(null);

  // Load routes, stops, paths from Firestore
  useEffect(() => {
    if (!USE_FIREBASE) return;
    Promise.all([fetchRoutes(), fetchStops(), fetchRoutePaths()])
      .then(([r, s, rp]) => {
        setRoutes(r);
        setStops(s);
        setRoutePaths(rp);
      })
      .catch(console.error);
  }, []);

  // Subscribe to real-time bus updates from Firestore
  useEffect(() => {
    if (!USE_FIREBASE) return;
    const unsubscribe = subscribeToBuses((liveBuses) => {
      setBuses(liveBuses.map((bus) => ({ ...bus })));
    });
    return () => unsubscribe();
  }, []);

  // Animate buses along their paths (only used in mock/offline mode)
  useEffect(() => {
    if (USE_FIREBASE) return;
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          const path = routePaths[bus.routeId];
          if (!path) return bus;
          const pathLen = path.length - 1;
          let next = bus.pathIndex + bus.speed;
          if (next >= pathLen) next = 0;
          return { ...bus, pathIndex: next };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [routePaths]);

  const handleBusClick = (bus: Bus) => setSelection({ type: "bus", data: bus });
  const handleStopClick = (stop: Stop) =>
    setSelection({ type: "stop", data: stop });
  const handleClose = () => setSelection(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={KNUST_CENTER}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <RouteLayer routes={routes} routePaths={routePaths} />

        {stops.map((stop) => (
          <StopMarker key={stop.id} stop={stop} routes={routes} onClick={handleStopClick} />
        ))}

        {buses.map((bus) => (
          <BusMarker
            key={bus.id}
            bus={bus}
            routes={routes}
            routePaths={routePaths}
            onClick={handleBusClick}
          />
        ))}

        <InfoPopup
          selection={selection}
          buses={buses}
          routes={routes}
          stops={stops}
          routePaths={routePaths}
          onClose={handleClose}
        />
      </Map>
      <RouteLegend routes={routes} />
    </div>
  );
}
