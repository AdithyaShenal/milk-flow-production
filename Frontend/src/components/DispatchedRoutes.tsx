import useDeleteRoute from "../hooks/useDeleteRoute";
import type { Route } from "../hooks/useGenerateRoutes";
import useGetDispatchRoutes from "../hooks/useGetDispatchRoutes";
import RouteCardAdvance from "./map/RouteCardAdvance";
import useMapStateStore from "../stores/useMapStateStore";

const DispatchedRoutes = () => {
  const setMapRoute = useMapStateStore((state) => state.setMapRoute);

  const {
    mutate,
    error: deleteError,
    isError: isDeleteError,
  } = useDeleteRoute();

  const { data: routes, isError, error } = useGetDispatchRoutes();

  console.log(routes);

  const handleClick = (route: Route) => {
    setMapRoute(route);
  };

  const handleDelete = (route: Route) => {
    mutate(route._id);
  };

  return (
    <div className="h-full flex flex-col">
      {isDeleteError && (
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
          <span>{deleteError.message}</span>
        </div>
      )}

      <div className="flex-1 bg-base-100 border-base-300 p-6 overflow-y-auto">
        {isError && <p>{error.message}</p>}

        {routes?.length === 0 && (
          <p className="text-gray-400 text-sm">
            <i>No dispatched routes available</i>
          </p>
        )}

        {routes?.map((route) => (
          <RouteCardAdvance
            key={route._id}
            props={route}
            onClickRoute={handleClick}
            onClickDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default DispatchedRoutes;
