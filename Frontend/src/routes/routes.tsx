import { createBrowserRouter } from "react-router-dom";
import RoutingPage from "../pages/RoutingPage";
import ProductionPage from "../pages/ProductionPage";
import FleetPage from "../pages/FleetPage";
import FarmerPage from "../pages/FarmerPage";
import ConfigPage from "../pages/ConfigPage";
import RouteControlPage from "../pages/RouteControlPage";
import HomePage from "../pages/HomePage";
import RouteHistoryPage from "../pages/RouteHistoryPage";
import DriverManagement from "../components/DriverManagement";
import TruckManagement from "../components/TruckManagement";
import LoginPage from "../pages/LoginPage";
import AdminProfilePage from "../pages/AdminProfilePage";
import PublicLayout from "../Layouts/PublicLayout";
import PrivateLayout from "../Layouts/PrivateLayout";
import AdminControlPage from "../pages/AdminControlPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import ResetLayout from "../Layouts/ResetLayout";
import InProgressRoutes from "../components/InProgressRoutes";
import DispatchedRoutes from "../components/DispatchedRoutes";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/password-reset",
    element: <ResetLayout />,
    children: [
      {
        index: true,
        element: <PasswordResetPage />,
      },
    ],
  },
  {
    path: "/app",
    element: <PrivateLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "homePage", element: <HomePage /> },
      { path: "adminProfile", element: <AdminProfilePage /> },
      { path: "routing", element: <RoutingPage /> },
      { path: "production", element: <ProductionPage /> },
      {
        path: "fleet",
        element: <FleetPage />,
        children: [
          {
            index: true,
            element: <DriverManagement />,
          },
          {
            path: "trucks",
            element: <TruckManagement />,
          },
        ],
      },
      { path: "farmer", element: <FarmerPage /> },
      { path: "config", element: <ConfigPage /> },
      {
        path: "route_control",
        element: <RouteControlPage />,
        children: [
          { index: true, element: <InProgressRoutes /> },
          { path: "in-progress", element: <InProgressRoutes /> },
          { path: "dispatched", element: <DispatchedRoutes /> },
        ],
      },
      { path: "route_history", element: <RouteHistoryPage /> },
      { path: "admin_control", element: <AdminControlPage /> },
    ],
  },
]);

export default router;
