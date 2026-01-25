import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SimpleMarker } from "../map/SimpleMarker";

interface Props {
  coords: {
    lat: number;
    lng: number;
  };
}

const SimpleMap = ({ coords }: Props) => {
  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full border border-gray-300 rounded-sm"
    >
      <TileLayer
        attribution="© Mapbox"
        url={
          "https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
        }
      />

      <Marker position={[coords.lat, coords.lng]} icon={SimpleMarker()}>
        <Popup>Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default SimpleMap;
