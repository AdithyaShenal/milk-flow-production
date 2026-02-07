import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicLayout = () => {
  const { data: user } = useAuth();

  if (user && user.requirePasswordChange) {
    return <Navigate to="/password-reset" replace />;
  }

  if (!!user && !user.requirePasswordChange) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100">
        <div className="flex-1 grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
