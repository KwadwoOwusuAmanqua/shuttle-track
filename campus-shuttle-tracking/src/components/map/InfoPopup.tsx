import { Popup } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import {
  getETAsForBus,
  getClosestBusToStop,
  getBusPosition,
} from "../../utils/calculateETA";
import type { Bus, SelectionType } from "../../types/shuttle";

interface Props {
  selection: SelectionType;
  buses: Bus[];
  onClose: () => void;
}

export default function InfoPopup({ selection, buses, onClose }: Props) {
  if (!selection) return null;

  const isBus = selection.type === "bus";
  const isStop = selection.type === "stop";

  let lng: number, lat: number, content: React.ReactNode;

  if (isBus) {
    [lng, lat] = getBusPosition(selection.data);
    const route = ROUTES[selection.data.routeId];
    const etas = getETAsForBus(selection.data);
    const isDwelling = selection.data.dwellRemaining > 0;

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
              backgroundColor: route.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
            {selection.data.name}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          {route.name}
          {isDwelling && (
            <span
              style={{
                marginLeft: 8,
                padding: "1px 6px",
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              AT STOP
            </span>
          )}
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
                  style={{ color: route.color, fontWeight: 700, flexShrink: 0 }}
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
    [lng, lat] = selection.data.coords;
    const route = ROUTES[selection.data.routeId];
    const result = getClosestBusToStop(selection.data, buses);

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
              backgroundColor: route.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
            {selection.data.name}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          {route.name}
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
                style={{ color: route.color, fontWeight: 700, fontSize: 15 }}
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
