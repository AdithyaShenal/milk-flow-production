import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "loginPage", element: <LoginPage /> },
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
      { path: "route_control", element: <RouteControlPage /> },
      { path: "route_history", element: <RouteHistoryPage /> },
    ],
  },
]);

export default router;
