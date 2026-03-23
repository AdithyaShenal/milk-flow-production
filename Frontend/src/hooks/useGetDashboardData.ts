import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

export interface DashboardData {
  milkCollectedToday: number;
  pendingRequestsToday: number;
  completedRequestsToday: number;
  totalRouteDistanceToday: number;

  systemMetrics: {
    totalFarmers: number;
    totalDrivers: number;
    totalTrucks: number;
    activeRoutes: number;
  };

  // REAL WEEKLY DATA FROM BACKEND
  weeklyCharts: {
    litersPerDay: { x: string; y: number }[];
  };
}

const useGetDashboardData = () => {
  return useQuery<DashboardData, AxiosError<APIError>>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard"); // correct endpoint
      return res.data;
    },
  });
};

export default useGetDashboardData;
