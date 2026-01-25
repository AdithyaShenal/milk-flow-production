import MapComponent from "./MapComponent";
import type { Route } from "./RoutingPage";
import { useState } from "react";
import RouteCard from "../components/map/RouteCard";
import useGetHistory from "../hooks/useGetHistory";

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

      <div className="flex w-full h-[600px] md:h-[600px] gap-4">
        {/* Routes List */}
        <div className="w-full md:w-1/2 h-full ring-1 ring-slate-200 rounded-xs bg-white flex flex-col">
          {/* Header + Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between p-2 ml-2 border-b border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              History
            </p>
          </div>

          {/* Routes List */}
          <div className="flex-1 p-4 overflow-y-auto">
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
        <div className="w-full md:w-1/2 h-full ring-1 ring-slate-200 rounded-xs bg-white overflow-hidden">
          <MapComponent route={mapRoute} />
        </div>
      </div>
    </>
  );
};

export default RouteHistoryPage;
