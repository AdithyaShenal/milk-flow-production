import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

interface ToggleTruckStatusProps {
  truckId: string;
  status: "available" | "unavailable";
}

export const useToggleTruckStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, ToggleTruckStatusProps>({
    mutationFn: async ({ truckId, status }) => {
      const res = await api.patch(`/trucks/status/${truckId}`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Truck status changed");
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });
};
