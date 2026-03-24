import MapView from "../map/MapView";

export default function AdminMapView() {
  return (
    <div style={{ display:"flex", width:"100vw", height:"100dvh", overflowY:"auto" }}>
      <MapView />
    </div>
  );
}
