import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../services/apiClient";
import type { Production } from "./useGenerateRoutes";

export interface APIError {
  message: string;
  details: string | null;
  status: number;
  code: string;
}

interface QueryParams {
  search: string;
  filterBy: string;
  date: string;
  status: string;
}

const useGetProductions = (filters: QueryParams) => {
  return useQuery<Production[], AxiosError<APIError>>({
    queryKey: ["productions", { ...filters }],
    queryFn: async () => {
      const res = await api.get("/production", {
        params: filters,
      });
      return res.data;
    },
    enabled: !!filters,
  });
};

export default useGetProductions;
