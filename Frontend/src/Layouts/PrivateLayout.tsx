import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import FullLoadingPage from "../components/Loading/FullLoadingPage";

const PrivateLayout = () => {
  const { data: user, isError, isLoading } = useAuth();

  if (isLoading) return <FullLoadingPage />;

  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  // Must reset password
  if (user.requirePasswordChange) {
    return <Navigate to="/password-reset" replace />;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100">
        {/* Navbar */}

        <nav className="shrink-0">
          <NavBar />
        </nav>

        {/* Main Content */}
        <div className="flex-1 grow p-4">
          <Outlet />
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default PrivateLayout;
