import { useForm } from "react-hook-form";
import { MapPin, Pen, Plus, Trash } from "lucide-react";
import useGetFarmers from "../hooks/useGetFarmers";
import { useState } from "react";
import MapModal from "../components/MapModal";
import UpdateFarmer from "../components/Modals/UpdateFarmer";
import DeleteFarmer from "../components/Modals/DeleteFarmer";
import FullLoadingPage from "../components/Loading/FullLoadingPage";
import type { Farmer } from "../hooks/useGenerateRoutes";

export interface Coords {
  lat: number;
  lng: number;
}

const defaultValues = {
  search: "",
  filterBy: "",
  route: "all",
};

type FarmerModalState =
  | { type: null }
  | { type: "map"; data: Coords }
  | { type: "update"; data: Farmer }
  | { type: "delete"; data: Farmer }
  | { type: "add" };

const FarmerPage = () => {
  const [modal, setModal] = useState<FarmerModalState>({ type: null });

  const { register, handleSubmit, getValues } = useForm({
    defaultValues,
  });

  const { data, isError, error, refetch, isFetching, isLoading } =
    useGetFarmers(getValues());

  const submitHandler = () => {
    refetch();
  };

  const openMapModal = (coords: Coords) =>
    setModal({ type: "map", data: coords });

  const openUpdateModal = (farmer: Farmer) =>
    setModal({ type: "update", data: farmer });

  const openDeleteModal = (farmer: Farmer) =>
    setModal({ type: "delete", data: farmer });

  const closeModal = () => setModal({ type: null });

  if (isLoading) return <FullLoadingPage />;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">Farmer Management</p>
        <button className="btn btn-primary btn-sm">
          <Plus className="size-3" />
          <p className="text-sm">Add Farmer</p>
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
          <option value="address">Address</option>
        </select>

        {/* Route */}
        <select className="select" {...register("route")}>
          <option disabled={true}> Select by Route</option>
          <option value="all">All</option>
          <option value="1">Route 1</option>
          <option value="2">Route 2</option>
          <option value="3">Route 3</option>
          <option value="4">Route 4</option>
          <option value="5">Route 5</option>
          <option value="6">Route 6</option>
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

      {modal.type === "update" && (
        <UpdateFarmer
          open
          onClose={closeModal}
          title="Update Farmer"
          existingFarmer={modal.data}
        />
      )}

      {modal.type === "delete" && (
        <DeleteFarmer
          open
          onClose={closeModal}
          title="Delete Farmer"
          subtitle={`Delete ${modal.data.name}?`}
          farmerId={modal.data._id}
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

      {/* Modal */}

      {/* Table */}
      <div className="overflow-x-auto h-auto w-auto border border-base-300 rounded-sm">
        <table className="table table-md table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Address</td>
              <td>Phone</td>
              <td>Route</td>
              <td>Location</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {data?.map((farmer) => (
              <tr key={farmer._id} className="hover:bg-base-200 cursor-pointer">
                <td>{farmer._id}</td>
                <td>{farmer.name}</td>
                <td>{farmer.address}</td>
                <td>{farmer.phone ?? "N/A"}</td>
                <td>{farmer.route}</td>
                <td>N/A</td>
                <td className="flex gap-2 justify-end">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openMapModal({
                        lat: farmer.location.lat,
                        lng: farmer.location.lon,
                      })
                    }
                  >
                    <MapPin className="size-4" />
                  </button>

                  <button
                    className="btn btn-warning btn-ghost btn-sm"
                    onClick={() => openUpdateModal(farmer)}
                  >
                    <Pen className="size-4" />
                  </button>

                  <button
                    className="btn btn-error btn-sm btn-ghost"
                    onClick={() => openDeleteModal(farmer)}
                  >
                    <Trash className="size-4" />
                  </button>
                </td>
                {}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerPage;
