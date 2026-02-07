import { useForm } from "react-hook-form";
import useGetDrivers, { type Driver } from "../hooks/useGetDrivers";
import { Pen, Plus, Trash } from "lucide-react";
import { useState } from "react";
import UpdateDriver from "./Modals/Driver/UpdateDriver";
import DeleteDriver from "./Modals/Driver/DeleteDriver";
import AddDriver from "./Modals/Driver/AddDriver";
import { useToggleDriverStatus } from "../hooks/useToggleDriverStatus";
import FullLoadingPage from "./Loading/FullLoadingPage";

const defaultValues = {
  search: "",
  filterBy: "",
  status: "all",
};

type DriverModalState =
  | { type: null }
  | { type: "update"; data: Driver }
  | { type: "delete"; data: Driver }
  | { type: "add" };

const DriverManagement = () => {
  const [modal, setModal] = useState<DriverModalState>({ type: null });

  const { register, handleSubmit, getValues } = useForm({
    defaultValues,
  });

  const { data, isError, error, refetch, isFetching, isLoading } =
    useGetDrivers(getValues());

  const {
    mutate: toggleDriverStatus,
    isPending,
    isError: isToggleError,
    error: toggleError,
  } = useToggleDriverStatus();

  const statusHandler = (status: string) => {
    if (status === "available")
      return <div className="badge badge-primary">Available</div>;
    if (status === "unavailable")
      return <div className="badge badge-error">Unavailable</div>;
    if (status === "onDuty")
      return <div className="badge badge-primary">On Duty</div>;
  };

  const openUpdateModal = (driverProps: Driver) =>
    setModal({ type: "update", data: driverProps });

  const openDeleteModal = (driver: Driver) =>
    setModal({ type: "delete", data: driver });

  const openAddModal = () => setModal({ type: "add" });

  const closeModal = () => setModal({ type: null });

  const submitHandler = () => {
    refetch();
  };

  if (isLoading) return <FullLoadingPage />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <p className="font-semibold text-sm">Driver Management</p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => openAddModal()}
        >
          <Plus className="size-3" />
          <p className="text-sm">Add Driver</p>
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
          <option value="name">Name</option>
        </select>

        {/* Status */}
        <select className="select" {...register("status")}>
          <option disabled={true}> Select by status</option>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="onDuty">On Duty</option>
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
      {modal.type === "update" && (
        <UpdateDriver
          open
          onClose={closeModal}
          existingDriver={modal.data}
          title="Update"
        />
      )}

      {modal.type === "delete" && (
        <DeleteDriver
          open
          onClose={closeModal}
          title="Delete Farmer"
          subtitle={`Delete ${modal.data.name}?`}
          driverId={modal.data._id}
        />
      )}

      {modal.type === "add" && (
        <AddDriver open onClose={closeModal} title="Add new driver" />
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
            {toggleError.response?.data.message || toggleError.message}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto h-auto w-auto border border-base-300 rounded-sm">
        <table className="table table-md table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Phone</td>
              <td>License</td>
              <td>Status</td>
              <td>Current Truck</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {data?.map((driver) => (
              <tr key={driver._id} className="hover:bg-base-200 cursor-pointer">
                <td>{driver._id}</td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.driver_license_no}</td>
                <td>{statusHandler(driver.status)}</td>
                <td>N/A</td>
                <td>
                  {isPending && (
                    <span className="loading loading-ring loading-md"></span>
                  )}
                  {!isPending && (
                    <label className="toggle text-base-content">
                      <input
                        type="checkbox"
                        checked={driver.status === "available"}
                        disabled={
                          driver.status !== "available" &&
                          driver.status !== "unavailable"
                        }
                        onChange={() => {
                          if (
                            driver.status !== "available" &&
                            driver.status !== "unavailable"
                          )
                            return;
                          toggleDriverStatus({
                            driverId: driver._id,
                            status:
                              driver.status === "available"
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
                  )}
                </td>
                <td className="flex gap-2 justify-end">
                  <button
                    className="btn btn-warning btn-ghost btn-sm"
                    onClick={() => openUpdateModal(driver)}
                  >
                    <Pen className="size-4" />
                  </button>

                  <button
                    className="btn btn-error btn-sm btn-ghost"
                    onClick={() => openDeleteModal(driver)}
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

export default DriverManagement;
