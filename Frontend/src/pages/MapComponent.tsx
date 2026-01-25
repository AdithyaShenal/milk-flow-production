import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import RoutingMachine from "../components/RoutingMachine";
import useGetDepotLocation from "../hooks/useGetDepotLocation";
import type { Route } from "../hooks/useGenerateRoutes";

interface Props {
  route?: Route;
}

const MapComponent = ({ route }: Props) => {
  const {
    data: depotCoords,
    isLoading,
    isError,
    error,
  } = useGetDepotLocation();

  const routeWaypoints = useMemo(() => {
    if (!route || !route.stops || !depotCoords) return [];

    const depotLocation = route.stops[0].production
      ? route.stops[0].production.farmer.location
      : depotCoords;

    return route.stops.map((stop) => {
      if (!stop.production) {
        return L.latLng(depotLocation.lat, depotLocation.lon);
      }

      const loc = stop.production.farmer.location;
      return L.latLng(loc.lat, loc.lon);
    });
  }, [route, depotCoords]);

  const initialCenter: [number, number] =
    routeWaypoints.length > 0
      ? [routeWaypoints[0].lat, routeWaypoints[0].lng]
      : [5.959464, 80.545205];

  if (isLoading) return <div className="skeleton h-full w-full" />;

  return (
    <>
      {isError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error?.response?.data?.message || error.message}</span>
        </div>
      )}
      <div className="h-full w-full ">
        <MapContainer
          key={JSON.stringify(routeWaypoints)}
          className="h-full rounded-xs border border-gray-300"
          center={initialCenter}
          zoom={10}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="© Mapbox"
            url={
              "https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
            }
          />

          <RoutingMachine
            waypoints={routeWaypoints}
            key={JSON.stringify(routeWaypoints)}
          />
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;
