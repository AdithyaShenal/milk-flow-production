import MapComponent from "./MapComponent";
import { useState } from "react";
import RouteCard from "../components/map/RouteCard";
import useGetHistory from "../hooks/useGetHistory";
import type { Route } from "../hooks/useGenerateRoutes";

const RouteHistoryPage = () => {
  const [mapRoute, setMapRoute] = useState<Route>();

  const { data: routes, isError, error } = useGetHistory();

  const handleClick = (props: Route) => {
    setMapRoute(props);
  };

  return (
    <>
      {isError && (
        <div role="alert" className="alert alert-error mb-3">
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
          <span>{error.response?.data.message || error.message}</span>
        </div>
      )}

      <div className="flex w-full h-[calc(100vh-6.5rem)] md:h-[calc(100vh-6.5rem)] gap-4">
        {/* Routes List */}
        <div className="w-full md:w-1/2 h-full rounded-xs bg-base-100 flex flex-col">
          <p className="font-semibold text-sm mb-5">Routes History</p>

          {/* Routes List - Scrollable Container */}
          <div className="flex-1 p-4 overflow-y-auto ring-1 ring-base-300 rounded-xs">
            {routes?.length === 0 && (
              <p className="text-slate-400 text-sm italic">
                No history available yet
              </p>
            )}

            {routes?.map((route) => (
              <RouteCard
                key={route._id}
                props={route}
                onClickRoute={handleClick}
              />
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-1/2 h-full ring-1 ring-base-300 rounded-xs bg-base-300 overflow-hidden">
          <MapComponent route={mapRoute} />
        </div>
      </div>
    </>
  );
};

export default RouteHistoryPage;
