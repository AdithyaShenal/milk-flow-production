import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";

interface DriverToggleProps {
  driverId: string;
  status: "available" | "unavailable";
}

export const useToggleDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, DriverToggleProps>({
    mutationFn: async ({ driverId, status }) => {
      const res = await api.patch(`/driver/status/${driverId}`, {
        status,
      });
      return res.data;
    },

    onSuccess: () => {
      toast.success("Driver status changed");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};
