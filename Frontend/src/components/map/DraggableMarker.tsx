import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Location {
  lat: number;
  lon: number;
}

interface Props {
  position: Location;
  onChange: (location: Location) => void;
}

const DraggableMarker = ({ position, onChange }: Props) => {
  const [markerPos, setMarkerPos] = useState(position);

  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lon: e.latlng.lng };
      setMarkerPos(newPos);
      onChange(newPos);
    },
  });

  return (
    <Marker
      draggable
      position={[markerPos.lat, markerPos.lon]}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          const newPos = { lat: latlng.lat, lon: latlng.lng };
          setMarkerPos(newPos);
          onChange(newPos);
        },
      }}
    />
  );
};

export default DraggableMarker;
