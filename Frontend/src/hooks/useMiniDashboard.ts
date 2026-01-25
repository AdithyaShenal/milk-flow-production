import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";

interface MiniDashboardProps {
  totalVolume: number;
  availableCapacity: number;
  autoResolvability: boolean;
  routeWiseResolvability: boolean;
  autoClusterization: boolean;
  routeWiseClusterization: boolean;
}

const useMiniDashboard = () => {
  return useQuery<MiniDashboardProps, AxiosError<APIError>>({
    queryKey: ["mini_dashboard"],
    queryFn: async () => {
      const res = await api.get("/analytics/mini_dashboard");
      return res.data;
    },
  });
};

export default useMiniDashboard;
