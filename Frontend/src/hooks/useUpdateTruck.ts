import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { APIError } from "./useGetProductions";
import type { AxiosError } from "axios";
import { api } from "../services/apiClient";
import type { Truck } from "./useGetTrucks";
import toast from "react-hot-toast";

export interface UpdateTruckProps {
  _id: string;
  license_no: string;
  capacity: number;
  model: string;
  distance_travelled: number;
  route: number;
}

const useUpdateTrucks = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<Truck, AxiosError<APIError>, UpdateTruckProps>({
    mutationFn: async (payload) => {
      const res = await api.put(`/trucks/${payload._id}`, {
        license_no: payload.license_no,
        capacity: payload.capacity,
        model: payload.model,
        distance_travelled: payload.distance_travelled,
        route: payload.route,
      });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      options?.onSuccess();
      toast.success("Truck updated successfully");
    },
  });
};

export default useUpdateTrucks;
