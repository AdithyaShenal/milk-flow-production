import { useForm } from "react-hook-form";
import { Pen, Plus, Trash } from "lucide-react";
import useGetTrucks, { type Truck } from "../hooks/useGetTrucks";
import { useState } from "react";
import AddTruck from "./Modals/Truck/AddTruck";
import DeleteTruck from "./Modals/Truck/DeleteTruck";
import UpdateTruck from "./Modals/Truck/UpdateTruck";
import { useToggleTruckStatus } from "../hooks/useToggleTruckStatus";
import FullLoadingPage from "./Loading/FullLoadingPage";

const defaultValues = {
  search: "",
  filterBy: "",
  status: "all",
};

type TruckModalState =
  | { type: null }
  | { type: "update"; data: Truck }
  | { type: "delete"; data: Truck }
  | { type: "add" };

const TruckManagement = () => {
  const [modal, setModal] = useState<TruckModalState>({ type: null });
  const { register, handleSubmit, getValues } = useForm({
    defaultValues,
  });

  const { data, isError, error, refetch, isFetching, isLoading } =
    useGetTrucks(getValues());

  const {
    mutate: toggleTruckStatus,
    isError: isToggleError,
    error: ToggleError,
  } = useToggleTruckStatus();

  const statusHandler = (status: string) => {
    if (status === "available")
      return <div className="badge badge-primary">Available</div>;
    if (status === "unavailable")
      return <div className="badge badge-error">Unavailable</div>;
    if (status === "inService")
      return <div className="badge badge-primary">In Service</div>;
  };

  const openAddModal = () => setModal({ type: "add" });

  const openUpdateModal = (truckProps: Truck) =>
    setModal({ type: "update", data: truckProps });

  const openDeleteModal = (truckProps: Truck) =>
    setModal({ type: "delete", data: truckProps });

  const closeModal = () => setModal({ type: null });

  const submitHandler = () => {
    refetch();
  };

  if (isLoading) return <FullLoadingPage />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <p className="font-semibold text-sm">Truck Management</p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => openAddModal()}
        >
          <Plus className="size-3" />
          <p className="text-sm">Add Truck</p>
        </button>
      </div>

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
        <select className="select" {...register("filterBy")}>
          <option disabled={true}>Filter</option>
          <option value="">None</option>
          <option value="id">ID</option>
          <option value="license_no">License No</option>
          <option value="model">Model</option>
        </select>

        {/* Status */}
        <select className="select" {...register("status")}>
          <option disabled={true}> Select by status</option>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="inService">In Service</option>
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

      {/* Modals */}
      {modal.type === "add" && (
        <AddTruck open onClose={closeModal} title="Update" />
      )}

      {modal.type === "delete" && (
        <DeleteTruck
          open
          onClose={closeModal}
          title="Delete Truck"
          subtitle={`Delete ${modal.data.model}?`}
          truckId={modal.data._id}
        />
      )}

      {modal.type === "update" && (
        <UpdateTruck
          open
          onClose={closeModal}
          title="Update Truck Details"
          existingTruck={modal.data}
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

      {isToggleError && (
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
          <span>
            {ToggleError.response?.data.message || ToggleError.message}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto h-auto w-auto border border-base-300 rounded-sm">
        <table className="table table-md table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <td>ID</td>
              <td>Model</td>
              <td>License No</td>
              <td>Route</td>
              <td>Status</td>
              <td>Capacity</td>
              <td>Milage</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {data?.map((truck) => (
              <tr key={truck._id} className="hover:bg-base-200 cursor-pointer">
                <td>{truck._id}</td>
                <td>{truck.model}</td>
                <td>{truck.license_no}</td>
                <td>{truck.route}</td>
                <td>{statusHandler(truck.status)}</td>
                <td>{truck.capacity} L</td>
                <td>{truck.distance_travelled} KM</td>
                <td>
                  <label className="toggle text-base-content">
                    <input
                      type="checkbox"
                      checked={truck.status === "available"}
                      disabled={
                        truck.status !== "available" &&
                        truck.status !== "unavailable"
                      }
                      onChange={() => {
                        if (
                          truck.status !== "available" &&
                          truck.status !== "unavailable"
                        )
                          return;

                        toggleTruckStatus({
                          truckId: truck._id,
                          status:
                            truck.status === "available"
                              ? "unavailable"
                              : "available",
                        });
                      }}
                    />
                    <svg
                      aria-label="enabled"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="4"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </g>
                    </svg>
                    <svg
                      aria-label="disabled"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </label>
                </td>
                <td className="flex gap-2 justify-end">
                  <button
                    className="btn btn-warning btn-ghost btn-sm"
                    onClick={() => openUpdateModal(truck)}
                  >
                    <Pen className="size-4" />
                  </button>

                  <button
                    className="btn btn-error btn-sm btn-ghost"
                    onClick={() => openDeleteModal(truck)}
                  >
                    <Trash className="size-4" />
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

export default TruckManagement;
