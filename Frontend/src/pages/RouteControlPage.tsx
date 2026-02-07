import useMapStateStore from "../stores/useMapStateStore";
import MapComponent from "./MapComponent";
import { Link, Outlet } from "react-router-dom";

const RouteControlPage = () => {
  const mapRoute = useMapStateStore((state) => state.mapRoute);

  return (
    <div className="flex w-full h-[600px] md:h-[600px] gap-4">
      <div className="w-full md:w-1/2 h-full rounded-xs bg-base-100 flex flex-col">
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

        <div className="border border-base-300 rounded-sm h-full">
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
