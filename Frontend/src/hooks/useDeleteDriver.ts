import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

const useDeleteDriver = (options: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: async (driverId) => {
      const res = await api.delete(`/driver/${driverId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      options.onSuccess?.();
      toast.success("Driver deleted successfully");
    },
  });
};

export default useDeleteDriver;
