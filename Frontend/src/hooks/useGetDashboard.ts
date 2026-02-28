import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";

interface DashboardData {
  milkCollectedToday: number;
  pendingRequestsToday: number;
  completedRequestsToday: number;
  totalRouteDistanceToday: number;

  milkCollectionTrend: Array<{
    date: string;
    volume: number;
  }>;

  routeStatusBreakdown: Array<{ status: string; count: number }>;
  weeklyDistanceTrend: Array<{ date: string; distance: number }>;
  weeklyFailedPickups: Array<{ date: string; failures: number }>;

  fleetStatus: {
    available: number;
    inService: number;
    unavailable: number;
  };

  driverStatus: {
    available: number;
    onDuty: number;
    unavailable: number;
  };

  farmersByRoute: Array<{
    route: string;
    farmers: number;
  }>;

  vehicleVolumeAllocation: Array<{
    vehicle: string;
    volume: number;
    stops: number;
  }>;

  systemMetrics: {
    totalFarmers: number;
    totalDrivers: number;
    totalTrucks: number;
    activeRoutes: number;
  };
}

const useGetDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashoard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
  });
};

export default useGetDashboard;
