import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import type { Route } from "./useGenerateRoutes";

const useGetHistory = () => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api.get("/routing/history");
      return res.data;
    },
  });
};

export default useGetHistory;
