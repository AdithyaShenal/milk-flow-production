import SimpleMap from "./Modals/SimpleMap";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  coords: {
    lat: number;
    lng: number;
  };
}

const MapModal = ({ open, onClose, title, coords }: Props) => {
  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl w-full overflow-auto">
        {title && <h3 className="font-bold text-lg my-2">{title}</h3>}
        {/* Simple Map */}
        <div className="h-100">
          <SimpleMap coords={coords} />
        </div>

        {/* Simple Map */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default MapModal;
