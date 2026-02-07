import { useForm } from "react-hook-form";
import type { Truck } from "../../../hooks/useGetTrucks";
import useUpdateTrucks from "../../../hooks/useUpdateTruck";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  existingTruck: Truck;
}

const schema = z.object({
  _id: z.string().min(24, "ID must be 24 characters"),
  distance_travelled: z
    .number("Milage is required")
    .min(0, "Milage must be 0 or greater"),
  model: z.string().min(1, "Model name must be at least 1 character"),
  license_no: z.string().min(6, "License no must be at least 6 characters"),
  capacity: z
    .number("Capacity is required")
    .min(300, "Capacity must be greater than 300L")
    .max(10000, "Capacity must be lower than 10000L"),
  route: z
    .number("Route number is required")
    .min(1, "Route number is required"),
});

type TruckUpdateFormData = z.infer<typeof schema>;

const UpdateFarmer = ({ open, onClose, title, existingTruck }: Props) => {
  const defaultValues = {
    _id: existingTruck._id,
    model: existingTruck.model,
    license_no: existingTruck.license_no,
    capacity: existingTruck.capacity,
    distance_travelled: existingTruck.distance_travelled,
    route: existingTruck.route,
  };

  const { mutate, isError, error, isPending } = useUpdateTrucks({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TruckUpdateFormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: TruckUpdateFormData) => {
    mutate(data);
  };

  if (!open) return null;

  return (
    <dialog className="modal modal-open">
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
      <form
        className="modal-box max-w-3xl w-full p-0 border border-base-300"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Table Form */}
        <div className="overflow-x-auto px-20 py-5">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <th className="text-left w-1/4 py-2">ID</th>
                <td className="py-2">
                  <input
                    readOnly
                    {...register("_id")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="ID"
                  />
                  {errors._id && (
                    <p className="text-sm text-red-600">{errors._id.message}</p>
                  )}
                </td>
              </tr>

              {/* Name */}
              <tr>
                <th className="text-left w-1/4 py-2">Model</th>
                <td className="py-2">
                  <input
                    {...register("model")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Model"
                  />
                  {errors.model && (
                    <p className="text-sm text-red-600">
                      {errors.model.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Address */}
              <tr>
                <th className="text-left w-1/4 py-2">License No</th>
                <td className="py-2">
                  <input
                    {...register("license_no")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="License No"
                  />
                  {errors.license_no && (
                    <p className="text-sm text-red-600">
                      {errors.license_no.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Capacity */}
              <tr>
                <th className="text-left w-1/4 py-2">Capacity (Litres)</th>
                <td className="py-2">
                  <input
                    {...register("capacity", { valueAsNumber: true })}
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="License No"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-600">
                      {errors.capacity.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Milage */}
              <tr>
                <th className="text-left w-1/4 py-2">Milage (KM)</th>
                <td className="py-2">
                  <input
                    {...register("distance_travelled", { valueAsNumber: true })}
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="1000 (Kilometers)"
                  />
                  {errors.distance_travelled && (
                    <p className="text-sm text-red-600">
                      {errors.distance_travelled.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Route */}
              <tr>
                <th className="text-left w-1/4 py-2">Route</th>
                <td className="py-2">
                  <select
                    className="select select-bordered w-full"
                    {...register("route", { valueAsNumber: true })}
                  >
                    <option value="1">Route 1</option>
                    <option value="2">Route 2</option>
                    <option value="3">Route 3</option>
                    <option value="4">Route 4</option>
                    <option value="5">Route 5</option>
                    <option value="6">Route 6</option>
                  </select>
                  {errors.route && (
                    <p className="text-sm text-red-600">
                      {errors.route.message}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary">
            {isPending && <span className="loading loading-spinner"></span>}
            Update
          </button>
        </div>
      </form>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default UpdateFarmer;
