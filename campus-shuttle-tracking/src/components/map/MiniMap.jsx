import RouteLayer from "./RouteLayer";
import Map from "react-map-gl/mapbox";


const MiniMap = () => {

return (
    <div style={{ width: "100%", height: "100%" }}>
        <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: -1.575, latitude: 6.677, zoom: 14.5 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        interactive={false}
        attributionControl={false}
        >
        <RouteLayer activeRoute={null} />
        </Map>
    </div>
  )
}

export default MiniMap;