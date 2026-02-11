import useMapStateStore from "../stores/useMapStateStore";
import MapComponent from "./MapComponent";
import { Link, Outlet } from "react-router-dom";

const RouteControlPage = () => {
  const mapRoute = useMapStateStore((state) => state.mapRoute);

  return (
    <div className="flex w-full h-[calc(100vh-6.5rem)] md:h-[calc(100vh-6.5rem)] gap-4">
      <div className="w-full md:w-1/2 h-full rounded-xs bg-base-100 flex flex-col">
        <p className="font-semibold text-sm">Route Management</p>
        <div className="breadcrumbs text-sm mb-4 overflow-hidden">
          <ul className="flex gap-2">
            <li>
              <Link to="in-progress">In Progress</Link>
            </li>
            <li>
              <Link to="dispatched">Dispatched</Link>
            </li>
          </ul>
        </div>

        <div className="border border-base-300 rounded-sm flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full ring-1 ring-base-300 rounded-xs bg-base-300 overflow-hidden">
        <MapComponent route={mapRoute ?? undefined} />
      </div>
    </div>
  );
};

export default RouteControlPage;
