import { useForm } from "react-hook-form";
import useUpdateFarmer from "../../hooks/useUpdateFarmer";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Farmer } from "../../hooks/useGenerateRoutes";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  existingFarmer: Farmer;
}

const schema = z.object({
  _id: z.string().min(24, "ID must be 24 characters"),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  address: z.string().min(3, "Address must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  route: z.number().min(1, "Route number is required"),
});

type FarmerFormData = z.infer<typeof schema>;

const UpdateFarmer = ({ open, onClose, title, existingFarmer }: Props) => {
  const defaultValues = {
    _id: existingFarmer._id,
    name: existingFarmer.name,
    address: existingFarmer.address,
    phone: existingFarmer.phone,
    route: Number(existingFarmer.route),
  };

  const { mutate, isError, error, isPending } = useUpdateFarmer({
    onSuccessClose: onClose,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmerFormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: FarmerFormData) => {
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
        className="modal-box max-w-3xl w-full p-0"
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
                    placeholder="Farmer _id"
                  />

                  {errors._id && (
                    <p className="text-sm text-red-600">{errors._id.message}</p>
                  )}
                </td>
              </tr>

              {/* Name */}
              <tr>
                <th className="text-left w-1/4 py-2">Name</th>
                <td className="py-2">
                  <input
                    {...register("name")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Farmer name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Address */}
              <tr>
                <th className="text-left w-1/4 py-2">Address</th>
                <td className="py-2">
                  <input
                    {...register("address")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Farmer address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </td>
              </tr>

              {/* Phone */}
              <tr>
                <th className="text-left w-1/4 py-2">Phone</th>
                <td className="py-2">
                  <input
                    {...register("phone")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="07XXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
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
