import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/apiClient";
import type { APIError } from "./useGetProductions";
import type { AxiosError } from "axios";
import type { Driver } from "./useGetDrivers";
import toast from "react-hot-toast";

export interface UpdateDriverProps {
  _id: string;
  name: string;
  phone: string;
  driver_license_no: string;
}

const useUpdateDriver = (options?: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation<Driver, AxiosError<APIError>, UpdateDriverProps>({
    mutationFn: async (payload) => {
      const res = await api.put(`/driver/${payload._id}`, {
        name: payload.name,
        phone: payload.phone,
        driver_license_no: payload.driver_license_no,
      });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      options?.onSuccess();
      toast.success("Driver updated successfully");
    },
  });
};

export default useUpdateDriver;
