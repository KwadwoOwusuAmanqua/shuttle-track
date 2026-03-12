// src/components/map/RouteLayer.jsx
import { Source, Layer } from "react-map-gl/mapbox";
import { ROUTES, ROUTE_PATHS } from "../../services/mockShuttleData";

export default function RouteLayer() {
  return Object.values(ROUTES).map((route) => {
    const geojson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: ROUTE_PATHS[route.id],
      },
      properties: {},
    } as const;

    return (
      <Source
        key={route.id}
        id={`route-${route.id}`}
        type="geojson"
        data={geojson}
      >
        <Layer
          id={`route-line-${route.id}`}
          type="line"
          paint={{
            "line-color": route.color,
            "line-width": 4,
            "line-opacity": 0.85,
          }}
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
        />
      </Source>
    );
  });
}
