import { useForm } from "react-hook-form";
import useAddDriver from "../../../hooks/useAddDriver";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
}

const schema = z.object({
  shortName: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  driver_license_no: z
    .string()
    .min(8, "Driver license number must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type DriverFormData = z.infer<typeof schema>;

const AddDriver = ({ open, onClose, title }: Props) => {
  const { mutate, isPending, isError, error } = useAddDriver({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: DriverFormData) => {
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
                <th className="text-left w-1/4 py-2">Username</th>
                <td className="py-2">
                  <input
                    {...register("shortName")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="eg:- palitha"
                  />
                  {errors.shortName && (
                    <p className="text-sm text-red-600">
                      {errors.shortName.message}
                    </p>
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
                    placeholder="eg:- K. Palitha Silva"
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
                <th className="text-left w-1/4 py-2">License No</th>
                <td className="py-2">
                  <input
                    {...register("driver_license_no")}
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="eg:- B4883288"
                  />
                  {errors.driver_license_no && (
                    <p className="text-sm text-red-600">
                      {errors.driver_license_no.message}
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
                    placeholder="eg:- 07XXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
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
            Add
          </button>
        </div>
      </form>

      {/* Backdrop */}
      <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div>
    </dialog>
  );
};

export default AddDriver;
