import useHoldProduction from "../../../hooks/useHoldProduction";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  productionId: string;
  buttonText: string;
}

const DeleteFarmer = ({
  open,
  onClose,
  title,
  subtitle,
  productionId,
  buttonText,
}: Props) => {
  const { mutate } = useHoldProduction({
    onSuccess: () => {
      onClose();
    },
  });

  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <form className="modal-box max-w-3xl w-full p-0">
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
            className="btn btn-warning"
            onClick={() => {
              mutate(productionId);
            }}
          >
            {buttonText}
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

export default DeleteFarmer;
