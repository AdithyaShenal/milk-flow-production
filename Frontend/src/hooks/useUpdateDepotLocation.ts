import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

interface LocationProps {
  depotCoords: {
    lat: number;
    lon: number;
  };
}

const useUpdateDepotLocation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, LocationProps>({
    mutationFn: async (location) => {
      const res = await api.patch("/config/map", location);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });
};

export default useUpdateDepotLocation;
