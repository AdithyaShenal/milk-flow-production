import MapComponent from "./MapComponent";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import RouteCardAdvance from "../components/map/RouteCardAdvance";
import MiniDashboard from "../components/MiniDashboard";
import useDispatchRoutes from "../hooks/useDispatchRoutes";
import useGenerateRoutes, { type Route } from "../hooks/useGenerateRoutes";

const RoutingPage = () => {
  const [mapRoute, setMapRoute] = useState<Route>();
  const [routeWiseResolve, setRouteWiseResolve] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);

  const queryClient = useQueryClient();

  const {
    mutate: saveRoutes,
    isPending,
    isError: isSaveRoutesrror,
    error: saveRoutesError,
  } = useDispatchRoutes();

  const {
    data: routes,
    isError,
    error,
    isFetching,
    refetch,
  } = useGenerateRoutes(routeWiseResolve, selectedRoute);

  const onRouteCardClick = (props: Route) => {
    setMapRoute(props);
  };

  const handleDelete = (route: Route) => {
    queryClient.setQueryData<Route[]>(
      routeWiseResolve
        ? ["routes", "route-wise", selectedRoute]
        : ["routes", "auto"],
      (old) => old?.filter((r) => r.license_no !== route.license_no),
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <p className="font-semibold text-sm">Generate Optimized Routes</p>

        <MiniDashboard />
        <div className="flex flex-wrap items-center gap-3 border border-base-300 bg-base-200 px-4 py-3 rounded-sm">
          <button className="btn btn-neutral btn-sm" onClick={() => refetch()}>
            {isFetching && (
              <span className="loading loading-spinner loading-xs" />
            )}
            Generate Optimized Routes
          </button>

          <select
            className="select select-sm select-bordered max-w-44"
            defaultValue=""
            onChange={(e) => setRouteWiseResolve(e.target.value === "route")}
          >
            <option selected value="auto">
              Auto Resolve
            </option>
            <option value="route">Route-wise</option>
          </select>

          {routeWiseResolve && (
            <select
              className="select select-sm select-bordered max-w-32"
              onChange={(e) => setSelectedRoute(Number(e.target.value))}
            >
              <option value={0}>All Routes</option>
              {[1, 2, 3, 4, 5, 6].map((r) => (
                <option key={r} value={r}>
                  Route {r}
                </option>
              ))}
            </select>
          )}

          <button
            className="btn btn-secondary btn-sm ml-auto"
            onClick={() => {
              if (!routes)
                return alert("Please generate optimized routes first");
              saveRoutes(routes);
            }}
          >
            {isPending && (
              <span className="loading loading-spinner loading-xs" />
            )}
            Dispatch
          </button>
        </div>

        {isSaveRoutesrror && (
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
            <span>
              {saveRoutesError?.response?.data?.message ||
                saveRoutesError.message}
            </span>
          </div>
        )}

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

        {/* === MAIN CONTENT === */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-4 h-[600px]">
          {/* Map */}
          <div className="border border-base-300 bg-base-200 rounded-sm overflow-hidden">
            <MapComponent route={mapRoute} />
          </div>

          {/* Routes Panel */}
          <div className="flex flex-col border border-slate-300 rounded-sm overflow-y-scroll">
            <div className="border-b border-slate-300 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Generated Routes
              </p>
            </div>

            <div className="flex-1 px-3 py-2">
              <ul className="space-y-2">
                {routes?.map((route) => (
                  <li key={route.license_no}>
                    <RouteCardAdvance
                      props={route}
                      onClickRoute={onRouteCardClick}
                      onClickDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutingPage;
