import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";

export interface Truck {
  _id: string;
  license_no: string;
  capacity?: number;
  status: "available" | "unavailable" | "inService";
  model: string;
  distance_travelled?: number;
  route?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QueryParams {
  search: string;
  filterBy: string;
  status: string;
}

const useGetTrucks = (filters: QueryParams) => {
  return useQuery<Truck[], AxiosError<APIError>>({
    queryKey: ["trucks", { ...filters }],
    queryFn: async () => {
      const res = await api.get("/trucks", {
        params: filters,
      });

      return res.data;
    },
    enabled: !!filters,
  });
};

export default useGetTrucks;
