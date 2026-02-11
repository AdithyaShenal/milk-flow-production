import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";

export interface DashboardData {
  summaryCards: {
    totalLitersToday: number;
    totalLitersThisMonth: number;
    avgPickupsPerVehicle: number;
    totalProductionPending: number;
  };
  weeklyCharts: {
    litersPerDay: Array<{ x: string; y: number }>;
    distancePerDay: Array<{ x: string; y: number }>;
    productionStatusRatio: {
      completed: number;
      failed: number;
    };
  };
  additionalCharts: {
    productionsPerDay: Array<{ date: string; productions: number }>;
    qualityTrends: {
      avgFatContent: number;
      avgDensity: number;
      rejectionRate: number;
    };
    routeEfficiency: {
      mostEfficientRoute: number;
      avgCollectionTime: number;
      routeUtilization: number;
    };
  };
  rawData: {
    todayDate: string;
    weekStart: string;
    dataPoints: number;
  };
}

const useGetDashboardData = () => {
  return useQuery<DashboardData, AxiosError<APIError>>({
    queryKey: ["dashboard", "analytics"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data.data;
    },

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};

export default useGetDashboardData;
