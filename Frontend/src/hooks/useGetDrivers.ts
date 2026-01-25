import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";

export interface Driver {
  _id: string;
  name: string;
  phone?: string;
  status: "available" | "unavailable" | "onDuty";
  driver_license_no: string;
  shortName: string;
  pinNo: string;
}

interface QueryParams {
  search: string;
  filterBy: string;
  status: string;
}

const useGetDrivers = (filters: QueryParams) => {
  return useQuery<Driver[], AxiosError<APIError>>({
    queryKey: ["drivers", { ...filters }],
    queryFn: async () => {
      const res = await api.get("/driver", {
        params: filters,
      });

      return res.data;
    },
    enabled: !!filters,
  });
};

export default useGetDrivers;
