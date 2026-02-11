import { type RouteId } from "./../data/Data";

const routes: (RouteId | "ALL")[] = ["ALL", "R1", "R2", "R3", "R4", "R5", "R6"];

export default function RouteFilter({
  active,
  onChange,
}: {
  active: RouteId | "ALL";
  onChange: (val: RouteId | "ALL") => void;
}) {
  return (
    <div className="mt-3">
      {/* one line + scrollbar hidden */}
      <div
        className="
          flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {routes.map((r) => {
          const isActive = r === active;

          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className={`
                shrink-0 rounded-full px-3 py-1 text-xs font-medium transition
                border
                ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-base-content/70 border-base-200 hover:bg-base-100"
                }
              `}
            >
              {r === "ALL" ? "All" : `Route ${r.replace("R", "")}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
