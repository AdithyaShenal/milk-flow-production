import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useGetProductions";
import toast from "react-hot-toast";

export interface CreateTruckProps {
  license_no: string;
  capacity: number;
  model: string;
  distance_travelled: number;
  route: number;
}

const useAddTrucks = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>, CreateTruckProps>({
    mutationFn: async (payload) => {
      const res = await api.post("/trucks", payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      options?.onSuccess();
      toast.success("Truck added successfully");
    },
  });
};

export default useAddTrucks;
