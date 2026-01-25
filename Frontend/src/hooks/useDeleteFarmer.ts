import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

const useDeleteFarmer = (options: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: async (farmerId) => {
      const res = await api.delete(`/farmer/${farmerId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      options.onSuccess?.();
      toast.success("Farmer deleted successfully");
    },
  });
};

export default useDeleteFarmer;
