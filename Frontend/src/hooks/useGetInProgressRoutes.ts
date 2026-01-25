import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { Route } from "./useGenerateRoutes";

const useGetInProgressRoutes = () => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["routes", "InProgress"],
    queryFn: async () => {
      const res = await api.get("/routing/in_progress");

      return res.data;
    },
  });
};

export default useGetInProgressRoutes;
