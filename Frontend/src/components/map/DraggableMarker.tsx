import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

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
