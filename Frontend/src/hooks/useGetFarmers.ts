import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import type { Farmer } from "./useGenerateRoutes";

interface QueryParams {
  search: string;
  filterBy: string;
  route: string;
}

const useGetFarmers = (filters: QueryParams) => {
  return useQuery<Farmer[], AxiosError<APIError>>({
    queryKey: ["farmers", { ...filters }],
    queryFn: async () => {
      const res = await api.get("/farmer", {
        params: filters,
      });
      return res.data;
    },
    enabled: !!filters,
  });
};

export default useGetFarmers;
