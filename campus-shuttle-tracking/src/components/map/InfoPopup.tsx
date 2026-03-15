import { Popup } from "react-map-gl/mapbox";
import { ROUTES } from "../../services/mockShuttleData";
import {
  getNextStop,
  getClosestBusToStop,
  getBusPosition,
} from "../../utils/calculateETA";
import type { Bus, SelectionType, StopCrowds } from "../../types/shuttle";

interface Props {
  selection: SelectionType;
  buses: Bus[];
  crowds: StopCrowds;
  onClose: () => void;
}

// People count → color: green (low) → yellow → red (high)
function crowdColor(count: number): string {
  if (count <= 8) return "#16a34a"; // green
  if (count <= 16) return "#d97706"; // amber
  return "#dc2626"; // red
}

function crowdLabel(count: number): string {
  if (count <= 8) return "Light";
  if (count <= 16) return "Moderate";
  return "Busy";
}

function CrowdBar({ count }: { count: number }) {
  const pct = Math.round((count / 25) * 100);
  const color = crowdColor(count);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: "#64748b" }}>
          👥 {count} waiting
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            padding: "1px 6px",
            backgroundColor: color + "18",
            borderRadius: 4,
          }}
        >
          {crowdLabel(count)}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 6,
          backgroundColor: "#f1f5f9",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 999,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, backgroundColor: "#f1f5f9", margin: "10px 0" }} />
  );
}

function Label({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#94a3b8",
        marginBottom: 4,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
}

export default function InfoPopup({
  selection,
  buses,
  crowds,
  onClose,
}: Props) {
  if (!selection) return null;

  const isBus = selection.type === "bus";
  const isStop = selection.type === "stop";

  let lng: number, lat: number, content: React.ReactNode;

  // ── BUS CLICKED ──────────────────────────────────────────────────
  if (isBus) {
    const bus = selection.data;
    [lng, lat] = getBusPosition(bus);
    const route = ROUTES[bus.routeId];
    const next = getNextStop(bus);
    const isDwelling = bus.dwellRemaining > 0;

    content = (
      <div>
        {/* Route colour bar at top */}
        <div
          style={{
            height: 4,
            backgroundColor: route.color,
            borderRadius: "8px 8px 0 0",
            margin: "-12px -12px 12px -12px",
          }}
        />

        <Label text="Bus" />
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 2,
          }}
        >
          {bus.name}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: route.color,
            fontWeight: 600,
            backgroundColor: route.color + "15",
            padding: "3px 8px",
            borderRadius: 99,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: route.color,
            }}
          />
          {route.name}
        </div>

        <Divider />

        <Label text="Next Stop" />
        {next ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>
              📍 {next.stop.name}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                backgroundColor: route.color,
                padding: "2px 8px",
                borderRadius: 99,
                marginLeft: 8,
                flexShrink: 0,
              }}
            >
              {next.etaMinutes} min
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: "#94a3b8" }}>
            Completing loop…
          </span>
        )}

        {isDwelling && (
          <div
            style={{
              marginTop: 10,
              padding: "6px 10px",
              backgroundColor: "#FEF9C3",
              borderRadius: 6,
              fontSize: 12,
              color: "#854D0E",
              fontWeight: 600,
            }}
          >
            🛑 Stopped at this stop
          </div>
        )}
      </div>
    );
  }

  // ── STOP CLICKED ─────────────────────────────────────────────────
  if (isStop) {
    const stop = selection.data;
    const count = crowds[stop.id] ?? 0;
    [lng, lat] = stop.coords;
    const route = ROUTES[stop.routeId];
    const result = getClosestBusToStop(stop, buses);

    content = (
      <div>
        {/* Route colour bar at top */}
        <div
          style={{
            height: 4,
            backgroundColor: route.color,
            borderRadius: "8px 8px 0 0",
            margin: "-12px -12px 12px -12px",
          }}
        />

        <Label text="Stop" />
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 2,
          }}
        >
          {stop.name}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: route.color,
            fontWeight: 600,
            backgroundColor: route.color + "15",
            padding: "3px 8px",
            borderRadius: 99,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: route.color,
            }}
          />
          {route.name}
        </div>

        <Divider />

        <Label text="Next Bus" />
        {result ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 13, color: "#334155" }}>
              🚌 {result.bus.name}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                backgroundColor: route.color,
                padding: "2px 8px",
                borderRadius: 99,
                marginLeft: 8,
                flexShrink: 0,
              }}
            >
              {result.etaMinutes} min
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: 13,
              color: "#94a3b8",
              display: "block",
              marginBottom: 12,
            }}
          >
            No buses on this route
          </span>
        )}

        <Divider />

        <Label text="Crowd Level" />
        <CrowdBar count={count} />
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
      <div
        style={{
          padding: 12,
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {content}
      </div>
    </Popup>
  );
}
