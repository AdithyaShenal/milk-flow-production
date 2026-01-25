import { useQuery } from "@tanstack/react-query";
import type { APIError } from "./useGetProductions";
import type { AxiosError } from "axios";
import { api } from "../services/apiClient";

export interface Farmer {
  _id: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
  name: string;
  route: number;
  updatedAt: string;
  createdAt: string;
  phone?: string;
}

interface QualityProps {
  fat: number;
  lat: number;
  density: number;
  water_ratio: number;
}

export interface Production {
  _id: string;
  farmer: Farmer;
  volume: number;
  registration_time: string;
  failure_reason: string;
  status: string;
  collectedVolume?: number;
  blocked: boolean;
  quality: QualityProps;
}

interface Stop {
  load_after_visit: number;
  node: number;
  order: number;
  production: Production | null;
}

export interface Route {
  _id: string;
  distance: number;
  stops: Stop[];
  vehicle_id: number;
  license_no: string;
  load: number;
  status: string;
  model: string;
  route: number;
}

const useGenerateRoutes = (
  routeWiseResolve: boolean,
  selectedRoute: number,
) => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: routeWiseResolve
      ? ["routes", "route-wise", selectedRoute]
      : ["routes", "auto"],

    queryFn: async () => {
      if (!routeWiseResolve) {
        const res = await api.get("/routing/optimize/auto");
        return res.data;
      }

      // Route-wise mode
      if (selectedRoute === 0) {
        const res_1 = await api.get("/routing/optimize/route-wise/all");
        return res_1.data;
      }

      const res_2 = await api.get(
        `/routing/optimize/route-wise/${selectedRoute}`,
      );
      return res_2.data;
    },
    retry: 1,
    enabled: false,
  });
};

export default useGenerateRoutes;
