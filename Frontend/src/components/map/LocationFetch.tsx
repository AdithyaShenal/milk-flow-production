import { MapContainer, TileLayer } from "react-leaflet";
import DraggableMarker from "./DraggableMarker";

interface Location {
  lat: number;
  lon: number;
}

interface Props {
  initialLocation?: Location;
  onLocationChange: (location: Location) => void;
}

const DEFAULT_LOCATION: Location = {
  lat: 6.1887723305151265,
  lon: 80.90262807303365,
};

const LocationFetchMap = ({ initialLocation, onLocationChange }: Props) => {
  const location = initialLocation ?? DEFAULT_LOCATION;

  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full rounded border border-gray-300"
    >
      <TileLayer
        attribution="© Mapbox"
        url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
      />

      <DraggableMarker position={location} onChange={onLocationChange} />
    </MapContainer>
  );
};

export default LocationFetchMap;
