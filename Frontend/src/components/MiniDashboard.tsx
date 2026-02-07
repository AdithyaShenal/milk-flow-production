import { Boxes, Truck } from "lucide-react";
import useMiniDashboard from "../hooks/useMiniDashboard";

const MiniDashboard = () => {
  const { data, isError, error } = useMiniDashboard();

  if (isError)
    return (
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
    );

  return (
    <>
      <div className="w-full space-y-4">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Production Volume */}
          <div className="rounded-sm border bg-base-200 border-base-300 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 font-medium">
                  Total Production Volume
                </p>
                <p className="mt-2 text-xl font-bold text-base-content">
                  {data?.totalVolume?.toLocaleString()}
                </p>
                <p className="text-sm text-base-content/60 mt-1">Liters</p>
              </div>
              <div className="rounded-full p-2">
                <Boxes className="size-6 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Available Vehicle Capacity */}
          <div className="rounded-sm border bg-base-200 border-base-300 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 font-medium">
                  Available Capacity
                </p>
                <p className="mt-2 text-xl font-bold text-base-content">
                  {data?.availableCapacity?.toLocaleString()}
                </p>
                <p className="text-sm text-base-content/60 mt-1">Liters</p>
              </div>
              <Truck className="size-6 text-gray-500" />
            </div>
          </div>

          {/* Auto Resolvability */}
          <div className="rounded-sm border border-base-300 bg-base-200 p-4">
            <p className="text-xs uppercase tracking-wide text-base-content/60 font-medium mb-3">
              Auto Resolvability
            </p>
            {data?.autoResolvability ? (
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-lg font-semibold text-success">Enabled</p>
                  <p className="text-xs text-base-content/60">Active</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-lg font-semibold text-error">Disabled</p>
                  <p className="text-xs text-base-content/60">Deactive</p>
                </div>
              </div>
            )}
          </div>

          {/* All-Route-wise Resolvability */}
          <div className="rounded-sm border border-base-300 bg-base-200 p-4">
            <p className="text-xs uppercase tracking-wide text-base-content/60 font-medium mb-3">
              All Routes Resolvability
            </p>
            {data?.routeWiseResolvability ? (
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-lg font-semibold text-success">Enabled</p>
                  <p className="text-xs text-base-content/60">All routes OK</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-lg font-semibold text-error">Disabled</p>
                  <p className="text-xs text-base-content/60">
                    Issues detected
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <details className="collapse collapse-arrow bg-base-200 border-base-300 border rounded-sm">
          <summary className="collapse-title text-sm font-semibold">
            Route-wise Capacity Overview
          </summary>
          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-success/30 border border-success"></div>
                  <span className="text-base-content/60">Within Capacity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-error/30 border border-error"></div>
                  <span className="text-base-content/60">Over Capacity</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data?.capacityMap?.map((route) => {
                const isOverCapacity = route.totalVolume > route.totalCapacity;
                const utilizationPercent = Number(
                  ((route.totalVolume / route.totalCapacity) * 100).toFixed(1),
                );

                return (
                  <div
                    key={route.route}
                    className={`rounded-lg border p-3 transition-all ${
                      isOverCapacity
                        ? "bg-error/5 border-error/40"
                        : "bg-success/5 border-success/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-lg font-bold ${
                          isOverCapacity ? "text-error" : "text-success"
                        }`}
                      >
                        {route.route}
                      </span>
                      {isOverCapacity && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-error"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-base-content/60 font-medium">
                          Total Volume:
                        </span>
                        <span className="font-semibold text-base-content">
                          {route.totalVolume.toLocaleString()}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-base-content/60 font-medium">
                          Total Capacity:
                        </span>
                        <span className="font-semibold text-base-content">
                          {route.totalCapacity.toLocaleString()}L
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOverCapacity ? "bg-error" : "bg-success"
                            }`}
                            style={{
                              width: `${Math.min(utilizationPercent, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p
                          className={`text-xs text-center mt-1 font-medium ${
                            isOverCapacity ? "text-error" : "text-success"
                          }`}
                        >
                          {utilizationPercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </details>
      </div>
    </>
  );
};

export default MiniDashboard;
