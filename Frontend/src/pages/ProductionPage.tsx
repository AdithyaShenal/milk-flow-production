import { MapPin, Lock } from "lucide-react";
import useGetProductions from "../hooks/useGetProductions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Coords } from "./FarmerPage";
import MapModal from "../components/MapModal";
import HoldModal from "../components/Modals/Productions/HoldModal";
import type { Production } from "../hooks/useGenerateRoutes";

const defaultValues = {
  search: "",
  filterBy: "",
  date: "",
  status: "pending",
};

type ProductionModalState =
  | { type: null }
  | { type: "map"; data: Coords }
  | { type: "hold"; data: Production }
  | { type: "unhold"; data: Production };

const ProductionPage = () => {
  const [modal, setModal] = useState<ProductionModalState>({ type: null });
  const { register, handleSubmit, getValues } = useForm({
    defaultValues,
  });

  const { data, isError, error, refetch, isFetching, isLoading } =
    useGetProductions(getValues());

  const statusHandler = (status: string) => {
    if (status === "pending")
      return <div className="badge badge-warning">Pending</div>;
    if (status === "failed")
      return <div className="badge badge-error">Failed</div>;
    if (status === "collected")
      return <div className="badge badge-success">Collected</div>;
    if (status === "awaiting pickup")
      return <div className="badge badge-primary">Awaiting</div>;
  };

  const openMapModal = (coords: Coords) =>
    setModal({ type: "map", data: coords });

  const openHoldModal = (production: Production) =>
    setModal({ type: "hold", data: production });

  const openUnholdModal = (production: Production) =>
    setModal({ type: "unhold", data: production });

  const closeModal = () => setModal({ type: null });

  const submitHandler = () => {
    refetch();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="font-semibold text-sm">Production Overview</p>

      <form
        className="flex items-center gap-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Search bar */}
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" placeholder="Search" {...register("search")} />
        </label>

        {/* Filter */}
        <select
          defaultValue="none"
          className="select"
          {...register("filterBy")}
        >
          <option disabled={true}>Filter</option>
          <option value="none">None</option>
          <option value="id">ID</option>
          <option value="name">Name</option>
        </select>

        {/* Date */}
        <input type="date" className="input" {...register("date")} />

        {/* Status */}
        <select
          defaultValue="pending"
          className="select"
          {...register("status")}
        >
          <option disabled={true}> Select by status</option>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="awaiting pickup">Awaiting pickup</option>
        </select>

        {/* Search Button */}
        <button className="btn btn-neutral" type="submit">
          <span
            className={`${
              (isFetching || isLoading) && "loading"
            } loading-spinner`}
          ></span>
          Search
        </button>
      </form>

      {/* Modal */}
      {modal.type === "map" && (
        <MapModal open onClose={closeModal} title="Map" coords={modal.data} />
      )}

      {modal.type === "hold" && (
        <HoldModal
          open
          onClose={closeModal}
          title="Hold Production"
          subtitle="Upon hodling production will consider for route generation"
          productionId={modal.data._id}
          buttonText="Hold"
        />
      )}

      {modal.type === "unhold" && (
        <HoldModal
          open
          onClose={closeModal}
          title="Unhold Production"
          subtitle="Upon hodling production will consider for route generation"
          productionId={modal.data._id}
          buttonText="Unhold"
        />
      )}

      {/* Alert */}
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
          <span>{error.response?.data.message || error.message}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto h-auto w-auto border  border-base-300 rounded-sm">
        <table className="table table-md table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <td>Farmer ID</td>
              <td>Name</td>
              <td>Address</td>
              <td>Production Volume</td>
              <td>Status</td>
              <td>Registration</td>
              <td>Route</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {data?.map((prod) => (
              <tr
                key={prod._id}
                className={`hover:bg-base-200 cursor-pointer ${
                  prod.blocked ? "bg-red-100" : ""
                }`}
              >
                <td>{prod.farmer._id}</td>
                <td>{prod.farmer.name}</td>
                <td>{prod.farmer.address}</td>
                <td>{prod.volume} L</td>
                <td>{statusHandler(prod.status)}</td>
                <td>{new Date(prod.registration_time).toLocaleString()}</td>
                <td>{prod.farmer.route}</td>
                <td className="flex gap-2 justify-end">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openMapModal({
                        lat: prod.farmer.location.lat,
                        lng: prod.farmer.location.lon,
                      })
                    }
                  >
                    <MapPin className="size-4" />
                  </button>
                  <button
                    className="btn btn-primary btn-ghost btn-sm"
                    onClick={() => {
                      if (prod.blocked) {
                        openUnholdModal(prod);
                      } else {
                        openHoldModal(prod);
                      }
                    }}
                  >
                    <Lock className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionPage;
