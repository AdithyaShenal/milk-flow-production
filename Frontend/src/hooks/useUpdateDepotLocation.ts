import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

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
      toast.success("Depot Location Updated");
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });
};

export default useUpdateDepotLocation;
