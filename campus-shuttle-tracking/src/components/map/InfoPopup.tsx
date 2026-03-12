import { Popup } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import {
  getETAsForBus,
  getClosestBusToStop,
  getBusPosition,
} from "../../utils/calculateETA";
import type { SelectionType, Bus } from "../../types/shuttle";

interface Props {
  selection: SelectionType;
  buses: Bus[];
  onClose: () => void;
}

export default function InfoPopup({ selection, buses, onClose }: Props) {
  if (!selection) return null;

  const isBus = selection.type === "bus";
  const isStop = selection.type === "stop";

  let lng: number = 0,
    lat: number = 0,
    content;

  if (isBus) {
    [lng, lat] = getBusPosition(selection.data);
    const route = ROUTES[selection.data.routeId];
    const etas = getETAsForBus(selection.data, buses);

    content = (
      <div>
        <div
          style={{ fontWeight: "bold", color: route.color, marginBottom: 6 }}
        >
          🚌 {selection.data.name}
        </div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          Route {selection.data.routeId} — {route.name}
        </div>
        {etas.length === 0 ? (
          <p style={{ fontSize: 12 }}>Completing route loop...</p>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Upcoming stops:
            </div>
            {etas.map(({ stop, etaMinutes }) => (
              <div
                key={stop.id}
                style={{
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 2,
                }}
              >
                <span>📍 {stop.name}</span>
                <span style={{ color: route.color, fontWeight: 600 }}>
                  {etaMinutes} min
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  if (isStop) {
    [lng, lat] = selection.data.coords;
    const route = ROUTES[selection.data.routeId];
    const result = getClosestBusToStop(selection.data, buses);

    content = (
      <div>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>
          📍 {selection.data.name}
        </div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          Route {selection.data.routeId} — {route.name}
        </div>
        {result ? (
          <div style={{ fontSize: 13 }}>
            🚌 <strong>{result.bus.name}</strong> arriving in{" "}
            <span style={{ color: route.color, fontWeight: 700 }}>
              {result.etaMinutes} min
            </span>
          </div>
        ) : (
          <p style={{ fontSize: 12 }}>No buses currently on this route.</p>
        )}
      </div>
    );
  }

  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="top"
      onClose={onClose}
      closeOnClick={false}
      style={{ maxWidth: 260 }}
    >
      {content}
    </Popup>
  );
}
