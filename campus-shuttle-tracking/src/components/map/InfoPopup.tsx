import { Popup } from "react-map-gl/mapbox";
import {
  getETAsForBus,
  getClosestBusToStop,
  getBusPosition,
} from "../../utils/calculateETA";
import type { SelectionType, Bus, Route, Stop } from "../../types/shuttle";

interface Props {
  selection: SelectionType;
  buses: Bus[];
  routes: Record<string, Route>;
  stops: Stop[];
  routePaths: Record<string, { lat: number; lng: number }[]>;
  onClose: () => void;
}

export default function InfoPopup({
  selection,
  buses,
  routes,
  stops,
  routePaths,
  onClose,
}: Props) {
  if (!selection) return null;

  const isBus = selection.type === "bus";
  const isStop = selection.type === "stop";

  let lng: number, lat: number, content: React.ReactNode;

  if (isBus) {
    ({ lat, lng } = getBusPosition(selection.data, routePaths));
    const route = routes[selection.data.routeId];
    const etas = getETAsForBus(selection.data, buses, stops, routePaths);

    content = (
      <div style={{ minWidth: 220 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: route?.color ?? "#94a3b8",
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
            {selection.data.name}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          {route?.name}
        </div>

        {etas.length === 0 ? (
          <p style={{ fontSize: 12, color: "#94a3b8" }}>Completing loop...</p>
        ) : (
          <>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              UPCOMING STOPS
            </p>
            {etas.map(({ stop, etaMinutes }) => (
              <div
                key={stop.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "5px 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#334155" }}>📍 {stop.name}</span>
                <span
                  style={{ color: route?.color ?? "#94a3b8", fontWeight: 700, flexShrink: 0 }}
                >
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
    ({ lat, lng } = selection.data.coords);
    const route = routes[selection.data.routeId];
    const result = getClosestBusToStop(selection.data, buses, routePaths);

    content = (
      <div style={{ minWidth: 200 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: route?.color ?? "#94a3b8",
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
            {selection.data.name}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          {route?.name}
        </div>

        {result ? (
          <div
            style={{
              padding: "8px 10px",
              backgroundColor: "#f8fafc",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <div style={{ color: "#475569", marginBottom: 2 }}>Next bus:</div>
            <div style={{ fontWeight: 700, color: "#1e293b" }}>
              {result.bus.name}
            </div>
            <div style={{ marginTop: 4 }}>
              Arriving in{" "}
              <span
                style={{ color: route?.color ?? "#94a3b8", fontWeight: 700, fontSize: 15 }}
              >
                {result.etaMinutes} min
              </span>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            No buses currently on this route.
          </p>
        )}
      </div>
    );
  }

  return (
    <Popup
      longitude={lng!}
      latitude={lat!}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      maxWidth="280px"
      style={{ padding: 0 }}
    >
      {content}
    </Popup>
  );
}
