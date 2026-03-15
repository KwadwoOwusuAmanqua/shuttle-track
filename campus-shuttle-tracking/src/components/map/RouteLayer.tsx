import { Source, Layer } from "react-map-gl/mapbox";
import { ROUTES, ROUTE_PATHS } from "../../services/mockShuttleData";

interface Props {
  activeRoute: string | null;
}

export default function RouteLayer({ activeRoute }: Props) {
  return (
    <>
      {Object.values(ROUTES).map((route) => {
        const isActive = !activeRoute || activeRoute === route.id;
        const geojson = {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: ROUTE_PATHS[route.id],
          },
          properties: {},
        };

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
                "line-width": isActive ? 4 : 2,
                "line-opacity": isActive ? 0.9 : 0.15, // dim inactive routes
              }}
              layout={{ "line-join": "round", "line-cap": "round" }}
            />
          </Source>
        );
      })}
    </>
  );
}
