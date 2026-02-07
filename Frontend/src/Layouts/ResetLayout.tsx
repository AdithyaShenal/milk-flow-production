import { Navigate, Outlet } from "react-router-dom";
import FullLoadingPage from "../components/Loading/FullLoadingPage";
import useAuth from "../hooks/useAuth";

const ResetLayout = () => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return <FullLoadingPage />;

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Already reset → block access
  if (!user.requirePasswordChange) {
    return <Navigate to="/app" replace />;
  }

  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default ResetLayout;
