import type { Route } from "../../hooks/useGenerateRoutes";

interface Props {
  props: Route;
  onClickRoute: (props: Route) => void;
  onClickDelete: (props: Route) => void;
}

const RouteCard = ({ props, onClickRoute, onClickDelete }: Props) => {
  return (
    <div
      className="
        mx-2 my-3
        rounded-sm
        border border-gray-200
        bg-white
        p-4
        transition-all
        hover:border-gray-400
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          {/* License number (Primary) */}
          <h3 className="text-lg font-semibold text-gray-900">
            {props.license_no}
          </h3>

          {/* Truck model + Route number (Secondary, faded) */}
          <div className="text-xs text-gray-500 mt-0.5">
            {props.model} · Route {props.route}
          </div>
        </div>

        {/* Status */}
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          {props.status}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200/80 mb-3" />

      {/* Details */}
      <div className="space-y-2 text-sm">
        <InfoRow label="Stops" value={props.stops.length - 2} />
        <InfoRow label="Distance" value={`${props.distance / 1000} km`} />
        <InfoRow label="Time" value="1h 50m" />
        <InfoRow label="Load" value={`${props.load} L`} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onClickRoute(props)}
          className="btn btn-neutral btn-sm"
        >
          View
        </button>

        <button
          onClick={() => onClickDelete(props)}
          className="btn btn-error btn-sm text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between text-gray-500">
    <span>{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default RouteCard;
