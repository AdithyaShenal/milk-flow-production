import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import type { Route } from "./useGenerateRoutes";

const useGetDispatchRoutes = () => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["routes", "dispatched"],
    queryFn: async () => {
      const res = await api.get("/routing/dispatch");
      return res.data;
    },
  });
};

export default useGetDispatchRoutes;
