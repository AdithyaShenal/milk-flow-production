import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import type { Route } from "./useGenerateRoutes";

const useDispatchRoutes = () => {
  return useMutation<unknown, AxiosError<APIError>, Route[]>({
    mutationFn: async (routes: Route[]) => {
      const res = await api.post("/routing/dispatch", routes);
      return res.data;
    },
  });
};

export default useDispatchRoutes;
