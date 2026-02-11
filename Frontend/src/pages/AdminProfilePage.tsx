import { Pencil, Shield, User, Mail, Phone, Calendar } from "lucide-react";

import profileImage from "../assets/images/user_profile.png";
import useAuth from "../hooks/useAuth";
import FullLoadingPage from "../components/Loading/FullLoadingPage";

const ProfilePage = () => {
  const { data: user, isLoading, isError, error } = useAuth();

  if (isLoading) return <FullLoadingPage />;

  return (
    <>
      {/* Error */}

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

      <div className="min-h-screen bg-base-100">
        <p className="font-semibold text-sm mb-4">Admin Profile Information</p>

        <div className="bg-base-200 rounded-sm border border-base-300 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="avatar avatar-online rounded-full ring-2 ring-black/20">
              <div className="rounded-full">
                <img src={profileImage} className="size-20" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-base-content">
                {user?.name}
              </h2>

              <p className="flex items-center gap-2 text-sm text-base-content mt-1">
                <Shield size={14} /> {user?.role}
              </p>
            </div>
          </div>

          <button className="btn btn-primary">
            <Pencil className="size-4" />
            Edit
          </button>
        </div>

        <div className="bg-base-200 rounded-sm border border-base-300 text-base-content p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Account Info</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm">ID</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <User size={14} /> {user?._id}
              </p>
            </div>
            <div>
              <p className="text-sm">Username</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <User size={14} /> {user?.username}
              </p>
            </div>

            <div>
              <p className="text-sm">Name</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <User size={14} /> {user?.name}
              </p>
            </div>

            <div>
              <p className="text-sm">User Role</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Shield size={14} /> {user?.role}
              </p>
            </div>

            <div>
              <p className="text-sm">Created Date</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Shield size={14} /> {user?.createdAt}
              </p>
            </div>

            <div>
              <p className="text-sm">Is Active</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Shield size={14} /> {user?.isActive ? "Active" : "Deactivated"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-base-200 rounded-sm border border-base-300 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-base-content">Name</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <User size={14} /> {user?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content">Date of Birth</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Calendar size={14} /> {user?.dob || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content">Email Address</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Mail size={14} /> {user?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content">Phone Number</p>
              <p className="flex items-center gap-2 font-medium mt-1">
                <Phone size={14} /> {user?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
