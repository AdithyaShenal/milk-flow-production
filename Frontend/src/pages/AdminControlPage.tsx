import { Plus, Trash, TrendingUp } from "lucide-react";
import FullLoadingPage from "../components/Loading/FullLoadingPage";
import useGetAdmins from "../hooks/useGetAdmins";
import { useState } from "react";
import CreateAdmin from "../components/Modals/Admin/CreateAdmin";
import DeleteAdmin from "../components/Modals/Admin/DeleteAdmin";
import PromoteAdmin from "../components/Modals/Admin/PromoteAdmin";

type AdminModalState =
  | { type: null }
  | { type: "delete"; adminId: string }
  | { type: "promote"; adminId: string }
  | { type: "new" };

const AdminControlPage = () => {
  const { data: admins, isError, error, isLoading } = useGetAdmins();
  const [modal, setModal] = useState<AdminModalState>({ type: null });

  if (isLoading) return <FullLoadingPage />;

  const openNewAdmin = () => setModal({ type: "new" });

  const openDeleteAdmin = (adminId: string) =>
    setModal({ type: "delete", adminId: adminId });

  const openPromoteAdmin = (adminId: string) =>
    setModal({ type: "promote", adminId: adminId });

  const closeModal = () => setModal({ type: null });

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">Admin Control Panel</p>
          <button className="btn btn-primary btn-sm" onClick={openNewAdmin}>
            <Plus className="size-3" />
            <p className="text-sm">New Admin</p>
          </button>
        </div>

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

        {/* Modals */}
        {modal.type === "new" && (
          <CreateAdmin open onClose={closeModal} title="Add New Admin" />
        )}

        {modal.type === "delete" && (
          <DeleteAdmin
            open
            onClose={closeModal}
            title="Delete Admin"
            subtitle="Are you sure you want to delete this admin?"
            adminId={modal.adminId}
          />
        )}

        {modal.type === "promote" && (
          <PromoteAdmin
            open
            onClose={closeModal}
            title="Promote Admin"
            subtitle="Promote this admin to a Super Admin?"
            adminId={modal.adminId}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto h-auto w-auto border border-slate-300 rounded-sm">
          <table className="table table-md table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <td>Admin ID</td>
                <td>Name</td>
                <td>Role</td>
                <td>Username</td>
                <td>email</td>
                <td>Date of Birth</td>
                <td>Phone</td>
                <td>Created Date</td>
                <td>Is Active</td>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll">
              {admins?.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin._id}</td>
                  <td>{admin.name}</td>
                  <td>{admin.role}</td>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>
                    {admin.dob && new Date(admin.dob).toLocaleDateString()}
                  </td>
                  <td>{admin.phone}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>{admin.isActive}</td>
                  <td className="flex gap-2 justify-end">
                    <button
                      className="btn btn-primary btn-sm btn-ghost"
                      onClick={() => openPromoteAdmin(admin._id)}
                    >
                      <TrendingUp className="size-4" />
                    </button>
                    <button
                      className="btn btn-error btn-sm btn-ghost"
                      onClick={() => openDeleteAdmin(admin._id)}
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
    </>
  );
};

export default AdminControlPage;
