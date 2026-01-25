import useMiniDashboard from "../hooks/useMiniDashboard";

const MiniDashboard = () => {
  const { data, isError, error } = useMiniDashboard();

  console.log(data);

  if (isError)
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
      </>
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-sm">
        {[
          {
            label: "Total Production Volume",
            value: data?.totalVolume,
            unit: "Liters",
          },
          {
            label: "Available Vehicle Capacity",
            value: data?.availableCapacity,
            unit: "Liters",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-sm border border-base-300 bg-base-200 px-4 py-3"
          >
            <p className="text-xs uppercase tracking-wide text-slate-600">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {item.value}
              <span className="ml-1 text-sm font-normal text-slate-500">
                {item.unit}
              </span>
            </p>
          </div>
        ))}

        <div className="rounded-sm border border-base-300 bg-base-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Auto Resolvability
          </p>
          {data?.autoResolvability && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-sm border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Enabled
            </div>
          )}

          {!data?.autoResolvability && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-sm border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Disabled
            </div>
          )}
        </div>

        <div className="rounded-sm border border-base-300 bg-base-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            All-Route-wise Resolvability
          </p>

          {data?.routeWiseResolvability && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-sm border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Enabled
            </div>
          )}

          {!data?.routeWiseResolvability && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-sm border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Disabled
            </div>
          )}
        </div>

        {/* Dummy */}
        <div className="rounded-sm border border-base-300 bg-base-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Route-wise Resolvability
          </p>
          <div className="grid grid-cols-6 mt-1">
            <div className="w-8 h-8 bg-green-200 flex justify-center items-center border border-green-500 text-green-600 rounded-sm">
              1
            </div>
            <div className="w-8 h-8 bg-green-200 flex justify-center items-center border border-green-500 text-green-600 rounded-sm">
              2
            </div>
            <div className="w-8 h-8 bg-green-200 flex justify-center items-center border border-green-500 text-green-600 rounded-sm">
              3
            </div>
            <div className="w-8 h-8 bg-green-200 flex justify-center items-center border border-green-500 text-green-600 rounded-sm">
              4
            </div>
            <div className="w-8 h-8 bg-green-200 flex justify-center items-center border border-green-500 text-green-600 rounded-sm">
              5
            </div>
            <div className="w-8 h-8 bg-red-200 flex justify-center items-center border border-red-500 text-red-600 rounded-sm">
              6
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniDashboard;
