import useDeleteRoute from "../hooks/useDeleteRoute";
import type { Route } from "../hooks/useGenerateRoutes";
import useGetInProgressRoutes from "../hooks/useGetInProgressRoutes";
import RouteCardAdvance from "./map/RouteCardAdvance";
import useMapStateStore from "../stores/useMapStateStore";

const InProgressRoutes = () => {
  const setMapRoute = useMapStateStore((state) => state.setMapRoute);

  const {
    data: routesInProgress,
    isError: isInProgressError,
    error: inProgressError,
  } = useGetInProgressRoutes();

  const {
    mutate,
    error: deleteError,
    isError: isDeleteError,
  } = useDeleteRoute();

  const handleClick = (route: Route) => {
    setMapRoute(route);
  };

  const handleDelete = (route: Route) => {
    mutate(route._id);
  };

  console.log(routesInProgress);

  return (
    <div className="h-full flex flex-col">
      {isInProgressError && (
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
          <span>
            {inProgressError.response?.data.message || inProgressError.message}
          </span>
        </div>
      )}

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

      <div className="flex-1 bg-base-100 border-base-300 p-4 overflow-y-auto">
        {routesInProgress?.length === 0 && (
          <p className="text-gray-400 text-sm">
            <i>No In Progress routes available</i>
          </p>
        )}

        {routesInProgress?.map((route) => (
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

export default InProgressRoutes;
