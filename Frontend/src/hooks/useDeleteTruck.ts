import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";

interface DeleteProps {
  truckId: string;
}

const useDeleteTrucks = (options: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, DeleteProps>({
    mutationFn: async (deleteProps) => {
      const res = await api.delete(`/trucks/${deleteProps.truckId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      options?.onSuccess?.();
      toast.success("Truck deleted successfully");
    },
  });
};

export default useDeleteTrucks;
