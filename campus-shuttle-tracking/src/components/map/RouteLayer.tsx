import { Source, Layer } from "react-map-gl/mapbox";
import type { Route } from "../../types/shuttle";

interface Props {
  routes: Record<string, Route>;
  routePaths: Record<string, { lat: number; lng: number }[]>; // ✅ fixed type
}

export default function RouteLayer({ routes, routePaths }: Props) {
  return Object.values(routes).map((route) => {
    const geojson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        // ✅ Mapbox needs [lng, lat] arrays, so convert from { lat, lng } objects
        coordinates: (routePaths[route.id] ?? []).map(
          ({ lat, lng }) => [lng, lat] as [number, number]
        ),
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