import useDeleteTrucks from "../../../hooks/useDeleteTruck";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  truckId: string;
}

const DeleteDriver = ({ open, onClose, title, subtitle, truckId }: Props) => {
  const { mutate, isError, error, isPending } = useDeleteTrucks({
    onSuccess: () => {
      onClose();
    },
  });

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
      <form className="modal-box max-w-3xl w-full p-0 border border-base-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="py-2">{subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={() => {
              mutate({ truckId });
            }}
          >
            {isPending && <span className="loading loading-spinner"></span>}
            Delete
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

export default DeleteDriver;
