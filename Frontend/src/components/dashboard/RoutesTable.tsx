import { routesTableData, type RouteRow } from "./../data/Data";

function statusPill(status: RouteRow["status"]) {
  if (status === "Finished")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "In Progress") return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function progressStyle(percent: number) {
  if (percent === 100) return "progress-success";
  if (percent > 0) return "progress-primary";
  return "progress-neutral";
}

export default function RoutesTable() {
  return (
    <div className="bg-white border border-base-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-base-200">
        <h2 className="text-xl font-semibold tracking-tight">Today’s Routes</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Monitor route progress and driver assignments
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-fixed w-full min-w-[1300px]">
          <thead>
            <tr className="bg-base-100/70 text-sm text-base-content/70">
              <th className="px-6 py-4 w-24 font-semibold">Route</th>
              <th className="px-6 py-4 w-28 font-semibold">Truck</th>
              <th className="px-6 py-4 w-40 font-semibold">Truck ID</th>
              <th className="px-6 py-4 w-60 font-semibold">Driver</th>
              <th className="px-6 py-4 w-32 font-semibold text-center">
                Stops
              </th>
              <th className="px-6 py-4 w-[480px] font-semibold">Progress</th>
              <th className="px-6 py-4 w-36 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {routesTableData.map((r, idx) => {
              const percent =
                r.totalStops === 0
                  ? 0
                  : Math.round((r.coveredStops / r.totalStops) * 100);

              return (
                <tr
                  key={r.routeNo}
                  className={`
                    ${idx % 2 === 0 ? "bg-white" : "bg-base-100/40"}
                    hover:bg-base-200/40 transition
                  `}
                >
                  <td className="px-6 py-5 align-middle">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border border-base-200 bg-white">
                      {r.routeNo}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm border border-base-200 bg-base-100">
                      {r.truckNo}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle font-semibold">
                    {r.truckId}
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <div className="font-semibold">{r.driverName}</div>
                    <div className="text-xs text-base-content/50 mt-0.5">
                      Assigned driver
                    </div>
                  </td>

                  <td className="px-6 py-5 align-middle text-center">
                    <span className="text-base font-semibold">
                      {r.coveredStops}/{r.totalStops}
                    </span>
                    <div className="text-xs text-base-content/50">covered</div>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <div className="flex items-center gap-4">
                      <progress
                        className={`progress w-80 ${progressStyle(percent)}`}
                        value={percent}
                        max={100}
                      />
                      <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold border border-base-200 bg-white min-w-16">
                        {percent}%
                      </span>
                    </div>
                    <div className="text-xs text-base-content/50 mt-2">
                      Stops covered
                    </div>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusPill(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
