import { useLocation, useNavigate } from "react-router-dom";
import type { Route, Production } from "../hooks/useGenerateRoutes";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Droplets,
  Phone,
  User,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CircleCheck,
  Droplet,
  CircleSlash,
  Hourglass,
} from "lucide-react";

const RouteDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const route: Route | undefined = location.state?.route;

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-base-content/50">
        <AlertTriangle className="size-12 opacity-40" />
        <p className="text-sm">No route data found.</p>
        <button className="btn btn-sm btn-neutral" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" /> Go Back
        </button>
      </div>
    );
  }

  // Filter out depot stops (null production = depot node)
  const farmerStops = route.stops.filter((stop) => stop.production !== null);

  const failedStops = farmerStops.filter(
    (s) => s.production?.status === "failed" || s.production?.blocked,
  );

  return (
    <div className="flex flex-col h-full bg-base-100 overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3  py-4 bg-base-100">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm btn-square"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base leading-tight truncate">
            {route.license_no}
          </h2>
          <p className="text-xs text-base-content/50 mt-0.5">
            Route: {route.route} | {route.model}
          </p>
        </div>
        <StatusBadge status={route.status} />
      </div>

      {/* ── Route Summary Strip ── */}
      <div className="grid grid-cols-4 rounded-sm bg-base-200 border border-base-300">
        <SummaryTile label="Farmer Stops" value={farmerStops.length} />
        <SummaryTile
          label="Distance"
          value={`${(route.distance / 1000).toFixed(1)} km`}
        />
        <SummaryTile label="Total Load" value={`${route.load} L`} />
        <SummaryTile
          label="Failures"
          value={failedStops.length}
          highlight={failedStops.length > 0}
        />
      </div>

      {/* ── Farmer Stop Cards ── */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-4">
        {farmerStops.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/40 gap-3">
            <Package className="size-10 opacity-30" />
            <p className="text-sm">No farmer stops on this route.</p>
          </div>
        ) : (
          farmerStops.map((stop, idx) => (
            <FarmerStopCard
              key={stop.node}
              stop={stop}
              index={idx + 1}
              total={farmerStops.length}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    dispatched: "badge-info",
    "in-progress": "badge-warning",
    completed: "badge-success",
    failed: "badge-error",
  };
  return (
    <span
      className={`badge badge-md font-medium ${map[status] ?? "badge-ghost"}`}
    >
      {status}
    </span>
  );
};

const SummaryTile = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div className="flex flex-col items-center py-3 px-2 gap-0.5">
    <span
      className={`text-base font-bold ${highlight ? "text-error" : "text-base-content"}`}
    >
      {value}
    </span>
    <span className="text-[10px] text-base-content/50 uppercase tracking-wide">
      {label}
    </span>
  </div>
);

const FarmerStopCard = ({
  stop,
  index,
  total,
}: {
  stop: {
    load_after_visit: number;
    node: number;
    order: number;
    production: Production | null;
  };
  index: number;
  total: number;
}) => {
  const production = stop.production!;
  const farmer = production.farmer;

  const isFailed = production.status === "failed" || production.blocked;
  const isSuccess =
    production.status === "success" || production.status === "collected";

  const collectedVol = production.collectedVolume ?? production.volume;

  return (
    <div
      className={`rounded-lg border bg-base-100 overflow-hidden ${
        isFailed ? "border-error/40" : "border-base-300"
      }`}
    >
      {/* Card Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 ${isFailed ? "bg-error/5" : "bg-base-200"}`}
      >
        {/* Stop number badge */}
        <div
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            isFailed
              ? "bg-error text-error-content"
              : "bg-primary text-primary-content"
          }`}
        >
          {index}
        </div>

        {/* Farmer name + address */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">
            {farmer.name}
          </p>
          <p className="text-xs text-base-content/50 truncate flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 shrink-0" />
            {farmer.address}
          </p>
        </div>

        {/* Status icon */}
        <div className="shrink-0">
          {isFailed ? (
            <XCircle className="size-5 text-error" />
          ) : isSuccess ? (
            <CheckCircle2 className="size-5 text-success" />
          ) : (
            <Clock className="size-5 text-warning" />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
        {/* Left column */}
        <div className="space-y-2">
          <DetailRow
            icon={<User className="size-3.5 text-base-content/40" />}
            label="Farmer ID"
            value={`#${farmer._id.slice(-6).toUpperCase()}`}
          />
          {farmer.phone && (
            <DetailRow
              icon={<Phone className="size-3.5 text-base-content/40" />}
              label="Phone"
              value={farmer.phone}
            />
          )}
          <DetailRow
            icon={<Droplets className="size-3.5 text-base-content/40" />}
            label="Volume"
            value={`${collectedVol} L`}
          />
          <DetailRow
            icon={<Truck className="size-3.5 text-base-content/40" />}
            label="Load After"
            value={`${stop.load_after_visit} L`}
          />
        </div>

        {/* Right column — Quality */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-base-content/40 font-semibold flex items-center gap-1"></p>
          <DetailRow
            icon={<CircleCheck className="size-3.5 text-base-content/40" />}
            label="Status"
            value={`${production.status}`}
          />
          <DetailRow
            icon={<Droplet className="size-3.5 text-base-content/40" />}
            label="Collcted Volume"
            value={`${production.collectedVolume}`}
          />
          <DetailRow
            icon={<CircleSlash className="size-3.5 text-base-content/40" />}
            label="Failure Reason"
            value={`${production.failure_reason}`}
          />
          <DetailRow
            icon={<Hourglass className="size-3.5 text-base-content/40" />}
            label="Submit Time"
            value={`${production.registration_time} L`}
          />
        </div>
      </div>

      {/* Failure reason banner */}
      {isFailed && production.failure_reason && (
        <div className="flex items-center gap-2 px-4 py-2 bg-error/10 border-t border-error/20">
          <AlertTriangle className="size-3.5 text-error shrink-0" />
          <p className="text-xs text-error">{production.failure_reason}</p>
        </div>
      )}

      {/* Stop connector line (not on last card) */}
      {index < total && (
        <div className="flex justify-center py-0 -mb-3">
          <div className="w-px h-3 bg-base-300" />
        </div>
      )}
    </div>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <span className="text-xs text-base-content/50">{label}:</span>
    <span className="text-xs font-medium text-base-content ml-auto">
      {value}
    </span>
  </div>
);

export default RouteDetailsPage;
